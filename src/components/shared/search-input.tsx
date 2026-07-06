"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  className,
  placeholder = "Search...",
}: {
  value: string;
  onChange: any
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-8 `}
      />
    </div>
  );
}
