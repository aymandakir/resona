type TrackRowProps = {
  id: string;
  name: string;
  artist: string;
  duration: string;
  isActive?: boolean;
  onClick?: () => void;
};

export function TrackRow({ name, artist, duration, isActive = false, onClick }: TrackRowProps) {
  const rowClassName = isActive ? "bg-violet-400/10" : "hover:bg-white/5";

  return (
    <li className={`border-b border-white/10 last:border-b-0 ${rowClassName}`}>
      {onClick ? (
        <button
          className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left sm:grid-cols-[1.2fr_1fr_auto]"
          onClick={onClick}
          type="button"
        >
          <span className="text-sm text-white">{name}</span>
          <span className="hidden text-sm text-zinc-300 sm:block">{artist}</span>
          <span className="text-sm text-zinc-400">{duration}</span>
        </button>
      ) : (
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[1.2fr_1fr_auto]">
          <span className="text-sm text-white">{name}</span>
          <span className="hidden text-sm text-zinc-300 sm:block">{artist}</span>
          <span className="text-sm text-zinc-400">{duration}</span>
        </div>
      )}
    </li>
  );
}
