"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Shuffle, Tv, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { VideoStage } from "@/components/shared/tv-player/video-stage";
import { ChannelBrowser } from "@/components/shared/tv-player/channel-browser";
import { useHlsPlayer } from "@/hooks/use-hls-player";
import { CHANNEL_DATA } from "@/constants/channels";
import type { Channel } from "@/types/channel.type";

export function LiveTvSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { status, statusMessage, behindLive, play, syncToLive } =
    useHlsPlayer(videoRef);
  const [current, setCurrent] = useState<Channel | null>(
    () => CHANNEL_DATA.channels.find((c) => c.name === "BTV NS") ?? CHANNEL_DATA.channels[0] ?? null,
  );

  useEffect(() => {
    if (current) play(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectChannel = (channel: Channel) => {
    setCurrent(channel);
    play(channel);
  };

  const step = (delta: number) => {
    const channels = CHANNEL_DATA.channels;
    if (!channels.length || !current) return;
    const idx = channels.findIndex((c) => c.name === current.name);
    const next = channels[(idx + delta + channels.length) % channels.length];
    selectChannel(next);
  };

  const shuffle = () => {
    const channels = CHANNEL_DATA.channels;
    if (channels.length < 2) return;
    let next: Channel;
    do {
      next = channels[Math.floor(Math.random() * channels.length)];
    } while (next.name === current?.name);
    selectChannel(next);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-400 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-red-600 text-white">
              <Tv className="size-4.5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-red-600">Live</span> TV
            </span>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Watch page */}
      <main className="mx-auto max-w-400 px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_402px]">
          {/* Left: player + meta */}
          <div className="flex min-w-0 flex-col gap-3">
            <VideoStage
              videoRef={videoRef}
              status={status}
              statusMessage={statusMessage}
              behindLive={behindLive}
              onSyncToLive={syncToLive}
            />

            <h1 className="text-lg font-bold sm:text-xl">
              {current?.name ?? "Pick a channel"}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
              {/* Channel identity — like YouTube's channel row */}
              <div className="flex items-center gap-3">
                {current?.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.logo}
                    alt=""
                    className="size-10 shrink-0 rounded-full border bg-muted object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility =
                        "hidden";
                    }}
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted">
                    <Tv className="size-4 text-muted-foreground" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {current?.name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {current?.group ?? "—"} · Live
                  </p>
                </div>
              </div>

              {/* Actions — YouTube-style pills */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => step(-1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="size-4" /> Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => step(1)}
                  className="rounded-full"
                >
                  Next <ChevronRight className="size-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={shuffle}
                  className="rounded-full"
                >
                  <Shuffle className="size-4" /> Switch
                </Button>
                <Button size="sm" onClick={syncToLive} className="rounded-full">
                  <Zap className="size-3.5" /> Sync to Live
                </Button>
              </div>
            </div>
          </div>

          {/* Right: up next */}
          <aside className="flex min-w-0 flex-col gap-3">
            <ChannelBrowser
              channels={CHANNEL_DATA.channels}
              groupsOrder={CHANNEL_DATA.groups_order}
              activeChannel={current}
              onSelect={selectChannel}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
