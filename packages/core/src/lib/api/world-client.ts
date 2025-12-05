import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { fetch } from "expo/fetch";
import Constants from "expo-constants";

import { WorldService } from "./generated/world_pb";

function getBaseUrl() {
  if (Constants.expoConfig?.extra?.PUBLIC_HYDRA_API_URL) {
    return Constants.expoConfig.extra.PUBLIC_HYDRA_API_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:50051";
}

const baseUrl = getBaseUrl();

const transport = createConnectTransport({
  baseUrl,
  useBinaryFormat: false,
  fetch: fetch as unknown as typeof globalThis.fetch,
});

export const worldClient = createClient(WorldService, transport);
