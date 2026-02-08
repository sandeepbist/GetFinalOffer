"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GradientButton } from "@/components/ui/MagneticButton";

export function CTA() {
    return (
        <section className="py-32 px-6 bg-section">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-heading tracking-tight mb-6 leading-tight">
                        Ready to skip the interview loop?
                    </h2>

                    <p className="text-xl text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
                        Verification takes 3 minutes. Offers start arriving within days.
                    </p>

                    <Link href="/auth">
                        <GradientButton size="lg" variant="primary">
                            Get Started
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                        </GradientButton>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
