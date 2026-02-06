"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-20 px-6 bg-slate-950">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">
                                GetFinalOffer
                            </span>
                        </div>
                        <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
                            Verify once. Interview never. Get competing offers from top
                            companies.
                        </p>
                    </motion.div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

                    <div className="text-xs text-slate-500">
                        © {new Date().getFullYear()} GetFinalOffer. Built with precision.
                    </div>
                </div>
            </div>
        </footer>
    );
}
