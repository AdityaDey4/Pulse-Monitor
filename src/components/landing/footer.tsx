import Link from "next/link";
import {  ExternalLink } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features",      href: "#features"       },
  { label: "Architecture",  href: "#architecture"   },
  { label: "Mission Control", href: "#mission-control" },
  { label: "Analytics",     href: "#analytics"      },
  { label: "Deep Dive",     href: "#deep-dive"      },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com",
    // icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    // icon: Linkedin,
  },
];

const STACK = [
  "Next.js 15",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "Redis",
  "Socket.IO",
  "Auth.js",
  "Tailwind CSS",
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050816] border-t border-white/5 overflow-hidden">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Main footer row ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-10 py-14">

          {/* Brand column */}
          <div className="max-w-xs">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF] animate-pulse" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">
                Pulse Monitor
              </span>
            </div>

            <p className="text-[12px] text-slate-500 leading-relaxed mb-5">
              A production-grade uptime monitoring platform built to showcase
              full-stack engineering, real-time systems, and distributed
              architecture.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/6 bg-white/3 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/12 transition-all duration-150"
                >
                  {/* <Icon className="w-3.5 h-3.5" /> */}
                </a>
              ))}

              {/* Resume */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/6 bg-white/3 text-[11px] font-mono text-slate-500 hover:text-white hover:border-white/12 transition-all duration-150"
              >
                Resume
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 block mb-4">
              Navigation
            </span>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[12px] text-slate-500 hover:text-white transition-colors duration-150 font-mono"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack column */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600 block mb-4">
              Tech Stack
            </span>
            <ul className="space-y-2.5">
              {STACK.map((s) => (
                <li key={s}>
                  <span className="text-[12px] text-slate-600 font-mono">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 border-t border-white/5">
          <span className="text-[11px] font-mono text-slate-700">
            © {year} Pulse Monitor Pilot — built as a portfolio project.
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-700">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;