"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, EyeOff, Search, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HeroIllustration,
  SpeedIllustration,
  PrivacyIllustration,
  SearchIllustration
} from "@/components/ui/landing-illustrations";

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 md:mb-20 max-w-2xl">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-500 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  desc,
  illustration,
  reverse = false
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  illustration: React.ReactNode;
  reverse?: boolean
}) {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 py-16 border-b border-slate-100 last:border-0 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 space-y-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full bg-white rounded-2xl h-[400px] md:h-[450px] border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-center">
        {illustration}
      </div>
    </div>
  );
}


function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="h-px w-8 bg-blue-600"></span>
            <span className="text-sm font-bold tracking-wide text-blue-600 uppercase">
              The New Standard
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Stop Interviewing. <br />
            <span className="text-blue-600">Start Negotiating.</span>
          </h1>

          <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg">
            Verify your interview history once. Top companies skip the technical
            rounds and compete for you with direct offers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button
              size="lg"
              className="h-14 px-8 rounded-lg border border-transparent bg-slate-900 text-white hover:bg-slate-800 text-base font-semibold shadow-xl shadow-slate-900/10"
              asChild
            >
              <Link href="/auth">
                Verify My Profile <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-lg border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-base font-medium"
              asChild
            >
              <Link href="#features">How it Works</Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden lg:block h-[600px] w-full border border-slate-100 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Infrastructure for your career."
          subtitle="We built the first protocol that allows you to cryptographically verify and transport your professional reputation."
        />

        <div className="space-y-0">

          <FeatureRow
            icon={Shield}
            title="Cryptographic Verification"
            desc="We validate your employment and interview history using DKIM signatures and direct-source data. Once verified, your level (e.g., L5) becomes a portable asset."
            illustration={<HeroIllustration />}
          />

          <FeatureRow
            icon={Search}
            title="Hybrid Semantic Search"
            desc="Our engine combines Vector Similarity with Keyword Heuristics to understand context. Recruiters find you based on what you can do, not just what's on your resume."
            reverse
            illustration={<SearchIllustration />}
          />

          <FeatureRow
            icon={Zap}
            title="Instant Qualification"
            desc="Don't prove you can code twice. If you passed the bar at a top-tier tech company, our partners accept that as proof of skill."
            illustration={<SpeedIllustration />}
          />

          <FeatureRow
            icon={EyeOff}
            title="Stealth & Control"
            desc="Block your current employer. Control exactly which data points are shared. You remain anonymous until you accept a request."
            reverse
            illustration={<PrivacyIllustration />}
          />
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-32 px-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
          Ready to claim your offer?
        </h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 10,000+ top engineers who have stopped interviewing and started negotiating.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="h-14 px-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-xl shadow-blue-600/20"
            asChild
          >
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight text-slate-900">
            GetFinalOffer
          </span>
        </div>
        <div className="flex gap-8 text-sm text-slate-500 font-medium">
          <Link href="#" className="hover:text-slate-900">Privacy</Link>
          <Link href="#" className="hover:text-slate-900">Terms</Link>
        </div>
        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()} Inc.
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="bg-white min-h-screen selection:bg-blue-100 selection:text-blue-900">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}