"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Upload, Shield, Search, Inbox, LucideIcon } from "lucide-react";

interface StepProps {
    step: number;
    icon: LucideIcon;
    title: string;
    description: string;
    isLast?: boolean;
}

function Step({ step, icon: Icon, title, description, isLast = false }: StepProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: step * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center group"
        >
            <div className="relative z-10 mb-6">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={isInView ? { scale: 1 } : { scale: 0.8 }}
                    transition={{ duration: 0.5, delay: step * 0.15 + 0.2 }}
                    className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center relative overflow-hidden group-hover:border-blue-200 group-hover:shadow-blue-100/50 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icon className="w-8 h-8 text-slate-700 group-hover:text-blue-600 transition-colors duration-300 relative z-10" />
                </motion.div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: step * 0.15 + 0.3, type: "spring" }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center shadow-lg"
                >
                    {step}
                </motion.div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>

            {!isLast && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+48px)] w-[calc(100%-96px)]">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.6, delay: step * 0.15 + 0.4 }}
                        className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 origin-left"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.3, delay: step * 0.15 + 0.8 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-t-2 border-slate-300 transform rotate-45"
                    />
                </div>
            )}
        </motion.div>
    );
}

export function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const steps = [
        {
            icon: Upload,
            title: "Verify Identity",
            description: "Connect your email and let our system validate your employment history using DKIM signatures",
        },
        {
            icon: Shield,
            title: "Build Profile",
            description: "Your verified experience becomes a portable, cryptographically-secured credential",
        },
        {
            icon: Search,
            title: "Get Discovered",
            description: "Our hybrid search matches you with companies looking for your exact skills and level",
        },
        {
            icon: Inbox,
            title: "Receive Offers",
            description: "Skip technical rounds entirely. Companies compete for you with direct compensation offers",
        },
    ];

    return (
        <section ref={sectionRef} className="py-32 px-6 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50/50" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm font-semibold text-blue-700">How It Works</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                        From Verified to Hired
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Four simple steps to skip interviews forever and receive competing offers directly
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
                    {steps.map((step, index) => (
                        <Step
                            key={step.title}
                            step={index + 1}
                            {...step}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
