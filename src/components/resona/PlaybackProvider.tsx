"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  discoverPlaylists,
  libraryFavoriteTracks,
  libraryRecentlyPlayed,
  type Track,
} from "@/data/resona-mock";

type PlaybackTrack = Track;

type PlaybackContextKind = "discover" | "library-recent" | "library-favorites" | "single";

type ActivePlaybackContext = {
  kind: PlaybackContextKind;
  trackIds: string[];
  currentTrackId: string;
};

type SetTrackOptions = {
  isPlaying?: boolean;
  elapsedSeconds?: number;
  sourceLabel?: string;
};

type PlaybackContextValue = {
  track: PlaybackTrack | null;
  isPlaying: boolean;
  elapsedSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  sourceLabel?: string;
  activeContext?: ActivePlaybackContext;
  setTrack: (track: PlaybackTrack, options?: SetTrackOptions) => void;
  setPlaybackContext: (context: ActivePlaybackContext) => void;
  play: () => void;
  pause: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlaying: () => void;
  seekPercent: (progressPercent: number) => void;
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function clampSeconds(value: number) {
  return Math.max(0, value);
}

function parseDurationToSeconds(duration: string) {
  const [minutesText, secondsText] = duration.split(":");
  const minutes = Number(minutesText);
  const seconds = Number(secondsText);

  if (Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return 0;
  }

  return Math.max(0, minutes * 60 + seconds);
}

const allTracks: Track[] = [
  ...discoverPlaylists.flatMap((playlist) => playlist.tracks),
  ...libraryRecentlyPlayed,
  ...libraryFavoriteTracks,
];

const tracksById = new Map<string, Track>(allTracks.map((track) => [track.id, track]));

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrackState] = useState<PlaybackTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sourceLabel, setSourceLabel] = useState<string | undefined>(undefined);
  const [activeContext, setActiveContext] = useState<ActivePlaybackContext | undefined>(undefined);

  const durationSeconds = track ? parseDurationToSeconds(track.duration) : 0;
  const progressPercent =
    durationSeconds > 0 ? clampPercent((elapsedSeconds / durationSeconds) * 100) : 0;

  const setTrack = useCallback((nextTrack: PlaybackTrack, options?: SetTrackOptions) => {
    setTrackState(nextTrack);

    if (typeof options?.isPlaying === "boolean") {
      setIsPlaying(options.isPlaying);
    }

    setElapsedSeconds(clampSeconds(options?.elapsedSeconds ?? 0));

    if (typeof options?.sourceLabel === "string") {
      setSourceLabel(options.sourceLabel);
    }

    setActiveContext((current) =>
      current
        ? {
            ...current,
            currentTrackId: nextTrack.id,
          }
        : current,
    );
  }, []);

  const setPlaybackContext = useCallback((context: ActivePlaybackContext) => {
    setActiveContext(context);
  }, []);

  const play = useCallback(() => {
    if (!track) {
      return;
    }
    setIsPlaying(true);
  }, [track]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlaying = useCallback(() => {
    if (!track) {
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [track]);

  const seekPercent = useCallback((value: number) => {
    if (!track) {
      return;
    }
    const clampedPercent = clampPercent(value);
    const targetSeconds = Math.round((durationSeconds * clampedPercent) / 100);
    setElapsedSeconds(targetSeconds);
  }, [durationSeconds, track]);

  const advanceToNextTrack = useCallback(() => {
    if (!track || !activeContext || activeContext.trackIds.length === 0) {
      setIsPlaying(false);
      setElapsedSeconds(durationSeconds);
      return;
    }

    const currentIndex = activeContext.trackIds.findIndex((id) => id === activeContext.currentTrackId);
    const nextTrackId = currentIndex >= 0 ? activeContext.trackIds[currentIndex + 1] : undefined;
    if (!nextTrackId) {
      setIsPlaying(false);
      setElapsedSeconds(durationSeconds);
      return;
    }

    const nextTrack = tracksById.get(nextTrackId);
    if (!nextTrack) {
      setIsPlaying(false);
      setElapsedSeconds(durationSeconds);
      return;
    }

    setTrackState(nextTrack);
    setElapsedSeconds(0);
    setActiveContext((prev) =>
      prev
        ? {
            ...prev,
            currentTrackId: nextTrack.id,
          }
        : prev,
    );
  }, [activeContext, durationSeconds, track]);

  useEffect(() => {
    if (!isPlaying || !track || durationSeconds <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((prev) => Math.min(prev + 1, durationSeconds));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [durationSeconds, isPlaying, track]);

  useEffect(() => {
    if (!isPlaying || !track || durationSeconds <= 0 || elapsedSeconds < durationSeconds) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      advanceToNextTrack();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [advanceToNextTrack, durationSeconds, elapsedSeconds, isPlaying, track]);

  const value = useMemo<PlaybackContextValue>(
    () => ({
      track,
      isPlaying,
      elapsedSeconds,
      durationSeconds,
      progressPercent,
      sourceLabel,
      activeContext,
      setTrack,
      setPlaybackContext,
      play,
      pause,
      setIsPlaying,
      togglePlaying,
      seekPercent,
    }),
    [
      activeContext,
      durationSeconds,
      elapsedSeconds,
      isPlaying,
      pause,
      play,
      progressPercent,
      seekPercent,
      setPlaybackContext,
      setTrack,
      sourceLabel,
      track,
      togglePlaying,
    ],
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within PlaybackProvider");
  }

  return context;
}
