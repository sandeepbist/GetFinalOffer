"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Zap, EyeOff, Search, Sparkles } from "lucide-react";
import {
  HeroIllustration,
  SpeedIllustration,
  PrivacyIllustration,
  SearchIllustration,
  VerificationIllustration
} from "@/components/ui/landing-illustrations";
import { MagneticButton, GradientButton } from "@/components/ui/MagneticButton";
import { BlobBackground, GridBackground } from "@/components/ui/BlobBackground";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { HowItWorks } from "@/components/ui/HowItWorks";
import ScrollWrapper from "@/components/ScrollWrapper";
import { cn } from "@/lib/utils";

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-blue-50 border border-blue-100",
        "text-sm font-semibold text-blue-700",
        className
      )}
    >
      <Sparkles className="w-4 h-4" />
      {children}
    </motion.div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
    >
      <BlobBackground />
      <GridBackground className="opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div style={{ y, opacity }} className="max-w-2xl">
          <Badge className="mb-8">Trusted by 10,000+ Engineers</Badge>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.05]"
          >
            Stop Interviewing.{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Start Negotiating.
              </span>
              <motion.span
                className="absolute -inset-1 bg-blue-100/50 rounded-lg -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg"
          >
            Verify your interview history once. Top companies skip the technical
            rounds and compete for you with direct offers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/auth">
              <GradientButton size="lg" variant="primary">
                Verify My Profile
                <ArrowRight className="w-5 h-5" />
              </GradientButton>
            </Link>
            <Link href="#features">
              <GradientButton size="lg" variant="secondary">
                How it Works
              </GradientButton>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 flex items-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              5-minute setup
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative hidden lg:block h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <HeroIllustration />
        </motion.div>
      </div>


    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  badge,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-16 md:mb-20 max-w-2xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-semibold text-blue-700">{badge}</span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-500 leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}

function FeatureShowcase({
  icon: Icon,
  title,
  description,
  illustration,
  badge,
  reverse = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  illustration: React.ReactNode;
  badge?: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-16 lg:py-24",
        "border-b border-slate-100 last:border-0"
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn("flex flex-col justify-center", reverse && "lg:order-2")}
      >
        <div className="space-y-6">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {badge}
              </span>
            </div>
          )}

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Icon className="w-7 h-7" />
          </div>

          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h3>

          <p className="text-lg text-slate-600 leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reverse ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden",
          "bg-white border border-slate-200 shadow-xl",
          reverse && "lg:order-1"
        )}
      >
        {illustration}
      </motion.div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Core Features"
          title="Infrastructure for your career."
          subtitle="We built the first protocol that allows you to cryptographically verify and transport your professional reputation."
        />

        <div className="space-y-0">
          <FeatureShowcase
            icon={Shield}
            badge="DKIM 2048-bit"
            title="Cryptographic Verification"
            description="We validate your employment and interview history using DKIM signatures and direct-source data. Once verified, your level becomes a portable, cryptographically-secured asset."
            illustration={<VerificationIllustration />}
          />

          <FeatureShowcase
            icon={Search}
            badge="AI-Powered"
            title="Hybrid Semantic Search"
            description="Our engine combines Vector Similarity with Keyword Heuristics to understand context. Recruiters find you based on what you can do, not just what's on your resume."
            illustration={<SearchIllustration />}
            reverse
          />

          <FeatureShowcase
            icon={Zap}
            badge="Instant"
            title="Skip Technical Rounds"
            description="Don't prove you can code twice. If you passed the bar at a top-tier tech company, our partners accept that as proof of skill and skip straight to offers."
            illustration={<SpeedIllustration />}
          />

          <FeatureShowcase
            icon={EyeOff}
            badge="Private"
            title="Stealth Mode & Control"
            description="Block your current employer. Control exactly which data points are shared. You remain completely anonymous until you explicitly accept a connection request."
            illustration={<PrivacyIllustration />}
            reverse
          />
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <BlobBackground />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              Join 10,000+ Engineers
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            Ready to claim your offer?
          </h2>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop wasting time on repetitive interviews. Let top companies compete for your talent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth">
              <MagneticButton
                strength={0.2}
                className="h-16 px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-200 border-0"
              >
                <span className="flex items-center gap-3">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </span>
              </MagneticButton>
            </Link>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-slate-500"
          >
            No credit card required · Setup in 5 minutes
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-20 px-6 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                GetFinalOffer
              </span>
            </div>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
              Verify once. Interview never. Get competing offers from top companies.
            </p>
          </motion.div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} GetFinalOffer. Built with precision.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <ScrollWrapper>
      <main className="bg-white min-h-screen selection:bg-blue-100 selection:text-blue-900">
        <Hero />
        <StatsGrid />
        <HowItWorks />
        <Features />

        <CTA />
        <Footer />
      </main>
    </ScrollWrapper>
  );
}