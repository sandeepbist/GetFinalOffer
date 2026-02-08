"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroIllustration } from "@/components/ui/landing-illustrations";
import { GradientButton } from "@/components/ui/MagneticButton";
import { BlobBackground, GridBackground } from "@/components/ui/BlobBackground";

export function Hero() {
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
            className="relative min-h-screen flex items-center overflow-hidden bg-section"
        >
            <BlobBackground />
            <GridBackground className="opacity-50" />

            <div className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div style={{ y, opacity }} className="max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-heading mb-8 leading-[1.05]"
                    >
                        Stop Interviewing.{" "}
                        <span className="relative">
                            <span className="relative z-10 text-gradient-blue">
                                Start Negotiating.
                            </span>
                            <motion.span
                                className="absolute -inset-1 bg-highlight rounded-lg -z-10"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                style={{ originX: 0 }}
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl text-text-muted mb-12 leading-relaxed max-w-lg"
                    >
                        Verify your interview history once, then let top companies compete for you with direct compensation offers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <Link href="/auth">
                            <GradientButton size="lg" variant="primary">
                                Get Started
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </GradientButton>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative rounded-3xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow)" }}>
                        <HeroIllustration />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
