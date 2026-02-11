"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatProps {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    delay: number;
}

function Stat({ value, label, prefix = "", suffix = "", delay }: StatProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-8 rounded-2xl
                bg-surface/70
                backdrop-blur-sm
                border border-border/60
                hover:border-primary/35
                hover:shadow-lg hover:shadow-primary/10
                hover:-translate-y-1
                transition-all duration-300 cursor-default"
        >
            <div className="text-3xl md:text-4xl font-bold text-heading tracking-tight mb-2">
                {prefix}
                <AnimatedCounter target={value} />
                {suffix}
            </div>
            <div className="text-sm text-text-muted font-medium tracking-wide uppercase">
                {label}
            </div>
            {/* Hover gradient accent */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/10 to-highlight/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
    );
}

const stats: Omit<StatProps, "delay">[] = [
    { value: 8247, label: "Engineers Verified" },
    { value: 847, suffix: "K", label: "Hours Saved" },
    { value: 142, prefix: "$", suffix: "M", label: "Offers Negotiated" },
    { value: 34, suffix: "%", label: "Avg Salary Increase" },
];

export function StatsGrid() {
    return (
        <section className="py-28 bg-section border-y border-border/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <Stat key={stat.label} {...stat} delay={index * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
