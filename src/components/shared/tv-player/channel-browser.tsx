"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Trophy, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchInput } from "@/components/shared/search-input";
import { isFifaChannel } from "@/constants/channels";
import type { Channel } from "@/types/channel.type";

const FIFA_TAB = "FIFA";

export function ChannelBrowser({
  channels,
  groupsOrder,
  activeChannel,
  onSelect,
  className,
}: {
  channels: Channel[];
  groupsOrder: string[];
  activeChannel: Channel | null;
  onSelect: (channel: Channel) => void;
  className?: string;
}) {
  const [group, setGroup] = useState(FIFA_TAB);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return channels.filter((c) => {
      const inGroup = group === "All" || (group === FIFA_TAB ? isFifaChannel(c) : c.group === group);
      const matches = !term || c.name.toLowerCase().includes(term);
      return inGroup && matches;
    });
  }, [channels, group, search]);

  return (
    <div className={cn("flex min-h-0 flex-col gap-3", className)}>
      <SearchInput value={search} onChange={setSearch} placeholder="Search channels…" className="max-w-none" />

      <div className="flex flex-wrap gap-2">
        {["All", FIFA_TAB, ...groupsOrder].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              g === group
                ? g === FIFA_TAB
                  ? "bg-amber-500 text-black"
                  : "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {g === FIFA_TAB && <Trophy className="size-3.5" />}
            {g}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} / {channels.length} channels
      </p>

      <ScrollArea className="h-105 rounded-lg border lg:h-140">
        <div className="flex flex-col divide-y">
          {filtered.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No channels match your search.
            </p>
          )}
          {filtered.map((c) => {
            const isActive = activeChannel?.name === c.name;
            return (
              <button
                key={c.name}
                onClick={() => onSelect(c)}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 p-2 text-left transition-colors hover:bg-muted",
                  isActive && "bg-muted"
                )}
              >
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt=""
                    width={168}
                    height={94}
                    unoptimized
                    className="aspect-video w-40 shrink-0 rounded-lg border bg-muted object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <span className="flex aspect-video w-40 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Tv className="size-5 text-muted-foreground" />
                  </span>
                )}
                <div className="min-w-0 flex-1 py-0.5">
                  <p className={cn("line-clamp-2 flex items-center gap-1 text-sm font-medium", isActive && "text-primary")}>
                    {isFifaChannel(c) && <Trophy className="size-3.5 shrink-0 text-amber-500" />}
                    {c.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.group} · Live</p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
