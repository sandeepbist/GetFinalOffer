"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GradientButton } from "@/components/ui/MagneticButton";

export function CTA() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="relative py-32 px-6 overflow-hidden"
        >
            {/* Static gradient mesh — no animation */}
            <div className="absolute inset-0 gradient-mesh" />

            <div className="max-w-3xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading tracking-tight mb-6"
                >
                    Ready to Get Your{" "}
                    <span className="text-gradient-blue">Final Offer?</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="text-xl text-text-muted mb-12 max-w-xl mx-auto leading-relaxed"
                >
                    Stop leaving money on the table. Verify your skills and let companies make their best offers.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link href="/auth">
                        <GradientButton size="lg" variant="primary">
                            Get Started Free
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                        </GradientButton>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
