"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StepProps {
    step: number;
    title: string;
    description: string;
}

function Step({ step, title, description }: StepProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: step * 0.1 }}
            className="relative"
        >
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-highlight border border-border flex items-center justify-center">
                    <span className="text-lg font-bold text-heading">{step}</span>
                </div>
                <div className="pt-2">
                    <h3 className="text-xl font-semibold text-heading mb-2">{title}</h3>
                    <p className="text-text-muted leading-relaxed">{description}</p>
                </div>
            </div>
        </motion.div>
    );
}

const steps = [
    {
        title: "Forward Your Offer Emails",
        description: "We extract and verify employment data from DKIM-signed emails. No passwords required.",
    },
    {
        title: "Get Verified",
        description: "Your work history becomes a tamper-proof credential verified by cryptographic signatures.",
    },
    {
        title: "Receive Offers",
        description: "Companies send direct compensation packages. No interviews—your skills are already proven.",
    },
];

export function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    return (
        <section ref={sectionRef} id="how-it-works" className="py-32 px-6 bg-section-alt">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-heading tracking-tight mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-text-muted">
                        No resumes. No cover letters. No 5-round technical gauntlets.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <Step
                            key={step.title}
                            step={index + 1}
                            {...step}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
