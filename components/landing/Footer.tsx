"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const candidateLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Core Features", href: "#features" },
  { label: "Sign In", href: "/auth" },
];

const recruiterLinks = [
  { label: "Search Talent", href: "/dashboard" },
  { label: "Invite Candidates", href: "/dashboard" },
  { label: "Recruiter Access", href: "/auth" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-section-alt/90 px-6 py-14">
      <div className="gradient-mesh absolute inset-0 opacity-35" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]"
        >
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-subtle">
              GetFinalOffer
            </p>
            <h3 className="max-w-sm text-2xl font-semibold tracking-tight text-heading">
              Verified interviews. Clear signals. Better offers.
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-text-muted">
              A calm, transparent hiring flow where engineers are judged by validated outcomes, not repeated rounds.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-subtle">
              For Candidates
            </p>
            <nav className="flex flex-col gap-2.5 text-sm">
              {candidateLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-text-muted transition-colors duration-200 hover:text-heading"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-subtle">
              For Recruiters
            </p>
            <nav className="flex flex-col gap-2.5 text-sm">
              {recruiterLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-text-muted transition-colors duration-200 hover:text-heading"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-5 text-xs text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GetFinalOffer. All rights reserved.</p>
          <p>Built for quiet confidence in career decisions.</p>
        </div>
      </div>
    </footer>
  );
}
