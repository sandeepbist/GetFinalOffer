"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number;
    onClick?: () => void;
}

export function MagneticButton({
    children,
    className = "",
    strength = 0.3,
    onClick,
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 20 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const scale = useSpring(1, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * strength;
        const distanceY = (e.clientY - centerY) * strength;

        x.set(distanceX);
        y.set(distanceY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        scale.set(1.05);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
        scale.set(1);
    };

    return (
        <motion.button
            ref={ref}
            style={{ x: xSpring, y: ySpring, scale }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={cn(
                "relative overflow-hidden transition-shadow duration-300 cursor-pointer",
                isHovered && "shadow-2xl",
                className
            )}
        >
            <span className="relative z-10">{children}</span>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "100%" : "-100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />
        </motion.button>
    );
}

interface GradientButtonProps {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
}

export function GradientButton({
    children,
    className = "",
    variant = "primary",
    size = "md",
    onClick,
}: GradientButtonProps) {
    const sizeClasses = {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-7 text-base",
        lg: "h-14 px-10 text-lg",
    };

    const variantClasses = {
        primary: cn(
            "bg-primary text-primary-foreground",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-primary/80",
            "before:opacity-0 before:transition-opacity before:duration-300",
            "hover:before:opacity-100"
        ),
        secondary: cn(
            "bg-surface text-heading border border-border",
            "hover:border-primary/50 hover:bg-highlight"
        ),
    };

    return (
        <MagneticButton
            onClick={onClick}
            className={cn(
                "relative rounded-xl font-semibold",
                "flex items-center justify-center gap-2",
                "transition-all duration-300",
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
        >
            {children}
        </MagneticButton>
    );
}
