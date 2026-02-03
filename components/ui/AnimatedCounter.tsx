"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useSpring, useMotionValue, motion } from "framer-motion";

interface AnimatedCounterProps {
    target: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
    decimals?: number;
}

export function AnimatedCounter({
    target,
    suffix = "",
    prefix = "",
    duration = 2,
    className = "",
    decimals = 0,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        duration: duration * 1000,
        bounce: 0,
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(target);
        }
    }, [isInView, target, motionValue]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            setDisplayValue(Number(latest.toFixed(decimals)));
        });
        return () => unsubscribe();
    }, [springValue, decimals]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        }
        if (num >= 1000) {
            return num.toLocaleString();
        }
        return num.toString();
    };

    return (
        <motion.span ref={ref} className={className}>
            {prefix}
            {formatNumber(displayValue)}
            {suffix}
        </motion.span>
    );
}
