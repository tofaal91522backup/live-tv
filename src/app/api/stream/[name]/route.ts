import { NextRequest } from "next/server";
import { CHANNEL_DATA } from "@/constants/channels";
import { proxyPlaylistResponse } from "@/lib/hls-proxy";

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const channel = CHANNEL_DATA.channels.find((c) => c.name === name);
  if (!channel) {
    return new Response("Channel not found", { status: 404 });
  }

  const attempt = Number(req.nextUrl.searchParams.get("i") ?? "0");
  const url = channel.urls[attempt] ?? channel.urls[0];
  if (!url) {
    return new Response("No source for channel", { status: 404 });
  }

  return proxyPlaylistResponse(url, req.nextUrl.origin);
}
