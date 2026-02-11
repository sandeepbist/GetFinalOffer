"use client";

import { useRef } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/landing/Badge";

interface FeatureShowcaseProps {
    icon: LucideIcon;
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
    const isInView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });

    return (
        <div
            ref={ref}
            className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-16 lg:py-24",
                "border-b border-border/50 last:border-0"
            )}
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "flex flex-col justify-center",
                    reverse && "lg:order-2"
                )}
            >
                {badge && (
                    <div className="mb-6">
                        <Badge text={badge} />
                    </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                        {title}
                    </h3>
                </div>
                <p className="text-lg text-text-muted leading-relaxed max-w-md">
                    {description}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "tilt-3d",
                    reverse && "lg:order-1"
                )}
            >
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.25 }}
                    className="relative rounded-2xl overflow-hidden border border-border/60 bg-surface/70"
                    style={{ boxShadow: "var(--shadow)" }}
                >
                    {illustration}
                </motion.div>
            </motion.div>
        </div>
    );
}
