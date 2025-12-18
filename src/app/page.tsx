import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        SpaceX Mission Control
      </h1>

      <p className="mt-2 text-sm text-zinc-500">
        Dashboard to explore SpaceX launches.
      </p>
    </main>
  );
}
