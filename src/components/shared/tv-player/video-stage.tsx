"use client";

import { useEffect, useState } from "react";
import { Loader2, Radio, TriangleAlert, VolumeX, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PlayerStatus } from "@/hooks/use-hls-player";

export function VideoStage({
  videoRef,
  status,
  statusMessage,
  behindLive,
  onSyncToLive,
  className,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: PlayerStatus;
  statusMessage: string;
  behindLive: boolean;
  onSyncToLive: () => void;
  className?: string;
}) {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onVolumeChange = () => setMuted(video.muted);
    video.addEventListener("volumechange", onVolumeChange);
    return () => video.removeEventListener("volumechange", onVolumeChange);
  }, [videoRef]);

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-lg",
        className
      )}
    >
      <video
        ref={videoRef}
        controls
        playsInline
        autoPlay
        muted
        className="size-full bg-black"
      />

      {status !== "playing" && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 px-6 text-center text-sm text-white/80",
            status === "error" && "text-red-300"
          )}
        >
          {status === "loading" && <Loader2 className="size-8 animate-spin text-white" />}
          {status === "error" && <TriangleAlert className="size-8 text-red-400" />}
          <p>{statusMessage || "Pick a channel to start watching."}</p>
        </div>
      )}

      {status === "playing" && (
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Radio className="size-3 animate-pulse text-red-500" />
          LIVE
        </div>
      )}

      {status === "playing" && muted && (
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (video) video.muted = false;
          }}
          className="absolute top-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-red-600"
        >
          <VolumeX className="size-3.5" />
          Muted — click for sound
        </button>
      )}

      {status === "playing" && behindLive && (
        <Button size="sm" onClick={onSyncToLive} className="absolute bottom-3 right-3 gap-1.5 shadow-lg">
          <Zap className="size-3.5" />
          Sync to Live
        </Button>
      )}
    </div>
  );
}
