import type { Metadata } from "next";
import NowPlayingPageClient from "./NowPlayingPageClient";

export const metadata: Metadata = {
  title: "Now Playing",
  description:
    "View your current track in Resona with an elegant, focused now playing screen in a premium dark interface.",
  alternates: {
    canonical: "/now-playing",
  },
};

export default function NowPlayingPage() {
  return <NowPlayingPageClient />;
}
