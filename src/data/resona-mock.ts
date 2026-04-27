export type TrackArtwork = {
  from: string;
  to: string;
};

export type Track = {
  id: string;
  name: string;
  artist: string;
  duration: string;
  artwork?: TrackArtwork;
};

export type Playlist = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tracks: Track[];
};

const trackArtworkById: Record<string, TrackArtwork> = {
  "glass-horizon": { from: "#4f46e5", to: "#0f172a" },
  "soft-signals": { from: "#7c3aed", to: "#1f2937" },
  "neon-lowline": { from: "#0ea5e9", to: "#111827" },
  "static-bloom": { from: "#be185d", to: "#1f2937" },
  "quiet-canvas": { from: "#334155", to: "#0f172a" },
  "paper-planets": { from: "#64748b", to: "#1e293b" },
  "window-light": { from: "#1d4ed8", to: "#1f2937" },
  "blue-frequency": { from: "#0369a1", to: "#0f172a" },
  "open-rooms": { from: "#166534", to: "#1f2937" },
  "low-tide-echo": { from: "#0f766e", to: "#111827" },
  afterlight: { from: "#6d28d9", to: "#111827" },
  northbound: { from: "#312e81", to: "#0f172a" },
  "parallel-hearts": { from: "#be185d", to: "#1f2937" },
  "slow-orbit": { from: "#4338ca", to: "#111827" },
  "quiet-city-lights": { from: "#475569", to: "#111827" },
  "signal-bloom": { from: "#9333ea", to: "#1e293b" },
};

function withArtwork(track: Omit<Track, "artwork">): Track {
  return {
    ...track,
    artwork: trackArtworkById[track.id],
  };
}

export const discoverPlaylists: Playlist[] = [
  {
    id: "midnight-circuit",
    title: "Midnight Circuit",
    subtitle: "Synthwave focus",
    description: "Neon textures and late-night rhythm for deep, uninterrupted focus.",
    tracks: [
      withArtwork({ id: "glass-horizon", name: "Glass Horizon", artist: "Aria Vale", duration: "3:42" }),
      withArtwork({ id: "soft-signals", name: "Soft Signals", artist: "Nova Thread", duration: "4:08" }),
      withArtwork({ id: "neon-lowline", name: "Neon Lowline", artist: "Echo Drift", duration: "3:25" }),
      withArtwork({ id: "static-bloom", name: "Static Bloom", artist: "Mira Sol", duration: "2:59" }),
    ],
  },
  {
    id: "lo-fi-current",
    title: "Lo-Fi Current",
    subtitle: "Calm productivity",
    description: "Warm beats and gentle melodies for coding, reading, and flow states.",
    tracks: [
      withArtwork({ id: "quiet-canvas", name: "Quiet Canvas", artist: "Kei Bloom", duration: "3:14" }),
      withArtwork({ id: "paper-planets", name: "Paper Planets", artist: "Kei Bloom", duration: "3:51" }),
      withArtwork({ id: "window-light", name: "Window Light", artist: "Sora Lane", duration: "2:48" }),
      withArtwork({ id: "blue-frequency", name: "Blue Frequency", artist: "Niko Raye", duration: "4:02" }),
    ],
  },
  {
    id: "open-air-mornings",
    title: "Open Air Mornings",
    subtitle: "Acoustic discovery",
    description: "Bright acoustic picks and independent artists to start your day clean.",
    tracks: [
      withArtwork({ id: "open-rooms", name: "Open Rooms", artist: "Aster Lane", duration: "2:58" }),
      withArtwork({ id: "low-tide-echo", name: "Low Tide Echo", artist: "Mira Sol", duration: "3:27" }),
      withArtwork({ id: "afterlight", name: "Afterlight", artist: "Rumi Vale", duration: "3:08" }),
      withArtwork({ id: "northbound", name: "Northbound", artist: "Sola Frames", duration: "3:16" }),
    ],
  },
];

export const librarySavedPlaylists: Playlist[] = [
  {
    id: "deep-focus-vault",
    title: "Deep Focus Vault",
    subtitle: "Productivity",
    description: "Steady, low-distraction tracks for long creative and coding blocks.",
    tracks: [
      withArtwork({ id: "quiet-canvas", name: "Quiet Canvas", artist: "Kei Bloom", duration: "3:14" }),
      withArtwork({ id: "soft-signals", name: "Soft Signals", artist: "Nova Thread", duration: "4:08" }),
      withArtwork({ id: "window-light", name: "Window Light", artist: "Sora Lane", duration: "2:48" }),
      withArtwork({ id: "glass-horizon", name: "Glass Horizon", artist: "Aria Vale", duration: "3:42" }),
    ],
  },
  {
    id: "night-drive-archive",
    title: "Night Drive Archive",
    subtitle: "Electronic",
    description: "Moody synths and pulsing drums for late-night momentum.",
    tracks: [
      withArtwork({ id: "neon-lowline", name: "Neon Lowline", artist: "Echo Drift", duration: "3:25" }),
      withArtwork({ id: "parallel-hearts", name: "Parallel Hearts", artist: "Vera Sun", duration: "4:11" }),
      withArtwork({ id: "afterlight", name: "Afterlight", artist: "Rumi Vale", duration: "3:08" }),
      withArtwork({ id: "slow-orbit", name: "Slow Orbit", artist: "Caden Sky", duration: "3:29" }),
    ],
  },
  {
    id: "acoustic-keep",
    title: "Acoustic Keep",
    subtitle: "Indie folk",
    description: "Warm strings, intimate vocals, and calm textures for quiet sessions.",
    tracks: [
      withArtwork({ id: "open-rooms", name: "Open Rooms", artist: "Aster Lane", duration: "2:58" }),
      withArtwork({ id: "northbound", name: "Northbound", artist: "Sola Frames", duration: "3:16" }),
      withArtwork({ id: "low-tide-echo", name: "Low Tide Echo", artist: "Mira Sol", duration: "3:27" }),
      withArtwork({ id: "quiet-city-lights", name: "Quiet City Lights", artist: "Mina Cove", duration: "3:37" }),
    ],
  },
];

export const libraryRecentlyPlayed: Track[] = [
  withArtwork({ id: "northbound", name: "Northbound", artist: "Sola Frames", duration: "3:16" }),
  withArtwork({ id: "blue-frequency", name: "Blue Frequency", artist: "Niko Raye", duration: "4:02" }),
  withArtwork({ id: "quiet-city-lights", name: "Quiet City Lights", artist: "Mina Cove", duration: "3:37" }),
  withArtwork({ id: "open-rooms", name: "Open Rooms", artist: "Aster Lane", duration: "2:58" }),
];

export const libraryFavoriteTracks: Track[] = [
  withArtwork({ id: "signal-bloom", name: "Signal Bloom", artist: "Iris North", duration: "3:44" }),
  withArtwork({ id: "slow-orbit", name: "Slow Orbit", artist: "Caden Sky", duration: "3:29" }),
  withArtwork({ id: "parallel-hearts", name: "Parallel Hearts", artist: "Vera Sun", duration: "4:11" }),
  withArtwork({ id: "afterlight", name: "Afterlight", artist: "Rumi Vale", duration: "3:08" }),
];
