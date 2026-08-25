"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Network, ShieldCheck, Zap, EyeOff } from "lucide-react";

interface PillarProps {
    icon: React.ElementType;
    badge: string;
    title: string;
    description: string;
    delay: number;
}

function ValuePillar({ icon: Icon, badge, title, description, delay }: PillarProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-6 md:p-8 rounded-2xl
                bg-surface/80
                backdrop-blur-md
                border border-border/70
                hover:border-primary/40
                hover:shadow-xl hover:shadow-primary/10
                hover:-translate-y-1.5
                transition-all duration-300 flex flex-col justify-between"
        >
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-highlight border border-border text-text-muted">
                        {badge}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-heading tracking-tight mb-2 group-hover:text-primary transition-colors duration-200">
                    {title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Hover gradient accent */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
    );
}

const pillars: Omit<PillarProps, "delay">[] = [
    {
        icon: Network,
        badge: "AI Graph",
        title: "Skill Graph Intelligence",
        description: "19.4k+ taxonomy nodes uncover deep skill relationships beyond flat resume keywords.",
    },
    {
        icon: ShieldCheck,
        badge: "Verified",
        title: "Cryptographic Proof",
        description: "DKIM-signed validation guarantees real interview performance and genuine offer history.",
    },
    {
        icon: Zap,
        badge: "Fast-Track",
        title: "Reverse Recruiting",
        description: "Pre-verified competency lets you bypass repetitive technical screenings straight to final offers.",
    },
    {
        icon: EyeOff,
        badge: "Private",
        title: "Blind Stealth Mode",
        description: "Automatic current-employer blocking keeps your identity hidden until you choose to connect.",
    },
];

export function StatsGrid() {
    return (
        <section className="py-20 md:py-28 bg-section border-y border-border/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pillars.map((pillar, index) => (
                        <ValuePillar key={pillar.title} {...pillar} delay={index * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
