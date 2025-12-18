"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useLaunchSelection } from "./LaunchSelectionContext";
import { useLaunches } from "@/lib/useLaunches";
import { useQueryClient } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/spacex";


export function LaunchesList() {
  const { selectedId, select } = useLaunchSelection();
  const { data, isLoading, isError, error, refetch } = useLaunches(30);
  const [query, setQuery] = useState("");
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedId) return;
    const el = itemRefs.current[selectedId];
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if(!q) return data ?? [];
    return (data ?? []).filter((l) => l.name.toLowerCase().includes(q));
  }, [data, query])

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <div className="sticky top-0 z-10 bg-white pb-3">
          <div className="text-sm font-semibold">Launches</div>
          <div className="mt-1 text-xs text-zinc-500">Loading…</div>
          <div className="mt-3">
            <div className="w-full rounded-xl border px-3 py-2 text-sm text-zinc-400">
              Search launches...
            </div>
          </div>
        </div>
  
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="font-medium">Couldn’t load launches</div>
          <div className="mt-1 opacity-90">
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
  
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-xl border bg-white px-3 py-2 text-xs hover:bg-zinc-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border p-4 text-sm text-zinc-600">
        No launches found.
      </div>
    );
  }
  

  if (!filtered.length) {
    return (
      <div className="p-4">
        <div className="sticky top-0 z-10 bg-white pb-3">
          <h2 className="text-sm font-semibold tracking-tight">Launches</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Latest SpaceX launches (click to view details)
          </p>
  
          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search launches..."
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
        </div>
  
        <div className="mt-4 rounded-xl border p-4 text-sm text-zinc-500">
          No results for “{query}”.
        </div>
      </div>
    );
  }
  

  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-zinc-50 pb-3">
        <h2 className="text-sm font-semibold tracking-tight">Launches</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Latest SpaceX launches (click to view details)
        </p>
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search launches..."
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
      </div>
      <ul role="listbox" aria-label="SpaceX launches" className="space-y-2 pt-2">
        {filtered.map((launch) => (
          <li key={launch.id}>
            <button
              type="button"
              role="option"
              onMouseEnter = {() => {
                queryClient.prefetchQuery({
                  queryKey: ["launches", 30],
                  queryFn: () => fetchLaunches(30),
                });
              }}
              onClick={() => select(launch.id)}
              aria-selected={selectedId === launch.id}
              className={`w-full text-left rounded-xl border p-4 transition outline-none
                focus-visible:ring-2 focus-visible:ring-zinc-300
                ${
                  selectedId === launch.id
                    ? "border-zinc-900 bg-zinc-100"
                    : "hover:bg-zinc-50"
                }`}
                ref={(el) => {
                  itemRefs.current[launch.id] = el;
                }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate font-medium">{launch.name}</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {new Date(launch.date_utc).toLocaleString()}
                  </div>
                </div>
          
                <div className="shrink-0 text-xs">
                  {launch.success === null ? (
                    <span className="rounded-full border px-2 py-1 text-zinc-600">
                      Unknown
                    </span>
                  ) : launch.success ? (
                    <span className="rounded-full border px-2 py-1 text-emerald-700">
                      Success
                    </span>
                  ) : (
                    <span className="rounded-full border px-2 py-1 text-red-700">
                      Failed
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
