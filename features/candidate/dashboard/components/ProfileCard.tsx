"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

export interface ProfileCardProps {
  name: string;
  title: string;
  location: string;
  profileImage: string;
  completion: number;
  skills: string[];
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  location,
  profileImage,
  completion,
  skills,
}) => (
  <Card className="rounded-xl shadow-lg">
    <CardHeader className="flex items-center gap-4">
      <Image
        src={profileImage}
        alt={name}
        width={48}
        height={48}
        className="rounded-full"
      />
      <div>
        <h3 className="text-lg font-semibold leading-snug">{name}</h3>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </CardHeader>
    <CardContent className="pt-4 space-y-4">
      <div className="text-sm font-medium text-gray-700 flex justify-between">
        <span>Profile Completion</span>
        <span>{completion}%</span>
      </div>
      <Progress value={completion} />
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1"
          >
            {skill}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);
