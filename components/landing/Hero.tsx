"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroIllustration } from "@/components/ui/landing-illustrations";
import { GradientButton } from "@/components/ui/MagneticButton";
import { BlobBackground, GridBackground } from "@/components/ui/BlobBackground";
import { Badge } from "./Badge";

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
