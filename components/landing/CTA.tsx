"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BlobBackground } from "@/components/ui/BlobBackground";

export function CTA() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section ref={ref} className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
            <BlobBackground />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">
                            Join 10,000+ Engineers
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
                        Ready to claim your offer?
                    </h2>

                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop wasting time on repetitive interviews. Let top companies
                        compete for your talent.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/auth">
                            <MagneticButton
                                strength={0.2}
                                className="h-16 px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-200 border-0"
                            >
                                <span className="flex items-center gap-3">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </MagneticButton>
                        </Link>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-sm text-slate-500"
                    >
                        No credit card required · Setup in 5 minutes
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
