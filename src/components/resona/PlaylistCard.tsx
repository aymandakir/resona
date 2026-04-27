type PlaylistCardProps = {
  title: string;
  subtitle: string;
  description: string;
  trackCount: string;
  isActive?: boolean;
  onClick?: () => void;
};

export function PlaylistCard({
  title,
  subtitle,
  description,
  trackCount,
  isActive = false,
  onClick,
}: PlaylistCardProps) {
  const baseClassName =
    "w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/40";
  const stateClassName = isActive
    ? "border-violet-300/50 bg-violet-400/10 shadow-[0_0_30px_rgba(167,139,250,0.15)]"
    : "border-white/10 bg-black/25 hover:border-white/20 hover:bg-black/35";

  if (onClick) {
    return (
      <button className={`${baseClassName} ${stateClassName}`} onClick={onClick} type="button">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">{subtitle}</p>
        <h3 className="mt-2 text-lg font-medium text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
        <p className="mt-4 text-xs text-zinc-400">{trackCount}</p>
      </button>
    );
  }

  return (
    <article className={`${baseClassName} ${stateClassName}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">{subtitle}</p>
      <h3 className="mt-2 text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
      <p className="mt-4 text-xs text-zinc-400">{trackCount}</p>
    </article>
  );
}
