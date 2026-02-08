"use client";

import { Hero, Features, CTA, Footer } from "@/components/landing";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { HowItWorks } from "@/components/ui/HowItWorks";
import ScrollWrapper from "@/components/ScrollWrapper";

export default function HomePage() {
  return (
    <ScrollWrapper>
      <main className="bg-section min-h-screen selection:bg-primary/20 selection:text-primary">
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