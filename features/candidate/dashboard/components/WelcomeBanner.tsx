"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeBannerProps {
  name: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name }) => (
  <Card className="overflow-hidden border-border/80 bg-linear-to-br from-surface via-surface to-highlight/55">
    <CardContent className="p-6 md:p-7">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-xs font-semibold uppercase tracking-[0.13em] text-text-subtle"
      >
        Candidate Workspace
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="mt-2 text-2xl font-bold tracking-tight text-heading"
      >
        Welcome, {name}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-1.5 text-sm text-text-muted"
      >
        Find your next opportunity based on your proven interview performance.
      </motion.p>
    </CardContent>
  </Card>
);
