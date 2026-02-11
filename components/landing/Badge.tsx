"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
}

export function Badge({ children, text, className }: BadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-highlight border border-border",
        "text-sm font-semibold text-text",
        className
      )}
    >
      <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
      {text || children}
    </motion.div>
  );
}
