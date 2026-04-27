"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Playlist, Track } from "@/data/resona-mock";

type CreatePlaylistInput = {
  name: string;
  tracks: Track[];
  sourceLabel: string;
};

type CreatePlaylistResult =
  | { ok: true; playlist: Playlist }
  | { ok: false; error: string };

type LibraryContextValue = {
  createdPlaylists: Playlist[];
  createPlaylist: (input: CreatePlaylistInput) => CreatePlaylistResult;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

function toPlaylistId(name: string) {
  return `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [createdPlaylists, setCreatedPlaylists] = useState<Playlist[]>([]);

  const createPlaylist = ({ name, tracks, sourceLabel }: CreatePlaylistInput): CreatePlaylistResult => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { ok: false, error: "Add a playlist name before saving." };
    }

    if (tracks.length === 0) {
      return { ok: false, error: "Choose at least one track to save." };
    }

    const playlist: Playlist = {
      id: toPlaylistId(trimmedName),
      title: trimmedName,
      subtitle: "Your playlist",
      description: `Saved from ${sourceLabel}.`,
      tracks: [...tracks],
    };

    setCreatedPlaylists((current) => [playlist, ...current]);
    return { ok: true, playlist };
  };

  const value = useMemo(
    () => ({
      createdPlaylists,
      createPlaylist,
    }),
    [createdPlaylists],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within LibraryProvider");
  }

  return context;
}
