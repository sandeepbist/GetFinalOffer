"use client";

import { Hero, Features, CTA, Footer } from "@/components/landing";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { HowItWorks } from "@/components/ui/HowItWorks";
import ScrollWrapper from "@/components/ScrollWrapper";

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