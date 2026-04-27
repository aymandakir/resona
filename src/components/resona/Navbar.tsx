"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

type NavbarProps = {
  links: NavLink[];
  className?: string;
};

export function Navbar({ links, className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className={className}>
      <div className="flex items-center justify-between">
        <Link className="text-lg font-semibold tracking-tight text-white" href="/">
          Resona
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-2 sm:gap-3">
            {links.map((link) => {
              const isActive =
                !link.external &&
                (link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`));

              return (
                <li key={`${link.label}-${link.href}`}>
                  {link.external ? (
                    <a
                      className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                      href={link.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex rounded-full border px-3 py-1.5 text-sm transition ${
                        isActive
                          ? "border-white/35 bg-white/10 text-white"
                          : "border-white/15 bg-white/5 text-zinc-200 hover:border-white/30 hover:bg-white/10 hover:text-white"
                      }`}
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
