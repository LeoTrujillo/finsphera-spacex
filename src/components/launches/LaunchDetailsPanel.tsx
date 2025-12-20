"use client";

import { useLaunchSelection } from "./LaunchSelectionContext";
import { useLaunchDetails } from "@/lib/useLaunchDetails";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, getName } from "@/lib/format";


function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }

    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;

    return url;
  } catch {
    return url;
  }
}


export function LaunchDetailsPanel() {
  const { selectedId, clear } = useLaunchSelection();
  const { data: launch, isLoading, isError, error, refetch } = useLaunchDetails(selectedId);


  if (!selectedId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Select a launch to see details
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="aspect-video w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          <div className="font-medium">Couldn’t load launch details</div>
          <div className="mt-1 opacity-90">
            {error instanceof Error ? error.message : "Unknown error"}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => refetch()}
              className="rounded-xl border bg-white px-3 py-2 text-xs hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              Retry
            </button>
            <button
              onClick={clear}
              className="rounded-xl border px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  if (!launch) {
    return (
      <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
        No data yet for this launch. Try again or clear selection.
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => refetch()}
            className="rounded-xl border px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Retry
          </button>
          <button
            onClick={clear}
            className="rounded-xl border px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={launch.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className="p-6"
      >
        <div className="mx-auto flex w-full flex-col gap-6 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
      <header className="flex items-start gap-4 relative">
        {launch.links.patch.small ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={launch.links.patch.small}
            alt={`${launch.name} patch`}
            className="h-12 w-12 rounded-lg border bg-white object-contain"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg border bg-zinc-100" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex">
            <h2 className="truncate text-xl font-semibold">{launch.name}</h2>
            <button
              onClick={clear}
              className="rounded-xl border px-3 py-2 text-xs hover:bg-zinc-50 mx-5"
            >
              Clear
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border px-2 py-1 text-zinc-700">
              {formatDate(launch.date_utc)}
            </span>
            <span className="rounded-full border px-2 py-1 text-zinc-700">
              Rocket: {getName(launch.rocket)}
            </span>
            <span className="rounded-full border px-2 py-1 text-zinc-700">
              Launchpad: {getName(launch.launchpad)}
            </span>

            {launch.success === null ? (
              <span className="rounded-full border px-2 py-1 text-zinc-600">
                Status: Unknown
              </span>
            ) : launch.success ? (
              <span className="rounded-full border px-2 py-1 text-emerald-700">
                Status: Success
              </span>
            ) : (
              <span className="rounded-full border px-2 py-1 text-red-700">
                Status: Failed
              </span>
            )}

            {launch.links.wikipedia && (
              <a
                className="rounded-full border px-2 py-1 hover:bg-zinc-50"
                href={launch.links.wikipedia}
                target="_blank"
                rel="noreferrer"
              >
                Wikipedia ↗
              </a>
            )}
          </div>
        </div>
      </header>

        {launch.links.webcast ? (
          <div className="space-y-2 w-full">
            <h3 className="text-sm font-semibold">Webcast</h3>
            <div className="aspect-video w-full overflow-hidden border bg-black md:rounded-xl md:border md:bg-black md:max-w-[min(2150px,95vw)]">
              <iframe
                className="h-full w-full"
                src={toYouTubeEmbed(launch.links.webcast)}
                title={`${launch.name} webcast`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border p-4 text-sm text-zinc-500">
            No webcast available for this launch.
          </div>
        )}

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Details</h3>
          <p className="text-sm text-zinc-600">
            {launch.details ?? "No description provided by SpaceX."}
          </p>
        </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
