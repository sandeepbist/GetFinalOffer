"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

interface JobRecommendationsProps {
  jobs: JobRecommendation[];
}

export const JobRecommendations: React.FC<JobRecommendationsProps> = ({
  jobs,
}) => (
  <Card className="rounded-xl shadow-lg">
    <CardHeader className="flex items-center justify-between">
      <h3 className="text-lg font-semibold leading-snug">Recommended Jobs</h3>
      <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
        View All
      </Link>
    </CardHeader>
    <CardContent className="space-y-3">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition"
        >
          <div>
            <h4 className="font-medium text-sm leading-snug">{job.title}</h4>
            <p className="text-xs text-gray-500">
              {job.company} • {job.location}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {job.type}
          </Badge>
        </Link>
      ))}
      <Link href="/jobs" className="block">
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition">
          <ChevronRight className="h-4 w-4 rotate-180" /> Find Jobs
        </button>
      </Link>
    </CardContent>
  </Card>
);
