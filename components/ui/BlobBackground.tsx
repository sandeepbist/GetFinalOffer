"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlobProps {
    className?: string;
    color?: "blue" | "slate" | "green";
    size?: "sm" | "md" | "lg" | "xl";
    blur?: "sm" | "md" | "lg";
    animate?: boolean;
}

const colorMap = {
    blue: "from-blue-400/20 to-blue-600/10",
    slate: "from-slate-300/30 to-slate-400/10",
    green: "from-green-400/20 to-green-600/10",
};

const sizeMap = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
};

const blurMap = {
    sm: "blur-2xl",
    md: "blur-3xl",
    lg: "blur-[100px]",
};

export function Blob({
    className = "",
    color = "blue",
    size = "md",
    blur = "lg",
    animate = true,
}: BlobProps) {
    return (
        <motion.div
            className={cn(
                "absolute rounded-full bg-gradient-to-br pointer-events-none",
                colorMap[color],
                sizeMap[size],
                blurMap[blur],
                className
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
                animate
                    ? {
                        scale: [0.8, 1.1, 0.9, 1],
                        opacity: [0, 0.6, 0.4, 0.5],
                        x: [0, 30, -20, 10],
                        y: [0, -20, 30, -10],
                    }
                    : { scale: 1, opacity: 0.5 }
            }
            transition={
                animate
                    ? {
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }
                    : { duration: 1 }
            }
        />
    );
}

export function BlobBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Blob
                color="blue"
                size="xl"
                blur="lg"
                className="-top-64 -right-64"
            />
            <Blob
                color="slate"
                size="lg"
                blur="lg"
                className="top-1/3 -left-48"
            />
            <Blob
                color="green"
                size="md"
                blur="md"
                className="bottom-32 right-1/4"
            />
            <Blob
                color="blue"
                size="lg"
                blur="lg"
                className="-bottom-32 left-1/3"
            />
        </div>
    );
}

export function GridBackground({ className = "" }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 pointer-events-none", className)}>
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 0%, var(--section) 70%)",
                }}
            />
        </div>
    );
}

export function DotPattern({ className = "" }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 pointer-events-none opacity-40", className)}>
            <svg className="w-full h-full">
                <pattern
                    id="dot-pattern"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="2" cy="2" r="1" fill="currentColor" className="text-slate-300" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dot-pattern)" />
            </svg>
        </div>
    );
}
