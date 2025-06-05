"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
export interface InterviewProgressItem {
  company: string;
  cleared: number;
  total: number;
}

interface InterviewProgressListProps {
  data: InterviewProgressItem[];
}

export const InterviewProgressList: React.FC<InterviewProgressListProps> = ({
  data,
}) => (
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold leading-snug">Interview Progress</h3>
    </CardHeader>
    <CardContent className="space-y-4">
      {data.map((item) => {
        const percent =
          item.total > 0 ? Math.round((item.cleared / item.total) * 100) : 0;
        return (
          <div key={item.company} className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span>{item.company}</span>
              <span>{percent}%</span>
            </div>
            <Progress value={percent} />
          </div>
        );
      })}
    </CardContent>
  </Card>
);
