"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Icon mark */}
      <div className="relative w-7 h-7 flex-shrink-0">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-lg border border-[#00D4FF]/30 bg-[#00D4FF]/8" />
        {/* Inner pulse dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-40" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D4FF]" />
          </span>
        </div>
      </div>
      {/* Wordmark */}
      <span className="text-[14px] font-semibold text-white tracking-tight">
        Montu<span className="text-[#00D4FF]">Pilot</span>
      </span>
    </Link>
  );
}

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features",      href: "#features"        },
  { label: "Architecture",  href: "#architecture"    },
  { label: "Dashboard",     href: "#mission-control" },
  { label: "Analytics",     href: "#analytics"       },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    // Outer wrapper — full width sticky band
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      {/*
        Floating pill navbar — inspired by the reference screenshot.
        Sits centered with max-width, rounded on all sides.
      */}
      <header
        className={cn(
          "w-full max-w-5xl rounded-2xl border transition-all duration-300",
          scrolled
            ? "border-white/10 bg-[#050816]/90 backdrop-blur-xl shadow-xl shadow-black/30"
            : "border-white/6 bg-[#050816]/70 backdrop-blur-lg"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 lg:px-5">

          {/* ── Logo ──────────────────────────────────────── */}
          <Logo />

          {/* ── Desktop nav links ─────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="px-3 py-1.5 rounded-lg text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150 font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ─────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* GitHub — icon only on small, label on large */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150 font-medium"
            >
              {/* <Github className="w-3.5 h-3.5" /> */}
              <span className="hidden lg:inline">GitHub</span>
            </a>

            {/* Live Demo — primary CTA */}
            <Link
              href="#mission-control"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2",
                "bg-[#00D4FF] text-[#050816] text-[13px] font-semibold",
                "hover:bg-[#00bfe8] transition-colors duration-150",
                "shadow-lg shadow-[#00D4FF]/20"
              )}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/8 bg-white/3 text-slate-400 hover:text-white transition-all"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                // X icon
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ─────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/6 px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150 font-medium"
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-white/5 pt-2 mt-1 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/8 bg-white/3 text-[13px] text-slate-400 font-medium"
              >
                {/* <Github className="w-3.5 h-3.5" /> */}
                GitHub
              </a>
              <Link
                href="#mission-control"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 bg-[#00D4FF] text-[#050816] text-[13px] font-semibold"
              >
                Live Demo
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Navbar;