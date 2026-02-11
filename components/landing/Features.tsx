"use client";

import { Shield, Zap, EyeOff, Search } from "lucide-react";
import {
    SpeedIllustration,
    PrivacyIllustration,
    SearchIllustration,
    VerificationIllustration,
} from "@/components/ui/landing-illustrations";
import { SectionHeader } from "./SectionHeader";
import { FeatureShowcase } from "./FeatureShowcase";

export function Features() {
    return (
        <section id="features" className="py-24 lg:py-32 px-6 bg-section relative">
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
