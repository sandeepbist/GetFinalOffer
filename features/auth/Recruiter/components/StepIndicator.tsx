"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  step: number;
  labels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  labels,
}) => {
  const totalSteps = labels.length;
  const clampedStep = Math.min(Math.max(step, 1), totalSteps);
  const percent = Math.round((clampedStep / totalSteps) * 100);

  return (
    <div className="mb-6">
      <Progress value={percent} className="h-1 rounded-full mb-2" />

      <div className="flex justify-between">
        {labels.map((label, index) => {
          const isActive = index + 1 === clampedStep;
          return (
            <span
              key={label}
              className={`text-sm ${
                isActive ? "font-semibold text-blue-600" : "text-gray-500"
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};
