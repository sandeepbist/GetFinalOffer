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
                    subtitle="Verify your interview history once with documents you control, then let verified outcomes do the talking."
                />

                <div className="space-y-0">
                    <FeatureShowcase
                        icon={Shield}
                        badge="Human-Reviewed"
                        title="Document Verification"
                        description="Upload offer letters or employment confirmation and our review team verifies each claim. Verified interview progress becomes a trust signal recruiters can rely on."
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
                        badge="Direct"
                        title="Skip Repeated Screens"
                        description="When verified interview progress shows you already cleared the bar at a partner company, recruiters start the conversation further along the process."
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
