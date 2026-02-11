"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    Lock, Zap, FileText, Search, Sparkles, Filter,
    ShieldCheck, EyeOff, BrainCircuit, ScanSearch, Mail,
    CheckCircle2, ArrowRight, Binary, Fingerprint,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BlueprintGrid = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] opacity-50" />
    </div>
);

const FloatingParticle = ({ delay = 0, duration = 3, className = "" }) => (
    <motion.div
        className={cn("absolute w-1 h-1 rounded-full bg-blue-400", className)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            y: [20, -40],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeOut",
        }}
    />
);

const GlowOrb = ({ className = "", color = "blue" }: { className?: string; color?: "blue" | "green" | "purple" }) => {
    const colorMap = {
        blue: "from-blue-400/30 to-blue-600/10",
        green: "from-green-400/30 to-green-600/10",
        purple: "from-purple-400/30 to-purple-600/10",
    };

    return (
        <motion.div
            className={cn(
                "absolute rounded-full bg-gradient-to-br blur-2xl",
                colorMap[color],
                className
            )}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
};

export const HeroIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div
            ref={ref}
            role="img"
            aria-label="Animated illustration showing a verified job offer with $240,000 annual compensation, L5 level verification from Stripe, and interview bypass feature"
            className="w-full h-full bg-section-alt relative overflow-hidden flex items-center justify-center p-8"
        >
            <BlueprintGrid />

            <GlowOrb color="blue" className="w-64 h-64 -top-20 -right-20" />
            <GlowOrb color="purple" className="w-48 h-48 bottom-10 -left-20" />

            <motion.div
                className="absolute top-8 left-8 w-56 h-72 bg-surface/60 border border-border rounded-2xl opacity-0 rotate-[-8deg] scale-90 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 0.5, x: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <div className="p-4 space-y-3">
                    <div className="w-10 h-10 bg-muted rounded-full" />
                    <div className="h-2.5 w-28 bg-muted-foreground/20 rounded" />
                    <div className="space-y-1.5">
                        <div className="h-2 w-full bg-muted rounded" />
                        <div className="h-2 w-full bg-muted rounded" />
                        <div className="h-2 w-2/3 bg-muted rounded" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="relative w-80 bg-surface rounded-3xl shadow-2xl border border-border overflow-hidden z-10"
                style={{ boxShadow: "var(--shadow)" }}
                initial={{ y: 60, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <motion.div
                        className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        VERIFIED_SIG_VALID
                    </motion.div>
                </div>

                <div className="p-6 space-y-6 bg-surface">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="text-[11px] uppercase tracking-widest text-text-muted font-semibold">Annual Compensation</div>
                            <motion.div
                                className="text-4xl font-bold text-heading tracking-tight"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                $240,000
                            </motion.div>
                        </div>
                        <motion.div
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <FileText className="w-6 h-6 text-white" aria-hidden="true" />
                        </motion.div>
                    </div>

                    <div className="relative pl-5 border-l-2 border-border space-y-5">
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 1 }}
                        >
                            <motion.div
                                className="absolute -left-[23px] top-1 w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-surface shadow-lg shadow-emerald-500/20"
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ delay: 1.2, type: "spring" }}
                            />
                            <div className="text-sm font-bold text-heading">Level Verified (L5)</div>
                            <div className="text-xs text-text-muted mt-0.5">Source: Stripe Inc. (DKIM Signed)</div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 1.3 }}
                        >
                            <motion.div
                                className="absolute -left-[23px] top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-surface shadow-lg shadow-blue-500/20"
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ delay: 1.5, type: "spring" }}
                            />
                            <div className="text-sm font-bold text-heading">Interview Skipped</div>
                            <div className="text-xs text-text-muted mt-0.5">Bypassed technical screen</div>
                        </motion.div>
                    </div>

                    <motion.button
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-blue-500/20 relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Accept Interview
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.button>
                </div>
            </motion.div>

            {[...Array(8)].map((_, i) => (
                <FloatingParticle
                    key={i}
                    delay={i * 0.3}
                    duration={2 + Math.random()}
                    className={`${["left-1/4", "left-1/3", "left-1/2", "right-1/4", "right-1/3"][i % 5]} bottom-20`}
                />
            ))}
        </div>
    );
};

export const SearchIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div
            ref={ref}
            role="img"
            aria-label="Animated illustration showing hybrid semantic search with vector and keyword matching, displaying a 98% match result"
            className="w-full h-full bg-section-alt relative overflow-hidden flex items-center justify-center py-10"
        >
            <BlueprintGrid />
            <GlowOrb color="purple" className="w-48 h-48 top-10 right-10" />

            <div className="relative w-full max-w-sm h-full flex flex-col justify-between items-center z-10 px-6">
                <motion.div
                    className="w-full relative z-20"
                    initial={{ y: -20, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-surface rounded-2xl shadow-xl border border-border p-3 pl-5 flex items-center gap-4 relative">
                        <Search className="w-5 h-5 text-text-muted" aria-hidden="true" />
                        <div className="text-sm font-medium text-heading">Senior React dev with leadership</div>
                        <motion.div
                            className="absolute -inset-0.5 rounded-2xl border-2 border-blue-400/50"
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    <svg className="absolute top-full left-1/2 -translate-x-1/2 w-48 h-16 overflow-visible">
                        <motion.path
                            d="M96,0 L96,16 L192,16 L192,64"
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                        <motion.path
                            d="M96,0 L96,16 L0,16 L0,64"
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                        <motion.circle
                            r="4"
                            fill="#8b5cf6"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                        >
                            <animateMotion dur="1.5s" repeatCount="indefinite" path="M96,0 L96,16 L192,16 L192,64" />
                        </motion.circle>
                        <motion.circle
                            r="4"
                            fill="#3b82f6"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                        >
                            <animateMotion dur="1.5s" repeatCount="indefinite" path="M96,0 L96,16 L0,16 L0,64" />
                        </motion.circle>
                    </svg>
                </motion.div>

                <div className="w-full flex justify-between items-center mt-16 mb-8">
                    <motion.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <BrainCircuit className="w-7 h-7 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Vector</span>
                    </motion.div>

                    <div className="flex-1 relative mx-6">
                        <motion.div
                            className="h-px bg-gradient-to-r from-purple-400 via-border to-blue-400"
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : {}}
                            transition={{ delay: 1, duration: 0.8 }}
                        />
                        <motion.span
                            className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-text-muted bg-section-alt px-2"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1.5 }}
                        >
                            HYBRID_MERGE
                        </motion.span>
                    </div>

                    <motion.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1 }}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Filter className="w-7 h-7 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Keywords</span>
                    </motion.div>
                </div>

                <motion.div
                    className="relative z-10 mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1.2, type: "spring" }}
                >
                    <div className="w-52 h-20 bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-blue-600/20 to-purple-600/30" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur border border-white/10">
                                <ScanSearch className="w-5 h-5 text-white" aria-hidden="true" />
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-blue-300 tracking-widest">SEARCH ENGINE</div>
                                <div className="text-sm font-bold text-white">VECTOR + TEXT</div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-10 bg-border overflow-hidden"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : {}}
                        transition={{ delay: 1.5 }}
                    >
                        <motion.div
                            className="w-full h-1/2 bg-emerald-500"
                            animate={{ y: ["-100%", "300%"] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="w-full bg-surface rounded-2xl shadow-xl border border-border p-5 relative z-20"
                    initial={{ y: 30, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 1.8 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted" />
                            <div>
                                <div className="h-2.5 w-24 bg-heading rounded mb-1" />
                                <div className="h-2 w-16 bg-muted rounded" />
                            </div>
                        </div>
                        <motion.div
                            className="px-3 py-1.5 bg-emerald-500/10 rounded-lg text-[10px] font-bold text-emerald-500 flex items-center gap-1.5 border border-emerald-500/20"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                            98% MATCH
                        </motion.div>
                    </div>
                    <div className="p-3 bg-highlight rounded-xl border border-border">
                        <div className="text-[11px] text-text-muted leading-relaxed">
                            <span className="font-bold text-heading">AI Analysis:</span> Semantic match on leadership + exact tech stack overlap
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const PrivacyIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div
            ref={ref}
            role="img"
            aria-label="Animated illustration showing privacy controls with blurred sensitive data, encrypted employer and salary information, with only verified level visible"
            className="w-full h-full bg-section-alt relative overflow-hidden flex items-center justify-center"
        >
            <BlueprintGrid />
            <GlowOrb color="blue" className="w-40 h-40 top-10 left-10" />

            <motion.div
                className="relative w-72 bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden"
                initial={{ y: 40, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8 }}
            >
                <div className="h-14 border-b border-border bg-section-alt flex items-center px-5 justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/60" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                        <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    </div>
                    <motion.div
                        className="text-[10px] text-text-muted font-mono flex items-center gap-1"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Lock className="w-3 h-3" aria-hidden="true" />
                        ENCRYPTED
                    </motion.div>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex gap-4">
                        <motion.div
                            className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Fingerprint className="w-7 h-7 text-text-muted" aria-hidden="true" />
                        </motion.div>
                        <div className="space-y-2 flex-1">
                            <div className="h-3 w-24 bg-muted rounded" />
                            <div className="h-2 w-36 bg-muted/50 rounded" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <motion.div
                            className="flex justify-between items-center group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="text-xs text-text-muted">Current Employer</span>
                            <div className="relative">
                                <motion.div
                                    className="h-5 w-28 bg-slate-900 rounded-lg"
                                    style={{ filter: "blur(8px)" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <EyeOff className="w-4 h-4 text-white/60" aria-hidden="true" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.7 }}
                        >
                            <span className="text-xs text-text-muted">Salary Range</span>
                            <div className="relative">
                                <motion.div
                                    className="h-5 w-20 bg-slate-900 rounded-lg"
                                    style={{ filter: "blur(8px)" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-white/60" aria-hidden="true" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex justify-between items-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.9 }}
                        >
                            <span className="text-xs text-text-muted">Verified Level</span>
                            <div className="px-3 py-1 bg-emerald-500/10 rounded-lg text-xs font-bold text-emerald-500 border border-emerald-500/20">
                                L5 Staff
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="pt-4 border-t border-border flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1.2 }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <ShieldCheck className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                        </motion.div>
                        <span className="text-xs font-medium text-text">Cryptographically Secured</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export const SpeedIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div
            ref={ref}
            role="img"
            aria-label="Animated illustration comparing traditional 5-round interviews taking 6+ hours versus GetFinalOffer's instant verification in 0.2 seconds"
            className="w-full h-full bg-section-alt relative overflow-hidden flex items-center justify-center p-6"
        >
            <BlueprintGrid />
            <GlowOrb color="green" className="w-32 h-32 bottom-10 right-10" />

            <div className="relative w-full max-w-sm space-y-8">
                <motion.div
                    className="flex items-center gap-4 opacity-40"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.4 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-3 flex-1">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <React.Fragment key={step}>
                                <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-xs font-bold text-text-muted">
                                    {step}
                                </div>
                                {step < 5 && <div className="flex-1 h-px border-t-2 border-dashed border-border" />}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="text-center text-xs text-text-muted font-medium"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                >
                    Traditional: 5 rounds, 6+ hours
                </motion.div>

                <motion.div
                    className="relative bg-surface rounded-2xl border-2 border-blue-500/30 shadow-2xl p-5 flex items-center gap-5"
                    style={{ boxShadow: "var(--shadow)" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    <motion.div
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
                        animate={isInView ? { rotate: [0, 360] } : {}}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <Zap className="w-7 h-7 text-white" aria-hidden="true" />
                    </motion.div>

                    <div className="flex-1">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-heading">GetFinalOffer</span>
                            <motion.span
                                className="text-xs font-mono text-blue-500 font-bold"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 1.5 }}
                            >
                                t=0.2s
                            </motion.span>
                        </div>
                        <div className="h-3 w-full bg-highlight rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                                initial={{ width: "0%" }}
                                animate={isInView ? { width: "100%" } : {}}
                                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
                    >
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" aria-hidden="true" />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="text-center text-sm text-emerald-500 font-semibold"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 2 }}
                >
                    Skip interviews. Get offers instantly.
                </motion.div>
            </div>
        </div>
    );
};

export const VerificationIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div
            ref={ref}
            role="img"
            aria-label="Animated illustration showing employment verification with DKIM 2048-bit RSA signature validation and source verification from Stripe Inc."
            className="w-full h-full bg-section-alt relative overflow-hidden flex items-center justify-center p-6"
        >
            <BlueprintGrid />
            <GlowOrb color="green" className="w-48 h-48 top-10 right-10" />

            <div className="relative w-full max-w-sm">
                <motion.div
                    className="bg-surface rounded-3xl shadow-2xl border border-border overflow-hidden"
                    initial={{ y: 40, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" aria-hidden="true" />
                        <div className="text-sm text-white font-medium">Employment Verification</div>
                    </div>

                    <div className="p-6 space-y-5">
                        <motion.div
                            className="flex items-center gap-4 p-4 bg-highlight rounded-2xl border border-border"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <Binary className="w-6 h-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-text-muted mb-1">DKIM Signature</div>
                                <div className="font-mono text-xs text-heading truncate">2048-bit RSA verified</div>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ delay: 1, type: "spring" }}
                            >
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" aria-hidden="true" />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-4 p-4 bg-highlight rounded-2xl border border-border"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.7 }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-text-muted mb-1">Source Verification</div>
                                <div className="font-mono text-xs text-heading">Stripe Inc. confirmed</div>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ delay: 1.2, type: "spring" }}
                            >
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" aria-hidden="true" />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="pt-4 border-t border-border"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1.5 }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-heading">Verification Status</span>
                                <motion.div
                                    className="px-4 py-2 bg-emerald-500 rounded-xl text-white text-sm font-bold shadow-lg shadow-emerald-500/20"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    VERIFIED
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};