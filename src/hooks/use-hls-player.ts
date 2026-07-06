"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type { Channel } from "@/types/channel.type";

export type PlayerStatus = "idle" | "loading" | "playing" | "error";

function streamKind(url: string): "hls" | "dash" {
  const clean = url.split("?")[0].split("#")[0];
  return clean.endsWith(".mpd") ? "dash" : "hls";
}

export function useHlsPlayer(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [behindLive, setBehindLive] = useState(false);
  const playRef = useRef<(channel: Channel, attempt?: number) => void>(() => {});

  const teardown = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  const play = useCallback(
    (channel: Channel, attempt = 0) => {
      const video = videoRef.current;
      if (!video) return;

      teardown();
      video.pause();
      video.removeAttribute("src");
      video.load();
      setBehindLive(false);

      const url = channel.urls[attempt];
      if (!url) {
        setStatus("error");
        setStatusMessage(`No working source found for ${channel.name}.`);
        return;
      }

      if (streamKind(url) === "dash") {
        setStatus("error");
        setStatusMessage(`This source needs DASH support — try another channel.`);
        return;
      }

      setStatus("loading");
      setStatusMessage(
        attempt > 0
          ? `Trying backup source ${attempt + 1}/${channel.urls.length}…`
          : `Loading ${channel.name}…`
      );

      const tryNext = () => {
        if (attempt + 1 < channel.urls.length) {
          playRef.current(channel, attempt + 1);
        } else {
          setStatus("error");
          setStatusMessage(`${channel.name} appears to be offline right now.`);
        }
      };

      if (Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 30, enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setStatus("playing");
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) tryNext();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.addEventListener("loadedmetadata", () => setStatus("playing"), { once: true });
        video.addEventListener("error", tryNext, { once: true });
        video.play().catch(() => {});
      } else {
        setStatus("error");
        setStatusMessage("Your browser can't play HLS streams.");
      }
    },
    [teardown, videoRef]
  );

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  const syncToLive = useCallback(() => {
    const video = videoRef.current;
    const hls = hlsRef.current;
    if (!video) return;
    if (hls && hls.liveSyncPosition != null) {
      video.currentTime = hls.liveSyncPosition;
    } else if (video.seekable.length) {
      video.currentTime = video.seekable.end(video.seekable.length - 1);
    }
    video.play().catch(() => {});
    setBehindLive(false);
  }, [videoRef]);

  // Detect drift from the live edge so the "sync to live" affordance can light up.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      const hls = hlsRef.current;
      const liveEdge = hls?.liveSyncPosition;
      if (liveEdge == null || !Number.isFinite(liveEdge)) return;
      setBehindLive(liveEdge - video.currentTime > 12);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [videoRef]);

  useEffect(() => teardown, [teardown]);

  return { status, statusMessage, behindLive, play, syncToLive };
}
