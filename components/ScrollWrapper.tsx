"use client";

import { ReactNode } from "react";

interface ScrollWrapperProps {
  children: ReactNode;
}

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
  return (
    <div className="w-full scroll-smooth">
      {children}
    </div>
  );
}
