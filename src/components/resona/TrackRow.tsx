import type { TrackArtwork as TrackArtworkData } from "@/data/resona-mock";

import { TrackArtwork } from "@/components/resona/TrackArtwork";

type TrackRowProps = {
  id: string;
  name: string;
  artist: string;
  duration: string;
  artwork?: TrackArtworkData;
  isActive?: boolean;
  onClick?: () => void;
};

export function TrackRow({ name, artist, duration, artwork, isActive = false, onClick }: TrackRowProps) {
  const rowClassName = isActive ? "bg-violet-400/12" : "hover:bg-white/[0.04]";

  return (
    <li className={`border-b border-white/8 transition-colors last:border-b-0 ${rowClassName}`}>
      {onClick ? (
        <button
          className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 text-left sm:grid-cols-[1.2fr_1fr_auto] sm:py-3"
          onClick={onClick}
          type="button"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <TrackArtwork artwork={artwork} size="row" trackName={name} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-100">{name}</span>
              <span className="mt-0.5 block truncate text-xs text-zinc-500 sm:hidden">{artist}</span>
            </span>
          </span>
          <span className="hidden text-[13px] text-zinc-400 sm:block">{artist}</span>
          <span className="text-xs text-zinc-500 sm:text-[13px]">{duration}</span>
        </button>
      ) : (
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 sm:grid-cols-[1.2fr_1fr_auto] sm:py-3">
          <span className="flex min-w-0 items-center gap-2.5">
            <TrackArtwork artwork={artwork} size="row" trackName={name} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-100">{name}</span>
              <span className="mt-0.5 block truncate text-xs text-zinc-500 sm:hidden">{artist}</span>
            </span>
          </span>
          <span className="hidden text-[13px] text-zinc-400 sm:block">{artist}</span>
          <span className="text-xs text-zinc-500 sm:text-[13px]">{duration}</span>
        </div>
      )}
    </li>
  );
}
