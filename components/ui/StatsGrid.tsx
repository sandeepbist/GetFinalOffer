"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isInView, value]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(0) + "M";
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + "K";
        }
        return num.toLocaleString();
    };

    return (
        <span ref={ref}>
            {prefix}{formatNumber(count)}{suffix}
        </span>
    );
}

interface StatProps {
    value: number;
    prefix?: string;
    suffix?: string;
    label: string;
    delay: number;
}

function Stat({ value, prefix = "", suffix = "", label, delay }: StatProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="text-center"
        >
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading tracking-tight">
                <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </div>
            <div className="mt-3 text-sm text-text-muted uppercase tracking-wider font-medium">
                {label}
            </div>
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
        <section className="py-24 bg-section border-y border-border">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {stats.map((stat, index) => (
                        <Stat key={stat.label} {...stat} delay={index * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
