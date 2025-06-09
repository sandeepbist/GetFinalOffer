"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileText, Pencil } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ResumeUploadCard } from "./ResumeUploadCard";

export interface ProfileCardProps {
  name: string;
  title: string;
  email: string;
  location: string;
  experience: number;
  profileImage?: string;
  completion: number;
  skills: string[];
  resumeUrl?: string;
  onUpload?: (file: File) => Promise<void>;
  onEdit?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  email,
  location,
  experience,
  profileImage = "/avatar.jpg",
  completion,
  skills,
  resumeUrl,
  onUpload,
  onEdit,
}) => (
  <Card className="relative rounded-xl shadow-lg text-center">
    {onEdit && (
      <Button
        className="absolute top-4 right-4 text-sm "
        size="sm"
        variant="outline"
        onClick={onEdit}
      >
        <Pencil size={16} />
        Edit
      </Button>
    )}

    <CardContent className="space-y-4">
      <div className="flex justify-center">
        <Image
          src={profileImage}
          alt={name}
          width={64}
          height={64}
          className="rounded-full bg-gray-100"
        />
      </div>
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{title}</p>

      <div className="w-full">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>Profile Completion</span>
          <span>{completion}%</span>
        </div>
        <Progress value={completion} className="mt-1 h-2 rounded" />
      </div>

      <div className="border-t pt-4 text-left">
        <div className="flex justify-between text-sm text-gray-700">
          <span className="font-medium">Email</span>
          <span>{email}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <span className="font-medium">Location</span>
          <span>{location}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700 mt-2">
          <span className="font-medium">Experience</span>
          <span>{experience} years</span>
        </div>
      </div>

      <div className="pt-4 text-left">
        <p className="text-sm font-medium text-gray-700">Top Skills</p>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-1">No skills added.</p>
        )}
      </div>

      {onUpload && (
        <div className="flex justify-center mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                Upload Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md">
              <ResumeUploadCard resumeUrl={resumeUrl} onUploaded={onUpload} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </CardContent>
  </Card>
);
