"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          // ✅ your requirement: 1 minute within same query => no API call
          staleTime: 60 * 1000,

          // ✅ keep cache longer so navigating around keeps data
          // (v4: gcTime, older: cacheTime)
          gcTime: 10 * 60 * 1000,

          // ✅ avoid surprise refetches
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,

          // ✅ optional: if you really want NO refetch on remount within staleTime
          // refetchOnMount: false,

          // ✅ sane retries (avoid hammering server)
          retry: (failureCount, err: any) => {
            const status = err?.response?.status;
            // don't retry on 400/401/403/404
            if (status && [400, 401, 403, 404].includes(status)) return false;
            return failureCount < 1;
          },
        },
        mutations: {
          retry: 0,
        },
      },
    });
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
