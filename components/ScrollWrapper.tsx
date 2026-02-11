"use client";

import { useEffect, useRef, ReactNode } from "react";
import LocomotiveScroll from "locomotive-scroll";

interface ScrollWrapperProps {
  children: ReactNode;
}

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isCoarsePointer) return;

    scrollRef.current = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1,
        syncTouch: false,
        orientation: "vertical",
        gestureOrientation: "vertical",
        infinite: false,
      },
    });

    return () => {
      scrollRef.current?.destroy();
      scrollRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} data-scroll-container>
      {children}
    </div>
  );
}
