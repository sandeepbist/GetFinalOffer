"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: string;
    align?: "left" | "center";
}

export function SectionHeader({
    title,
    subtitle,
    badge,
    align = "left",
}: SectionHeaderProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={cn(
                "mb-16 md:mb-20 max-w-2xl",
                align === "center" && "mx-auto text-center"
            )}
        >
            {badge && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-highlight rounded-full mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-semibold text-text">{badge}</span>
                </div>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-heading mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-text-muted leading-relaxed">{subtitle}</p>
            )}
        </motion.div>
    );
}
