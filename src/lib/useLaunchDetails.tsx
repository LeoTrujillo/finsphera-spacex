"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLaunchById } from "@/lib/spacex";

export function useLaunchDetails(id: string | null) {
  return useQuery({
    queryKey: ["launch", id],
    queryFn: () => fetchLaunchById(id as string),
    enabled: !!id,
    staleTime: 60_000,
  });
}
