"use client";

import React from "react";
import { WelcomeBanner } from "@/features/candidate/dashboard/components/WelcomeBanner";
import { ProfileCard } from "@/features/candidate/dashboard/components/ProfileCard";

import { VerifyCallout } from "@/features/candidate/dashboard/components/VerifyCallout";
import type { TUserAuth } from "@/lib/auth/auth-types";
interface CandidateDashboardProps {
  user: TUserAuth;
}
export default function CandidateDashboard({ user }: CandidateDashboardProps) {
  const mock = {
    name: "Alex",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    profileImage: "/avatar.jpg",
    completion: 75,
    skills: ["React", "TypeScript", "Node.js"],
  };

  return (
    <main className="space-y-6 p-6">
      <WelcomeBanner name={user.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileCard {...mock} />
        <div className="lg:col-span-2"></div>
      </div>

      <VerifyCallout />
    </main>
  );
}
