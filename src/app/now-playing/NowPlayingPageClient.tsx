"use client";

import Link from "next/link";

import { AppScreenLayout } from "@/components/resona/AppScreenLayout";
import { TrackArtwork } from "@/components/resona/TrackArtwork";
import { usePlayback } from "@/components/resona/PlaybackProvider";
import { libraryFavoriteTracks } from "@/data/resona-mock";

export default function NowPlayingPageClient() {
  const { track, sourceLabel, isPlaying, togglePlaying } = usePlayback();

  const fallbackTrack = libraryFavoriteTracks[0];
  const activeTrack = track ?? fallbackTrack;
  const resolvedSource = sourceLabel ?? "Favorites";

  return (
    <AppScreenLayout
      navLinks={[
        { label: "Discover", href: "/discover" },
        { label: "Library", href: "/library" },
        { label: "Now Playing", href: "/now-playing" },
        { label: "GitHub", href: "https://github.com", external: true },
      ]}
      nowPlaying={activeTrack?.name ?? "No track selected"}
      artist={activeTrack?.artist ?? "Resona"}
      currentTime="0:00"
      totalTime={activeTrack?.duration ?? "0:00"}
      progressPercent={0}
      nowPlayingArtwork={activeTrack?.artwork}
    >
      <section className="relative z-10">
        <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          Now Playing
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <TrackArtwork artwork={activeTrack?.artwork} size="hero" trackName={activeTrack?.name ?? "Track"} />
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {activeTrack?.name ?? "No track selected"}
            </h1>
            <p className="mt-2 text-base text-zinc-300 sm:text-lg">{activeTrack?.artist ?? "Resona"}</p>

            <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              From {resolvedSource}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Duration</p>
            <p className="mt-1 text-sm font-medium text-white">{activeTrack?.duration ?? "0:00"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Status</p>
            <p className="mt-1 text-sm font-medium text-white">{isPlaying ? "Active" : "Paused"}</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mt-8 rounded-2xl border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Playback</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            aria-label={isPlaying ? "Pause playback" : "Resume playback"}
            aria-pressed={isPlaying}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
            onClick={togglePlaying}
            type="button"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-zinc-100 transition hover:border-white/35 hover:bg-white/10"
            href="/library"
          >
            Choose another track
          </Link>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Playback controls here mirror the shared mini-player session across routes.
        </p>
      </section>
    </AppScreenLayout>
  );
}
