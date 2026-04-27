import type { Metadata } from "next";
import LibraryPageClient from "./LibraryPageClient";

export const metadata: Metadata = {
  title: "Library",
  description:
    "Access your Resona library with saved playlists, recent listening history, and favorite tracks in a focused premium interface.",
  alternates: {
    canonical: "/library",
  },
};

export default function LibraryPage() {
  return <LibraryPageClient />;
}
