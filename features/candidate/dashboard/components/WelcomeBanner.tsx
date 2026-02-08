"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeBannerProps {
  name: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name }) => (
  <Card className="rounded-xl shadow-lg border-border">
    <CardContent className="p-6">
      <h2 className="text-xl font-bold text-heading">Welcome, {name}!</h2>
      <p className="mt-1 text-sm text-text-muted">
        Find your next opportunity based on your proven interview performance.
      </p>
    </CardContent>
  </Card>
);
