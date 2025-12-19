# SpaceX Mission Control — Finsphera Frontend Challenge

A small dashboard to explore SpaceX launches with a sidebar + details panel experience.
Built with performance, resilience, and UX polish in mind.

## Live Demo
- Live URL: [https://finsphera-spacex.vercel.app/](https://finsphera-spacex.vercel.app/)
- Repo URL: [https://github.com/LeoTrujillo/finsphera-spacex](https://github.com/LeoTrujillo/finsphera-spacex)

---

## Features
- Launches list with search (filter by name)
- Details panel with mission patch, status, description, and webcast embed (when available)
- Loading / error / empty states (skeletons + retry)
- Deep linking: selected launch persists via URL query param (`?launch=<id>`)
- Smooth transitions (Framer Motion)
- Keyboard accessible list items (tab + enter/space + focus styles)

---

## Tech Stack
- Next.js (App Router)
- TypeScript (strict)
- Tailwind CSS
- TanStack React Query (caching, retries, request states)
- Framer Motion (micro-interactions)

---

## Architecture & Folder Structure

**High-level approach:** UI is split into layout + feature modules. Data fetching is centralized and cached.


### Why React Query?
I used TanStack React Query to handle request states, caching, retries and to keep UI logic clean and resilient to failures. It also mirrors common production patterns.

### Why URL-based selection?
Persisting selection via query params improves UX (shareable state, refresh-safe) and matches how real dashboards behave.

---

## Design Decisions
- **Sidebar + persistent details panel**: avoids modal fatigue and encourages exploration.
- **Visual hierarchy**: mission name + status + date are surfaced first; long descriptions are secondary.
- **Polish over complexity**: a few interactions (skeletons, animations, deep links) provide more value than excessive features.

---

## AI Usage (Transparency)
I used AI tools (ChatGPT) to:
- Brainstorm UI/UX layout patterns for a "dashboard + details panel" interaction model
- Validate architecture decisions (React Query usage, selection state strategies)
- Draft initial TypeScript interfaces and refactor suggestions
- Generate first-pass code snippets which were then reviewed and adjusted manually

---

## Challenges & Trade-offs
- SpaceX data does not always include complete fields (webcast/details). The UI accounts for missing data with graceful fallbacks.
- I prioritized UX + code clarity over adding extra endpoints (rocket/launchpad names). With more time, I would populate related entities via the `/launches/query` endpoint using `populate`.

---

## If I Had More Time
- Add rocket + launchpad names (populate / extra queries)
- Improve accessibility even further (ARIA listbox pattern refinement)
- Add unit tests for filtering, selection and details rendering
- Dark mode toggle with persisted preference
- Virtualize the sidebar list for very large datasets

---

## Getting Started
```bash
pnpm install
pnpm dev
