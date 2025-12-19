import type { SpacexLaunch } from "@/types/launch";

const SPACEX_API_BASE = "https://api.spacexdata.com/v5";

export async function fetchLaunches(limit = 30): Promise<SpacexLaunch[]> {
  const url = `${SPACEX_API_BASE}/launches/query`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {},
      options: {
        sort: { date_utc: "desc" },
        limit,
        populate: ["rocket", "launchpad"],
        select: {
          id: 1,
          name: 1,
          details: 1,
          date_utc: 1,
          success: 1,
          links: 1,
          rocket: 1,
          launchpad: 1,
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`SpaceX API error (HTTP ${res.status})`);
  }

  const json = await res.json();
  return (json?.docs ?? []) as SpacexLaunch[];
}

export async function fetchLaunchById(id: string): Promise<SpacexLaunch> {
  const res = await fetch(`${SPACEX_API_BASE}/launches/${id}`);
  if (!res.ok) throw new Error(`Launch fetch failed (HTTP ${res.status})`);
  return (await res.json()) as SpacexLaunch;
}
