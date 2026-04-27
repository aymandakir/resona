import Link from "next/link";

import { Navbar } from "@/components/resona/Navbar";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

type AppScreenLayoutProps = {
  navLinks: NavLink[];
  nowPlaying: string;
  artist: string;
  currentTime: string;
  totalTime: string;
  progressPercent: number;
  children: React.ReactNode;
};

export function AppScreenLayout({
  navLinks,
  nowPlaying,
  artist,
  currentTime,
  totalTime,
  progressPercent,
  children,
}: AppScreenLayoutProps) {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-14 pt-6 sm:px-8 lg:px-12">
        <Navbar className="mb-10" links={navLinks} />

        <main className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.03] px-5 py-10 shadow-[0_0_90px_rgba(125,130,255,0.08)] sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative z-10">{children}</div>
        </main>

        <footer className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <Link className="min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/40" href="/now-playing">
              <p className="truncate text-sm font-medium text-white transition hover:text-violet-200">
                {nowPlaying}
              </p>
              <p className="truncate text-xs text-zinc-400 transition hover:text-zinc-300">{artist}</p>
            </Link>
            <p className="shrink-0 text-xs text-zinc-400">
              {currentTime} / {totalTime}
            </p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-[width]"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
