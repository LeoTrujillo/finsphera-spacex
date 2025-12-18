"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/spacex";
import type { SpacexLaunch } from "@/types/launch";

export function useLaunches(limit = 30) {
  const query = useQuery({
    queryKey: ["launches", limit],
    queryFn: () => fetchLaunches(limit),
  });

  const byId = useMemo(() => {
    const map = new Map<string, SpacexLaunch>();
    (query.data ?? []).forEach((l) => map.set(l.id, l));
    return map;
  }, [query.data]);

  return { ...query, byId };
}
