"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureShowcaseProps {
    icon: React.ElementType;
    title: string;
    description: string;
    illustration: React.ReactNode;
    badge?: string;
    reverse?: boolean;
}

export function FeatureShowcase({
    icon: Icon,
    title,
    description,
    illustration,
    badge,
    reverse = false,
}: FeatureShowcaseProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <div
            ref={ref}
            className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-16 lg:py-24",
                "border-b border-border-subtle last:border-0"
            )}
        >
            <motion.div
                initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn("flex flex-col justify-center", reverse && "lg:order-2")}
            >
                <div className="space-y-6">
                    {badge && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-highlight rounded-lg">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                                {badge}
                            </span>
                        </div>
                    )}

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                        <Icon className="w-7 h-7" aria-hidden="true" />
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                        {title}
                    </h3>

                    <p className="text-lg text-text-muted leading-relaxed max-w-md">
                        {description}
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: reverse ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden",
                    "bg-surface border border-border shadow-xl",
                    reverse && "lg:order-1"
                )}
            >
                {illustration}
            </motion.div>
        </div>
    );
}
