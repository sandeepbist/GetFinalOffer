"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { Shield, Search, TrendingUp, FileCheck } from "lucide-react";

const steps = [
    {
        icon: Shield,
        title: "Verify Once",
        description: "Share your interview performance across companies. No more repeating the same whiteboard problems.",
    },
    {
        icon: Search,
        title: "Get Discovered",
        description: "Top companies find you based on verified skills and experience, not keyword-stuffed resumes.",
    },
    {
        icon: TrendingUp,
        title: "Receive Offers",
        description: "Companies compete for you with direct compensation offers. No recruiter middlemen.",
    },
    {
        icon: FileCheck,
        title: "Negotiate & Accept",
        description: "Compare offers side by side with full transparency. Accept the best one on your terms.",
    },
];

function Step({
    step,
    title,
    description,
    icon: Icon,
    isLast,
}: {
    step: number;
    title: string;
    description: string;
    icon: React.ElementType;
    isLast: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
                duration: 0.5,
                delay: step * 0.15,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex gap-6 md:gap-8"
        >
            {/* Timeline column */}
            <div className="flex flex-col items-center">
                {/* Gradient number badge */}
                <div className="relative shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                    <span className="text-white text-sm font-bold">{step}</span>
                </div>
                {/* Connecting line */}
                {!isLast && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.6, delay: step * 0.15 + 0.3 }}
                        className="flex-1 w-px bg-linear-to-b from-primary/45 to-transparent my-3 origin-top min-h-[40px]"
                    />
                )}
            </div>

            {/* Content card */}
            <div className="pb-12 flex-1">
                <div className="p-6 rounded-2xl bg-surface/70 border border-border/60 hover:border-primary/30 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-semibold text-heading">{title}</h3>
                    </div>
                    <p className="text-text-muted leading-relaxed">{description}</p>
                </div>
            </div>
        </motion.div>
    );
}

export function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            className="py-32 px-6 bg-section-alt"
        >
            <div className="max-w-3xl mx-auto">
                <SectionHeader
                    badge="How it Works"
                    title="Four Steps to Your Best Offer"
                    subtitle="A streamlined process that puts engineers in control of their career trajectory."
                />

                <div className="mt-16">
                    {steps.map((step, index) => (
                        <Step
                            key={step.title}
                            step={index + 1}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
