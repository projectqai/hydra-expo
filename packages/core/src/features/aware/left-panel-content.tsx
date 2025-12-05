import { FlashList } from "@shopify/flash-list";
import { AlertTriangle, Crosshair } from "lucide-react-native";
import { Text, View } from "react-native";

import type { Entity } from "../../lib/api/generated/world_pb";
import {
  formatAltitude,
  formatTime,
  getEntityName,
  getTrackStatus,
  isExpired,
  isTrack,
} from "../../lib/api/use-track-utils";
import { EntityTrackCard } from "./entity-track-card";
import { useEntityStore } from "./store/entity-store";
import { useMapEngine } from "./store/map-engine-store";
import { useSelectionStore } from "./store/selection-store";

type TrackData = {
  id: string;
  name: string;
  time?: string;
  altitude: string;
  status: "Friend" | "Hostile" | "Neutral" | "Unknown";
  entity: Entity;
};

function entityToTrackData(entity: Entity): TrackData {
  return {
    id: entity.id,
    name: getEntityName(entity),
    time: formatTime(entity.lifetime?.from || entity.detection?.lastMeasured),
    altitude: formatAltitude(entity.geo?.altitude),
    status: getTrackStatus(entity.symbol?.milStd2525C || ""),
    entity,
  };
}

function SectionHeader() {
  return (
    <View className="mb-2 flex-row items-center justify-between">
      <Text className="font-sans-semibold text-foreground/90 text-[11px] tracking-wider uppercase">
        Tracks
      </Text>
      <Crosshair size={14} color="white" opacity={0.5} strokeWidth={2} />
    </View>
  );
}

export function CollapsedStats() {
  const trackCount = useEntityStore(
    (s) => Array.from(s.entities.values()).filter((e) => isTrack(e) && !isExpired(e)).length,
  );
  const alertCount = 0;

  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row items-center gap-1.5">
        <AlertTriangle size={15} color="rgba(255, 255, 255, 0.5)" strokeWidth={2} />
        <Text className="font-sans-semibold text-foreground/80 text-xs">{alertCount} Alerts</Text>
      </View>

      <Text className="text-foreground/40 text-xl leading-none">•</Text>

      <View className="flex-row items-center gap-1.5">
        <Crosshair size={15} color="white" opacity={0.5} strokeWidth={2} />
        <Text className="font-sans-semibold text-foreground/80 text-xs">{trackCount} Tracks</Text>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 px-6 pt-16 select-none">
      <View className="items-center">
        <View className="opacity-30">
          <Crosshair size={28} color="rgba(255, 255, 255)" strokeWidth={1.5} />
        </View>
        <Text className="font-sans-medium text-foreground/50 mt-2 text-center text-sm">
          No tracks detected
        </Text>
        <Text className="text-foreground/30 text-center font-sans text-xs leading-relaxed">
          Waiting for tracked objects
        </Text>
      </View>
    </View>
  );
}

export function LeftPanelContent() {
  const entities = useEntityStore((s) => s.entities);
  const select = useSelectionStore((s) => s.select);
  const mapEngine = useMapEngine();

  const handlePinPress = (track: TrackData) => {
    select(track.id);
    if (track.entity.geo) {
      mapEngine.flyTo(
        track.entity.geo.latitude,
        track.entity.geo.longitude,
        track.entity.geo.altitude,
      );
    }
  };

  const tracks = Array.from(entities.values())
    .filter((entity) => isTrack(entity) && !isExpired(entity))
    .map(entityToTrackData)
    .sort((a, b) => {
      const timeA = a.entity.lifetime?.from?.seconds || BigInt(0);
      const timeB = b.entity.lifetime?.from?.seconds || BigInt(0);
      return Number(timeB - timeA);
    });

  if (tracks.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlashList
      data={tracks}
      renderItem={({ item }) => (
        <EntityTrackCard
          name={item.name}
          time={item.time}
          altitude={item.altitude}
          status={item.status}
          onPress={() => handlePinPress(item)}
        />
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<SectionHeader />}
      contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 12 }}
    />
  );
}
