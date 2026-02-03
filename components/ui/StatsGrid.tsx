"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Zap, TrendingUp, Building2, LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { cn } from "@/lib/utils";

interface StatCardProps {
    icon: LucideIcon;
    value: number;
    suffix?: string;
    label: string;
    delay?: number;
    color?: "blue" | "green" | "purple" | "orange";
}

const colorMap = {
    blue: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        border: "border-blue-100",
        glow: "shadow-blue-100",
    },
    green: {
        bg: "bg-green-50",
        icon: "text-green-600",
        border: "border-green-100",
        glow: "shadow-green-100",
    },
    purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        border: "border-purple-100",
        glow: "shadow-purple-100",
    },
    orange: {
        bg: "bg-orange-50",
        icon: "text-orange-600",
        border: "border-orange-100",
        glow: "shadow-orange-100",
    },
};

function StatCard({ icon: Icon, value, suffix = "", label, delay = 0, color = "blue" }: StatCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const colors = colorMap[color];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "relative group p-6 bg-white rounded-2xl border",
                colors.border,
                "shadow-lg hover:shadow-xl transition-all duration-500",
                colors.glow
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 rounded-2xl" />

            <div className="relative z-10">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    colors.bg,
                    "group-hover:scale-110 transition-transform duration-300"
                )}>
                    <Icon className={cn("w-6 h-6", colors.icon)} />
                </div>

                <div className="text-4xl font-bold text-slate-900 tracking-tight mb-1">
                    <AnimatedCounter target={value} suffix={suffix} duration={2.5} />
                </div>

                <div className="text-sm text-slate-500 font-medium">{label}</div>
            </div>

            <div className={cn(
                "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-br",
                color === "blue" && "from-blue-400/20 to-transparent",
                color === "green" && "from-green-400/20 to-transparent",
                color === "purple" && "from-purple-400/20 to-transparent",
                color === "orange" && "from-orange-400/20 to-transparent"
            )} />
        </motion.div>
    );
}

export function StatsGrid() {
    const stats = [
        { icon: Users, value: 10000, suffix: "+", label: "Engineers Verified", color: "blue" as const },
        { icon: Zap, value: 98, suffix: "%", label: "Faster Hiring", color: "green" as const },
        { icon: TrendingUp, value: 50, suffix: "K+", label: "Avg Salary Increase", color: "purple" as const },
        { icon: Building2, value: 500, suffix: "+", label: "Top Companies", color: "orange" as const },
    ];

    return (
        <section className="py-24 px-6 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={stat.label}
                            {...stat}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
