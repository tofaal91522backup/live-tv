import { NextRequest } from "next/server";
import { proxySegmentResponse } from "@/lib/hls-proxy";

export async function GET(req: NextRequest) {
  const encoded = req.nextUrl.searchParams.get("u");
  if (!encoded) {
    return new Response("Missing u param", { status: 400 });
  }

  const url = decodeURIComponent(encoded);
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return new Response("Invalid url", { status: 400 });
  }

  return proxySegmentResponse(url, req.nextUrl.origin);
}
