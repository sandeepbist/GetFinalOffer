"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Check, Lock, Zap, FileText,
    Search, Sparkles, Filter,
    ShieldCheck, EyeOff, BrainCircuit, ScanSearch, type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const BlueprintGrid = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-100/50" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-100/50" />
    </div>
);

const Node = ({ className, icon: Icon, active = false, label }: { className?: string, icon?: LucideIcon, active?: boolean, label?: string }) => (
    <div className="flex flex-col items-center gap-2 relative z-10">
        <div className={cn(
            "w-12 h-12 rounded-2xl bg-white border flex items-center justify-center shadow-sm transition-all duration-500",
            active ? "border-blue-400 shadow-lg shadow-blue-100 ring-1 ring-blue-100" : "border-slate-200",
            className
        )}>
            {Icon && <Icon className={cn("w-5 h-5", active ? "text-blue-600" : "text-slate-400")} />}
            {active && (
                <span className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/10 animate-pulse" />
            )}
        </div>
        {label && (
            <div className="px-2 py-0.5 bg-white border border-slate-100 rounded-md shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
        )}
    </div>
);

export const HeroIllustration = () => {
    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-8">
            <BlueprintGrid />

            <motion.div
                className="absolute top-12 left-12 w-64 h-80 bg-white border border-slate-200 rounded-lg opacity-40 rotate-[-6deg] scale-90 blur-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.2 }}
            >
                <div className="p-4 space-y-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full" />
                    <div className="h-3 w-32 bg-slate-200 rounded" />
                    <div className="space-y-1">
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-full bg-slate-100 rounded" />
                        <div className="h-2 w-2/3 bg-slate-100 rounded" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="relative w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="bg-slate-900 px-4 py-3 flex justify-between items-center">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    </div>
                    <div className="text-[10px] font-mono text-blue-300 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED_SIG_VALID
                    </div>
                </div>

                <div className="p-5 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Annual Compensation</div>
                            <div className="text-3xl font-bold text-slate-900 tracking-tight">$240,000</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>

                    <div className="relative pl-4 border-l-2 border-slate-100 space-y-4">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-green-500 rounded-full ring-4 ring-white" />
                            <div className="text-xs font-bold text-slate-700">Level Verified (L5)</div>
                            <div className="text-[10px] text-slate-500">Source: Stripe Inc. (DKIM Signed)</div>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white" />
                            <div className="text-xs font-bold text-slate-700">Interview Skipped</div>
                            <div className="text-[10px] text-slate-500">Bypassed technical screen</div>
                        </div>
                    </div>

                    <div className="w-full py-2 bg-blue-600 rounded-lg text-white text-xs font-bold text-center shadow-lg shadow-blue-200">
                        Accept Interview
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const SearchIllustration = () => {
    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden flex items-center justify-center py-10">
            <BlueprintGrid />

            <div className="relative w-full max-w-sm h-full flex flex-col justify-between items-center z-10 px-6">

                <div className="w-full relative z-20">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 pl-4 flex items-center gap-3 relative">
                        <Search className="w-4 h-4 text-slate-400" />
                        <div className="text-sm font-medium text-slate-700">Senior React dev with leadership</div>

                        <div className="absolute -inset-0.5 rounded-xl border border-blue-200 opacity-50 animate-pulse" />
                    </div>

                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 h-12">
                        <svg className="w-full h-full overflow-visible">
                            <path d="M96,0 L96,12 L192,12 L192,48" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                            <path d="M96,0 L96,12 L0,12 L0,48" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                            <circle r="2" fill="#3b82f6">
                                <animateMotion dur="1.5s" repeatCount="indefinite" path="M96,0 L96,12 L192,12 L192,48" />
                            </circle>
                            <circle r="2" fill="#3b82f6">
                                <animateMotion dur="1.5s" repeatCount="indefinite" path="M96,0 L96,12 L0,12 L0,48" />
                            </circle>
                        </svg>
                    </div>
                </div>

                <div className="w-full flex justify-between items-center mt-12 mb-8">
                    <Node icon={BrainCircuit} active label="STRATEGIST" className="bg-purple-50 border-purple-200" />
                    <div className="flex-1 border-b border-dashed border-slate-200 relative mx-4">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 bg-slate-50 px-1">HYBRID_MERGE</span>
                    </div>
                    <Node icon={Filter} active label="KEYWORDS" className="bg-blue-50 border-blue-200" />
                </div>

                <div className="relative z-10 mb-8">
                    <div className="w-48 h-16 bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden shadow-xl shadow-slate-900/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                                <ScanSearch className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-blue-400 tracking-wider">ENGINE</div>
                                <div className="text-xs font-bold text-white">VECTOR + TEXT</div>
                            </div>
                        </div>

                        <div className="absolute top-0 bottom-0 w-1 bg-white/20 blur-sm animate-[marquee_2s_linear_infinite]" style={{ left: '-10%' }} />
                    </div>

                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200 overflow-hidden">
                        <motion.div
                            className="w-full h-1/2 bg-green-500"
                            animate={{ y: ["-100%", "200%"] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>

                <motion.div
                    className="w-full bg-white rounded-xl shadow-lg border border-slate-200 p-4 relative z-20"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100" />
                            <div>
                                <div className="h-2 w-20 bg-slate-800 rounded mb-1" />
                                <div className="h-1.5 w-12 bg-slate-200 rounded" />
                            </div>
                        </div>
                        <div className="px-2 py-1 bg-green-50 rounded text-[10px] font-bold text-green-700 flex items-center gap-1 border border-green-100">
                            <Sparkles className="w-3 h-3" />
                            AI VERIFIED
                        </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="text-[10px] text-slate-500 leading-relaxed">
                            <span className="font-bold text-slate-700">Evaluator Reason:</span> Semantic match on leadership principles + exact tech stack overlap.
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export const PrivacyIllustration = () => {
    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden flex items-center justify-center">
            <BlueprintGrid />

            <div className="relative w-64 h-64 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="h-14 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/20" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                        <div className="w-3 h-3 rounded-full bg-green-400/20" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">PRIVATE_ACCESS</div>
                </div>

                <div className="p-5 space-y-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <div className="h-3 w-20 bg-slate-200 rounded" />
                            <div className="h-2 w-32 bg-slate-100 rounded" />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center group">
                            <span className="text-xs text-slate-400">Current Employer</span>
                            <div className="relative">
                                <div className="h-4 w-24 bg-slate-800 rounded filter blur-sm transition-all duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <EyeOff className="w-3 h-3 text-white/50" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-xs text-slate-400">Salary Expectations</span>
                            <div className="relative">
                                <div className="h-4 w-16 bg-slate-800 rounded filter blur-sm transition-all duration-300" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Lock className="w-3 h-3 text-white/50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-slate-600">Identity Cryptographically Secured</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SpeedIllustration = () => {
    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
            <BlueprintGrid />

            <div className="relative w-full max-w-sm space-y-6">

                <div className="flex items-center gap-4 opacity-30 grayscale">
                    <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-xs font-bold">1</div>
                    <div className="h-0.5 flex-1 bg-slate-300 border-t border-dashed border-slate-400" />
                    <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-xs font-bold">2</div>
                    <div className="h-0.5 flex-1 bg-slate-300 border-t border-dashed border-slate-400" />
                    <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-xs font-bold">3</div>
                </div>

                <div className="relative bg-white rounded-xl border border-blue-100 shadow-xl shadow-blue-500/5 p-4 flex items-center gap-4 z-10">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                        <Zap className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between mb-1.5">
                            <span className="text-xs font-bold text-blue-900 uppercase">Direct Access</span>
                            <span className="text-[10px] font-mono text-blue-600">t=0.2s</span>
                        </div>
                        <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1.2, ease: "circOut" }}
                            />
                        </div>
                    </div>

                    <Check className="w-5 h-5 text-green-500" />
                </div>
            </div>
        </div>
    );
};

export const VerificationIllustration = HeroIllustration;