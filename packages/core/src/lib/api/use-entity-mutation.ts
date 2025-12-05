import { create } from "@bufbuild/protobuf";
import { useState } from "react";

import { useEntityStore } from "../../features/aware/store/entity-store";
import type { Entity } from "./generated/world_pb";
import { GeoSpatialComponentSchema } from "./generated/world_pb";
import { worldClient } from "./world-client";

export function useEntityMutation() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const updateEntity = useEntityStore((s) => s.updateEntity);

  const updateEntityLocation = async (
    entity: Entity,
    geo: { latitude: number; longitude: number; altitude: number },
  ) => {
    const previousGeo = entity.geo;
    const geoComponent = create(GeoSpatialComponentSchema, geo);

    setIsPending(true);
    setError(null);
    updateEntity(entity.id, { geo: geoComponent });

    try {
      const response = await worldClient.push({
        changes: [{ ...entity, geo: geoComponent }],
      });

      if (!response.accepted) {
        throw new Error(response.debug || "Server rejected update");
      }
    } catch (err) {
      updateEntity(entity.id, { geo: previousGeo });
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { updateEntityLocation, isPending, error };
}
