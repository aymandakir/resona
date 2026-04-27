import type { Metadata } from "next";

import { AppScreenLayout } from "@/components/resona/AppScreenLayout";
import { libraryFavoriteTracks } from "@/data/resona-mock";

export const metadata: Metadata = {
  title: "Now Playing",
  description:
    "View your current track in Resona with an elegant, focused now playing screen in a premium dark interface.",
  alternates: {
    canonical: "/now-playing",
  },
};

export default function NowPlayingPage() {
  const track = libraryFavoriteTracks[0];

  return (
    <AppScreenLayout
      navLinks={[
        { label: "Discover", href: "/discover" },
        { label: "Library", href: "/library" },
        { label: "Now Playing", href: "/now-playing" },
        { label: "GitHub", href: "https://github.com", external: true },
      ]}
      nowPlaying={track?.name ?? "No track selected"}
      artist={track?.artist ?? "Resona"}
      currentTime="1:18"
      totalTime={track?.duration ?? "0:00"}
      progressPercent={34}
    >
      <section className="relative z-10">
        <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          Now Playing
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{track?.name}</h1>
        <p className="mt-2 text-base text-zinc-300 sm:text-lg">{track?.artist}</p>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Current session</p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Keep listening from this focused screen while preserving the same premium Resona look and feel.
        </p>
      </section>
    </AppScreenLayout>
  );
}
