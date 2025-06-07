"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Clock,
  RefreshCcw,
  XCircle,
  MailCheck,
} from "lucide-react";

export type VerificationContext = "profile" | "interview" | "recruiter";
export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected"
  | "blocked";

const contextMap: Record<
  VerificationContext,
  { title: string; description: string }
> = {
  profile: {
    title: "Verify Your Profile",
    description:
      "Get your profile verified to gain credibility with recruiters.",
  },
  interview: {
    title: "Verify Your Interview Progress",
    description:
      "Get your interview progress verified to gain credibility with recruiters.",
  },
  recruiter: {
    title: "Verify Your Organization",
    description:
      "Get your organization verified to gain credibility with candidates.",
  },
};

export interface VerifyCalloutProps {
  context: VerificationContext;
  status: VerificationStatus;
  onSubmit: (data: {
    subject: string;
    notes: string;
    links: string;
    files: File[];
  }) => Promise<void>;
}

export const VerifyCallout: React.FC<VerifyCalloutProps> = ({
  context,
  status,
  onSubmit,
}) => {
  const { title, description } = contextMap[context];

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  let label = "Verify";
  let Icon = CheckCircle;
  let btnClass = "bg-gray-200 text-gray-800 hover:bg-gray-200";
  let disabled = false;

  switch (status) {
    case "unverified":
      label = "Verify";
      Icon = CheckCircle;
      btnClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";
      break;
    case "pending":
      label = "Pending";
      Icon = Clock;
      btnClass = "bg-yellow-200 text-yellow-800";
      disabled = true;
      break;
    case "verified":
      label = "Verified";
      Icon = CheckCircle;
      btnClass = "bg-green-200 text-green-800";
      disabled = true;
      break;
    case "rejected":
      label = "Re-request";
      Icon = RefreshCcw;
      btnClass = "bg-red-100 text-red-800 hover:bg-red-200";
      break;
    case "blocked":
      label = "Blocked";
      Icon = XCircle;
      btnClass = "bg-red-300 text-red-600";
      disabled = true;
      break;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!subject.trim() || files.length === 0) return;
    setLoading(true);
    await onSubmit({ subject, notes, links, files });
    setLoading(false);
    setOpen(false);
  };

  if (context === "interview") {
    return (
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className={`flex items-center gap-1 ${btnClass}`}
              disabled={disabled}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional comments"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="links">Links</Label>
                <Input
                  id="links"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="Links (screenshots, posts...)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="files">Upload Files</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={loading || !subject.trim() || files.length === 0}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg bg-blue-50">
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-start gap-3">
          <MailCheck className="h-6 w-6 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-gray-800">{title}</h4>
            <p className="mt-1 text-xs text-gray-600">{description}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className={`flex items-center gap-1 ${btnClass}`}
              disabled={disabled}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional comments"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="links">Links</Label>
                <Input
                  id="links"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="Links (screenshots, posts...)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="files">Upload Files</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={loading || !subject.trim() || files.length === 0}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
