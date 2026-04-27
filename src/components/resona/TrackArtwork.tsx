import type { TrackArtwork as TrackArtworkData } from "@/data/resona-mock";

type TrackArtworkProps = {
  artwork?: TrackArtworkData;
  trackName: string;
  size?: "row" | "mini" | "hero";
};

const sizeClasses: Record<NonNullable<TrackArtworkProps["size"]>, string> = {
  row: "h-8 w-8 rounded-md",
  mini: "h-10 w-10 rounded-lg",
  hero: "h-28 w-28 rounded-2xl sm:h-32 sm:w-32",
};

export function TrackArtwork({ artwork, trackName, size = "row" }: TrackArtworkProps) {
  const gradientStyle = artwork
    ? { backgroundImage: `linear-gradient(135deg, ${artwork.from}, ${artwork.to})` }
    : { backgroundImage: "linear-gradient(135deg, #334155, #0f172a)" };

  return (
    <div
      aria-label={`${trackName} artwork`}
      className={`${sizeClasses[size]} shrink-0 border border-white/10`}
      role="img"
      style={gradientStyle}
    />
  );
}
