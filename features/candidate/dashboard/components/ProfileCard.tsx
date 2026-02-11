"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { FileText, Pencil, Lock, CheckCircle2 } from "lucide-react";
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

const ease = [0.22, 1, 0.36, 1] as const;

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
    <Card className="relative overflow-hidden border-border/80 bg-surface">
      {onEdit && (
        <Button
          className="absolute right-4 top-4 h-8 text-xs text-text-muted hover:text-heading"
          size="sm"
          variant="ghost"
          onClick={onEdit}
        >
          <Pencil size={14} className="mr-1.5" />
          Edit
        </Button>
      )}

      <CardContent className="space-y-6 pb-8 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="flex justify-center"
        >
          <div className="relative">
            <Image
              src={profileImage}
              alt={name}
              width={88}
              height={88}
              className="rounded-full bg-muted object-cover ring-4 ring-surface shadow-sm"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease }}
          className="space-y-1 text-center"
        >
          <h3 className="text-xl font-bold tracking-tight text-heading">{name}</h3>
          <p className="text-sm font-medium text-text-muted">{title || "Add your role title"}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14, ease }}
          className="w-full px-6"
        >
          <div className="mb-2 flex justify-between text-[11px] font-bold uppercase tracking-wider text-text-muted">
            <span>Profile Strength</span>
            <span>{completion}%</span>
          </div>
          <Progress value={completion} className="h-1.5 rounded-full bg-muted" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease }}
          className="space-y-4 border-t border-border/75 px-4 pt-6 text-left"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Email</span>
            <span className="max-w-[180px] truncate font-medium text-heading" title={email}>
              {email}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Location</span>
            <span className="font-medium text-heading">{location || "-"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Experience</span>
            <span className="font-medium text-heading">{experience > 0 ? `${experience} years` : "-"}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26, ease }}
          className="px-4 pt-2 text-left"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">Top Skills</p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-border/80 bg-highlight px-2.5 py-1 text-xs font-medium text-text"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="px-1 py-1 text-xs text-text-subtle">+{skills.length - 6}</span>
              )}
            </div>
          ) : (
            <p className="text-sm italic text-text-subtle">No skills added yet.</p>
          )}
        </motion.div>

        {onUpload && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32, ease }}
            className="mt-6 flex flex-col gap-3 border-t border-border/75 px-4 pt-6"
          >
            {fileName && (
              <div className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/10 p-3">
                <div className="rounded-md bg-surface p-1.5 text-primary shadow-sm">
                  <FileText size={14} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-semibold text-heading">{fileName}</p>
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
                      className="w-full cursor-not-allowed gap-2 bg-highlight opacity-50"
                    >
                      <Lock size={14} />
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
                  <Button variant={fileName ? "outline" : "default"} size="sm" className="w-full gap-2">
                    {fileName ? <Pencil size={14} /> : <FileText size={14} />}
                    {fileName ? "Update Resume" : "Upload Resume"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md">
                  <ResumeUploadCard resumeUrl={resumeUrl} onUploaded={onUpload} />
                </DialogContent>
              </Dialog>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
