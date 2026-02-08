"use client";

import { motion } from "framer-motion";

export function Footer() {
    return (
        <footer className="py-8 px-6 bg-section border-t border-border">
            <div className="max-w-7xl mx-auto">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-sm text-text-muted text-center"
                >
                    © {new Date().getFullYear()} GetFinalOffer. All rights reserved.
                </motion.p>
            </div>
        </footer>
    );
}
