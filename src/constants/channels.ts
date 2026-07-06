import raw from "./channels.json";
import type { Channel, ChannelData } from "@/types/channel.type";

export const CHANNEL_DATA = raw as ChannelData;

// Curated World Cup line-up — exactly these channels, nothing else.
const FIFA_NAMES = new Set([
  "Somoy TV NS",
  "BTV NS",
  "T Sports",
  "BTV B",
  "Mahsun Sports",
  "beIN Sports",
]);

export function isFifaChannel(channel: Channel) {
  return FIFA_NAMES.has(channel.name);
}

export const FIFA_CHANNELS = CHANNEL_DATA.channels.filter(isFifaChannel);
