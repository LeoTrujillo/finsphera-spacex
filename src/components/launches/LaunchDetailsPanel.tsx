"use client";

import { useLaunches } from "@/lib/useLaunches";
import { useLaunchSelection } from "./LaunchSelectionContext";
import { motion, AnimatePresence } from "framer-motion";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const getName = (value: unknown) => {
  if (typeof value === "string") return value;
  if (
    value &&
    typeof value === "object" &&
    "name" in value &&
    typeof (value as { name?: unknown }).name === "string"
  ) {
    const name = (value as { name?: string }).name;
    return name && name.trim() ? name : "Unknown";
  }
  return "Unknown";
};


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
  const { byId, isLoading } = useLaunches(30);

  const launch = selectedId ? byId.get(selectedId) : undefined;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200" />
        <div className="aspect-video w-full animate-pulse rounded-xl bg-zinc-200" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
      </div>
    );
  }
  

  if (!selectedId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        Select a launch to see details
      </div>
    );
  }

  if (!launch) {
    return (
      <div className="p-6 text-sm text-zinc-500">
        Launch not found
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">      
      <motion.div
        key={launch.id}
        initial={{opacity: 0, y: 8}}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className="p-6 space-y-6"
      >
      <header className="flex items-start gap-4">
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
              {dateFormatter.format(new Date(launch.date_utc))}
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
        <div className="space-y-2 w-full max-w-[min(2100px,95vw)] m-auto">
          <h3 className="text-sm font-semibold">Webcast</h3>
          <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black">
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
      </motion.div>
    </AnimatePresence>
  );
}
