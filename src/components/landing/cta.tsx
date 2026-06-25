import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// CTA is a server component — no "use client" needed (no state/hooks)

export function CTA() {
  return (
    <section id="cta" className="relative py-28 bg-[#050816] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#00D4FF]/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle,#334155 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="w-4 h-px bg-[#00D4FF]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#00D4FF]">
            Open Source
          </span>
          <span className="w-4 h-px bg-[#00D4FF]" />
        </div>

        {/* Headline */}
        <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
          Built to monitor{" "}
          <span className="text-[#00D4FF]">production systems.</span>
          <br />
          Engineered to demonstrate{" "}
          <span className="text-slate-400">full-stack excellence.</span>
        </h2>

        {/* Description */}
        <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto mb-10">
          Pulse Monitor is a fully open-source portfolio project. Explore the
          source code, read the architecture, and see how every piece fits
          together.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <Link
            href="#mission-control"
            className={cn(
              "group inline-flex items-center gap-2 rounded-lg px-6 py-3",
              "bg-[#00D4FF] text-[#050816] text-sm font-semibold",
              "hover:bg-[#00bfe8] transition-colors duration-150",
              "shadow-lg shadow-[#00D4FF]/20"
            )}
          >
            View Live Demo
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-6 py-3",
              "border border-white/10 bg-white/4 text-white text-sm font-medium",
              "hover:bg-white/8 hover:border-white/16 transition-all duration-150"
            )}
          >
            {/* <Github className="w-4 h-4" /> */}
            Explore Source Code
          </a>
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "Next.js 15",
            "TypeScript",
            "PostgreSQL",
            "Redis Pub/Sub",
            "Socket.IO",
            "Prisma",
            "Auth.js",
            "Tailwind CSS",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full border border-white/6 bg-white/3 text-[11px] font-mono text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}

export default CTA;