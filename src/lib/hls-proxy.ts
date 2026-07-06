const UPSTREAM_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "*/*",
};

const FETCH_TIMEOUT_MS = 8000;

export async function fetchUpstream(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { headers: UPSTREAM_HEADERS, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

function looksLikePlaylist(contentType: string | null, url: string) {
  return !!contentType?.includes("mpegurl") || url.split("?")[0].toLowerCase().endsWith(".m3u8");
}

const URI_ATTR_RE = /URI="([^"]+)"/;

export function rewritePlaylist(text: string, baseUrl: string, origin: string): string {
  const lines = text.split(/\r?\n/);
  const rewritten = lines.map((line) => {
    // Any tag line carrying a URI="..." attribute — EXT-X-KEY, EXT-X-MAP,
    // EXT-X-MEDIA (alternate audio/subtitle tracks), etc.
    if (line.startsWith("#") && URI_ATTR_RE.test(line)) {
      const match = line.match(URI_ATTR_RE)!;
      const absolute = new URL(match[1], baseUrl).toString();
      const proxied = `${origin}/api/stream/segment?u=${encodeURIComponent(absolute)}`;
      return line.replace(URI_ATTR_RE, `URI="${proxied}"`);
    }
    if (line.trim() === "" || line.startsWith("#")) return line;
    const absolute = new URL(line.trim(), baseUrl).toString();
    return `${origin}/api/stream/segment?u=${encodeURIComponent(absolute)}`;
  });
  return rewritten.join("\n");
}

export async function proxyPlaylistResponse(upstreamUrl: string, origin: string) {
  const res = await fetchUpstream(upstreamUrl);
  if (!res.ok) {
    return new Response("Upstream error", { status: 502 });
  }
  const text = await res.text();
  const rewritten = rewritePlaylist(text, upstreamUrl, origin);
  return new Response(rewritten, {
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl",
      "Cache-Control": "no-store",
    },
  });
}

export async function proxySegmentResponse(upstreamUrl: string, origin: string) {
  const res = await fetchUpstream(upstreamUrl);
  if (!res.ok || !res.body) {
    return new Response("Upstream error", { status: 502 });
  }

  const contentType = res.headers.get("content-type");

  if (looksLikePlaylist(contentType, upstreamUrl)) {
    const text = await res.text();
    const rewritten = rewritePlaylist(text, upstreamUrl, origin);
    return new Response(rewritten, {
      headers: { "Content-Type": "application/vnd.apple.mpegurl", "Cache-Control": "no-store" },
    });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": contentType ?? "video/mp2t",
      "Cache-Control": "no-store",
    },
  });
}
