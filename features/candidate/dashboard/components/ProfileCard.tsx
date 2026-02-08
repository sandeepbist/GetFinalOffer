"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileText, Pencil, Lock, CheckCircle2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ResumeUploadCard } from "./ResumeUploadCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  isLocked?: boolean;
  onUpload?: (file: File) => Promise<void>;
  onEdit?: () => void;
}

const getFileName = (url: string) => {
  try {
    const basename = url.split("/").pop() || "";
    if (basename.match(/[0-9a-f]{8}-[0-9a-f]{4}/i)) {
      return "Resume.pdf";
    }
    const parts = basename.split("-");
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return decodeURIComponent(parts.slice(1).join("-"));
    }

    return decodeURIComponent(basename);
  } catch {
    return "Resume.pdf";
  }
};

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
  isLocked = false,
  onUpload,
  onEdit,
}) => {
  const fileName = resumeUrl ? getFileName(resumeUrl) : null;

  return (
    <Card className="relative rounded-xl shadow-sm border border-border text-center overflow-hidden bg-surface">
      {onEdit && (
        <Button
          className="absolute top-4 right-4 text-xs h-8 text-text-muted hover:text-heading"
          size="sm"
          variant="ghost"
          onClick={onEdit}
        >
          <Pencil size={14} className="mr-1.5" />
          Edit
        </Button>
      )}

      <CardContent className="space-y-6 pt-10 pb-8">
        <div className="flex justify-center">
          <div className="relative">
            <Image
              src={profileImage}
              alt={name}
              width={88}
              height={88}
              className="rounded-full bg-muted ring-4 ring-surface shadow-sm object-cover"
            />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-heading tracking-tight">
            {name}
          </h3>
          <p className="text-sm text-text-muted font-medium">
            {title || "Add your role title"}
          </p>
        </div>

        <div className="w-full px-6">
          <div className="flex justify-between text-[11px] font-bold text-text-muted mb-2 uppercase tracking-wider">
            <span>Profile Strength</span>
            <span>{completion}%</span>
          </div>
          <Progress
            value={completion}
            className="h-1.5 rounded-full bg-muted"
          />
        </div>

        <div className="border-t border-border pt-6 text-left space-y-4 px-4">
          <div className="flex justify-between text-sm items-center">
            <span className="text-text-muted">Email</span>
            <span
              className="text-heading font-medium truncate max-w-[180px]"
              title={email}
            >
              {email}
            </span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-text-muted">Location</span>
            <span className="text-heading font-medium">
              {location || "—"}
            </span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-text-muted">Experience</span>
            <span className="text-heading font-medium">
              {experience > 0 ? `${experience} Years` : "—"}
            </span>
          </div>
        </div>

        <div className="pt-2 text-left px-4">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">
            Top Skills
          </p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-highlight text-text rounded-md px-2.5 py-1 font-medium border border-border"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="text-xs text-text-subtle px-1 py-1">
                  +{skills.length - 6}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-subtle italic">
              No skills added yet.
            </p>
          )}
        </div>

        {onUpload && (
          <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border px-4">
            {fileName && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="p-1.5 bg-surface rounded-md text-primary shadow-sm">
                  <FileText size={14} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-heading truncate">
                    {fileName}
                  </p>
                  <p className="text-[10px] text-text-muted">Uploaded</p>
                </div>
                <CheckCircle2 size={14} className="text-primary" />
              </div>
            )}

            {isLocked ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full opacity-50 cursor-not-allowed gap-2 bg-highlight"
                    >
                      <Lock size={14} />{" "}
                      {fileName ? "Replace Resume" : "Upload Resume"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Complete your profile info to unlock</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={fileName ? "outline" : "default"}
                    size="sm"
                    className={`w-full gap-2 ${!fileName
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : ""
                      }`}
                  >
                    {fileName ? <Pencil size={14} /> : <FileText size={14} />}
                    {fileName ? "Update Resume" : "Upload Resume"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md">
                  <ResumeUploadCard
                    resumeUrl={resumeUrl}
                    onUploaded={onUpload}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
