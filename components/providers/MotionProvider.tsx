"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MotionProviderProps {
    children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
    const reducedMotion = useReducedMotion();

    return (
        <LazyMotion features={domAnimation}>
            <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
                {children}
            </MotionConfig>
        </LazyMotion>
    );
}
