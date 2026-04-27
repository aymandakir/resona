"use client";

import { useMemo, useState } from "react";

import { AppScreenLayout } from "@/components/resona/AppScreenLayout";
import { useLibrary } from "@/components/resona/LibraryProvider";
import { usePlayback } from "@/components/resona/PlaybackProvider";
import { PlaylistCard } from "@/components/resona/PlaylistCard";
import { TrackRow } from "@/components/resona/TrackRow";
import {
  libraryFavoriteTracks,
  libraryRecentlyPlayed,
  librarySavedPlaylists,
  type Track,
} from "@/data/resona-mock";

export default function LibraryPageClient() {
  const { createdPlaylists } = useLibrary();
  const { setTrack, setPlaybackContext } = usePlayback();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedCreatedPlaylistId, setSelectedCreatedPlaylistId] = useState<string | null>(null);

  const selectedCreatedPlaylist = useMemo(
    () => createdPlaylists.find((playlist) => playlist.id === selectedCreatedPlaylistId) ?? null,
    [createdPlaylists, selectedCreatedPlaylistId],
  );

  const handleTrackSelect = (track: Track, sourceLabel: string) => {
    setSelectedTrackId(track.id);
    const trackIds =
      sourceLabel === "Library · Recently played"
        ? libraryRecentlyPlayed.map((item) => item.id)
        : sourceLabel === "Library · Favorites"
          ? libraryFavoriteTracks.map((item) => item.id)
          : [track.id];

    const kind =
      sourceLabel === "Library · Recently played"
        ? "library-recent"
        : sourceLabel === "Library · Favorites"
          ? "library-favorites"
          : "single";

    setPlaybackContext({
      kind,
      trackIds,
      currentTrackId: track.id,
    });
    setTrack(track, {
      isPlaying: false,
      elapsedSeconds: 0,
      sourceLabel,
    });
  };

  const handleCreatedPlaylistTrackSelect = (track: Track) => {
    if (!selectedCreatedPlaylist) {
      return;
    }

    setSelectedTrackId(track.id);
    setPlaybackContext({
      kind: "single",
      trackIds: selectedCreatedPlaylist.tracks.map((item) => item.id),
      currentTrackId: track.id,
    });
    setTrack(track, {
      isPlaying: false,
      elapsedSeconds: 0,
      sourceLabel: `Library · ${selectedCreatedPlaylist.title}`,
    });
  };

  return (
    <AppScreenLayout
      navLinks={[
        { label: "Discover", href: "/discover" },
        { label: "Library", href: "/library" },
        { label: "Now Playing", href: "/now-playing" },
        { label: "GitHub", href: "https://github.com", external: true },
      ]}
      nowPlaying="Signal Bloom"
      artist="Iris North"
      currentTime="0:56"
      totalTime="3:44"
      progressPercent={25}
      nowPlayingArtwork={libraryFavoriteTracks[0]?.artwork}
    >
      <section className="relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your Library</h1>
        <p className="mt-2 text-sm text-zinc-300 sm:text-base">
          A personal space for what you save, replay, and love most.
        </p>
        <p className="mt-3 text-sm text-zinc-400">
          Browse collections, revisit recent sessions, then jump into favorites.
        </p>
      </section>

      <section className="relative z-10 mt-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-medium text-white">Saved playlists</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            Collections
          </span>
        </div>
        <p className="mb-4 text-sm text-zinc-400">Playlists you keep close for repeat listening sessions.</p>
        {createdPlaylists.length === 0 ? (
          <p className="mb-4 rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-zinc-400">
            No custom playlists yet. Create one from Discover to make your Library yours.
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {createdPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              title={playlist.title}
              subtitle="Custom playlist"
              description={playlist.description}
              trackCount={`${playlist.tracks.length} tracks`}
              isActive={playlist.id === selectedCreatedPlaylistId}
              onClick={() => setSelectedCreatedPlaylistId(playlist.id)}
            />
          ))}
          {librarySavedPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              title={playlist.title}
              subtitle={playlist.subtitle}
              description={playlist.description}
              trackCount={`${playlist.tracks.length} tracks`}
            />
          ))}
        </div>
      </section>

      {selectedCreatedPlaylist ? (
        <section className="relative z-10 mt-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-medium text-white">{selectedCreatedPlaylist.title}</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Custom
            </span>
          </div>
          <p className="mb-4 text-sm text-zinc-400">
            Select a track to load this playlist into shared playback.
          </p>
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="grid grid-cols-[1fr_auto] border-b border-white/8 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:grid-cols-[1.2fr_1fr_auto]">
              <span>Track</span>
              <span className="hidden sm:block">Artist</span>
              <span>Time</span>
            </div>
            <ul>
              {selectedCreatedPlaylist.tracks.map((track) => (
                <TrackRow
                  key={`${selectedCreatedPlaylist.id}-${track.id}`}
                  {...track}
                  isActive={selectedTrackId === track.id}
                  onClick={() => handleCreatedPlaylistTrackSelect(track)}
                />
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="relative z-10 mt-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-medium text-white">Recently played</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            History
          </span>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          A quick look at what you played most recently. Select a track to load it in the mini player.
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="grid grid-cols-[1fr_auto] border-b border-white/8 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:grid-cols-[1.2fr_1fr_auto]">
            <span>Track</span>
            <span className="hidden sm:block">Artist</span>
            <span>Time</span>
          </div>
          <ul>
            {libraryRecentlyPlayed.map((track) => (
              <TrackRow
                key={track.id}
                {...track}
                isActive={selectedTrackId === track.id}
                onClick={() => handleTrackSelect(track, "Library · Recently played")}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 mt-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-medium text-white">Favorite tracks</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            Pinned
          </span>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Tracks you come back to first when you want a sure pick. Select a track to load it in the mini player.
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="grid grid-cols-[1fr_auto] border-b border-white/8 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:grid-cols-[1.2fr_1fr_auto]">
            <span>Track</span>
            <span className="hidden sm:block">Artist</span>
            <span>Time</span>
          </div>
          <ul>
            {libraryFavoriteTracks.map((track) => (
              <TrackRow
                key={track.id}
                {...track}
                isActive={selectedTrackId === track.id}
                onClick={() => handleTrackSelect(track, "Library · Favorites")}
              />
            ))}
          </ul>
        </div>
      </section>
    </AppScreenLayout>
  );
}
