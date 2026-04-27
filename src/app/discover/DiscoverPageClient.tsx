"use client";

import { useMemo, useState } from "react";

import { AppScreenLayout } from "@/components/resona/AppScreenLayout";
import { useLibrary } from "@/components/resona/LibraryProvider";
import { usePlayback } from "@/components/resona/PlaybackProvider";
import { PlaylistCard } from "@/components/resona/PlaylistCard";
import { TrackRow } from "@/components/resona/TrackRow";
import { discoverPlaylists } from "@/data/resona-mock";

type QuickResult =
  | {
      id: string;
      type: "track";
      title: string;
      subtitle: string;
      playlistId: string;
      trackId: string;
    }
  | {
      id: string;
      type: "playlist";
      title: string;
      subtitle: string;
      playlistId: string;
    }
  | {
      id: string;
      type: "artist";
      title: string;
      subtitle: string;
      playlistId: string;
      trackId: string;
    };

export default function DiscoverPageClient() {
  const { createPlaylist } = useLibrary();
  const { setTrack, setPlaybackContext } = usePlayback();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(discoverPlaylists[0].id);
  const [selectedTrackId, setSelectedTrackId] = useState(discoverPlaylists[0].tracks[0].id);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const selectedPlaylist = useMemo(
    () => discoverPlaylists.find((playlist) => playlist.id === selectedPlaylistId) ?? discoverPlaylists[0],
    [selectedPlaylistId],
  );

  const visibleTracks = useMemo(() => {
    if (!normalizedQuery) {
      return selectedPlaylist.tracks;
    }

    return selectedPlaylist.tracks.filter((track) => {
      const haystack = `${track.name} ${track.artist}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery, selectedPlaylist]);

  const quickResults = useMemo<QuickResult[]>(() => {
    if (!normalizedQuery) {
      return [];
    }

    const flattened = discoverPlaylists.flatMap((playlist) =>
      playlist.tracks.map((track) => ({
        playlistId: playlist.id,
        playlistTitle: playlist.title,
        track,
      })),
    );

    const trackResults: QuickResult[] = flattened
      .filter(({ track, playlistTitle }) =>
        `${track.name} ${track.artist} ${playlistTitle}`.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 6)
      .map(({ track, playlistId, playlistTitle }) => ({
        id: `track-${track.id}-${playlistId}`,
        type: "track",
        title: track.name,
        subtitle: `${track.artist} · ${playlistTitle}`,
        playlistId,
        trackId: track.id,
      }));

    const playlistResults: QuickResult[] = discoverPlaylists
      .filter((playlist) =>
        `${playlist.title} ${playlist.subtitle} ${playlist.description}`.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 3)
      .map((playlist) => ({
        id: `playlist-${playlist.id}`,
        type: "playlist",
        title: playlist.title,
        subtitle: `${playlist.subtitle} · ${playlist.tracks.length} tracks`,
        playlistId: playlist.id,
      }));

    const artistSeen = new Set<string>();
    const artistResults: QuickResult[] = [];
    for (const item of flattened) {
      const key = item.track.artist.toLowerCase();
      if (artistSeen.has(key)) {
        continue;
      }
      if (!item.track.artist.toLowerCase().includes(normalizedQuery)) {
        continue;
      }
      artistSeen.add(key);
      artistResults.push({
        id: `artist-${key}`,
        type: "artist",
        title: item.track.artist,
        subtitle: `Artist · ${item.playlistTitle}`,
        playlistId: item.playlistId,
        trackId: item.track.id,
      });
      if (artistResults.length >= 3) {
        break;
      }
    }

    return [...trackResults, ...playlistResults, ...artistResults].slice(0, 8);
  }, [normalizedQuery]);

  const effectiveSelectedTrackId =
    visibleTracks.some((track) => track.id === selectedTrackId)
      ? selectedTrackId
      : visibleTracks[0]?.id ?? selectedPlaylist.tracks[0]?.id;

  const selectedTrack =
    visibleTracks.find((track) => track.id === effectiveSelectedTrackId) ??
    selectedPlaylist.tracks.find((track) => track.id === effectiveSelectedTrackId) ??
    selectedPlaylist.tracks[0];

  const selectTrackInPlaylist = (playlistId: string, trackId: string) => {
    const playlist = discoverPlaylists.find((item) => item.id === playlistId);
    if (!playlist) {
      return;
    }

    setSelectedPlaylistId(playlistId);

    const targetTrack = playlist.tracks.find((track) => track.id === trackId);
    if (!targetTrack) {
      return;
    }

    setSelectedTrackId(targetTrack.id);
    setPlaybackContext({
      kind: "discover",
      trackIds: playlist.tracks.map((track) => track.id),
      currentTrackId: targetTrack.id,
    });
    setTrack(targetTrack, {
      isPlaying: false,
      elapsedSeconds: 0,
      sourceLabel: `Discover · ${playlist.title}`,
    });
  };

  const handlePlaylistSelect = (playlistId: string) => {
    const playlist = discoverPlaylists.find((item) => item.id === playlistId);
    const firstTrack = playlist?.tracks[0];
    if (!firstTrack) {
      return;
    }

    selectTrackInPlaylist(playlistId, firstTrack.id);
  };

  const handleTrackSelect = (track: (typeof selectedPlaylist.tracks)[number]) => {
    selectTrackInPlaylist(selectedPlaylist.id, track.id);
  };

  const handleQuickResultSelect = (result: QuickResult) => {
    if (result.type === "playlist") {
      handlePlaylistSelect(result.playlistId);
      return;
    }

    selectTrackInPlaylist(result.playlistId, result.trackId);
  };

  const savePlaylistFromTracks = (tracks: typeof selectedPlaylist.tracks, sourceLabel: string) => {
    const result = createPlaylist({
      name: newPlaylistName,
      tracks,
      sourceLabel,
    });

    if (!result.ok) {
      setSaveError(result.error);
      setSaveMessage(null);
      return;
    }

    setSaveError(null);
    setSaveMessage(`Saved "${result.playlist.title}" to your Library.`);
    setNewPlaylistName("");
  };

  return (
    <AppScreenLayout
      navLinks={[
        { label: "Discover", href: "/discover" },
        { label: "Library", href: "/library" },
        { label: "Now Playing", href: "/now-playing" },
        { label: "GitHub", href: "https://github.com", external: true },
      ]}
      nowPlaying={selectedTrack?.name ?? "No track selected"}
      artist={selectedTrack?.artist ?? "Resona"}
      currentTime={selectedTrack ? "1:24" : "0:00"}
      totalTime={selectedTrack?.duration ?? "0:00"}
      progressPercent={selectedTrack ? 40 : 0}
      nowPlayingArtwork={selectedTrack?.artwork}
    >
      <section className="relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Discover</h1>
        <p className="mt-2 text-sm text-zinc-300 sm:text-base">
          Search songs, artists, and moods curated for your next session.
        </p>
        <div className="mt-6">
          <label className="sr-only" htmlFor="discover-search">
            Search songs, artists, or moods
          </label>
          <input
            id="discover-search"
            type="search"
            placeholder="Search songs, artists, or moods..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-13 w-full rounded-2xl border border-white/15 bg-black/30 px-5 text-base text-zinc-100 outline-none ring-violet-300/40 transition placeholder:text-zinc-500 focus:border-violet-300/40 focus:ring-2"
          />
        </div>
        {normalizedQuery ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/35">
            <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
              Quick results
            </div>
            <ul>
              {quickResults.map((result) => (
                <li key={result.id} className="border-b border-white/8 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => handleQuickResultSelect(result)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.04]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-zinc-100">{result.title}</span>
                      <span className="block truncate text-xs text-zinc-400">{result.subtitle}</span>
                    </span>
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-zinc-300">
                      {result.type}
                    </span>
                  </button>
                </li>
              ))}
              {quickResults.length === 0 ? (
                <li className="px-4 py-4 text-sm text-zinc-400">No matches yet. Try track, artist, or playlist names.</li>
              ) : null}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
          <h2 className="text-sm font-medium text-zinc-100">Create playlist</h2>
          <p className="mt-1 text-xs text-zinc-400">Save selected tracks into your Library for this session.</p>
          <div className="mt-3">
            <label className="sr-only" htmlFor="create-playlist-name">
              Playlist name
            </label>
            <input
              id="create-playlist-name"
              type="text"
              value={newPlaylistName}
              onChange={(event) => {
                setNewPlaylistName(event.target.value);
                setSaveError(null);
                setSaveMessage(null);
              }}
              placeholder="Playlist name..."
              className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-4 text-sm text-zinc-100 outline-none ring-violet-300/40 transition placeholder:text-zinc-500 focus:border-violet-300/40 focus:ring-2"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                selectedTrack
                  ? savePlaylistFromTracks([selectedTrack], `Discover · ${selectedPlaylist.title}`)
                  : undefined
              }
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
            >
              Save selected track
            </button>
            <button
              type="button"
              onClick={() => savePlaylistFromTracks(selectedPlaylist.tracks, `Discover · ${selectedPlaylist.title}`)}
              className="rounded-full border border-violet-300/35 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-100 transition hover:bg-violet-400/20"
            >
              Save current playlist
            </button>
          </div>
          {saveError ? <p className="mt-2 text-xs text-rose-300">{saveError}</p> : null}
          {saveMessage ? <p className="mt-2 text-xs text-emerald-300">{saveMessage}</p> : null}
        </div>
      </section>

      <section className="relative z-10 mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-medium text-white">Featured playlists</h2>
          <span className="text-sm text-zinc-400">Curated picks</span>
        </div>
        <p className="mb-4 text-sm text-zinc-400" aria-live="polite">
          Selected playlist: <span className="font-medium text-zinc-200">{selectedPlaylist.title}</span>. Tracks
          below update when you switch playlists.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discoverPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              title={playlist.title}
              subtitle={playlist.subtitle}
              description={playlist.description}
              trackCount={`${playlist.tracks.length} tracks`}
              isActive={playlist.id === selectedPlaylistId}
              onClick={() => handlePlaylistSelect(playlist.id)}
            />
          ))}
        </div>
      </section>

      <section className="relative z-10 mt-10">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-medium text-white">Tracks</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            From {selectedPlaylist.title}
          </span>
          <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-xs text-violet-100">
            Selected: {selectedTrack?.name ?? "None"}
          </span>
        </div>
        <p id="discover-track-context" className="mb-4 text-sm text-zinc-400">
          Showing {visibleTracks.length} of {selectedPlaylist.tracks.length} tracks.
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="grid grid-cols-[1fr_auto] border-b border-white/8 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:grid-cols-[1.2fr_1fr_auto]">
            <span>Track</span>
            <span className="hidden sm:block">Artist</span>
            <span>Time</span>
          </div>
          <ul>
            {visibleTracks.map((track) => (
              <TrackRow
                key={track.id}
                {...track}
                isActive={effectiveSelectedTrackId === track.id}
                onClick={() => handleTrackSelect(track)}
              />
            ))}
            {visibleTracks.length === 0 ? (
              <li className="px-4 py-6 text-sm text-zinc-400">No tracks found for this search.</li>
            ) : null}
          </ul>
        </div>
      </section>
    </AppScreenLayout>
  );
}
