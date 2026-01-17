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
  CheckCircle2,
  Clock,
  RefreshCcw,
  XCircle,
  ShieldCheck,
  UploadCloud,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    title: "Get Profile Verified",
    description:
      "Upload proof of identity or employment to earn the Verified badge. Recruiters prioritize verified profiles.",
  },
  interview: {
    title: "Verify This Result",
    description:
      "Upload offer letters or feedback screenshots to prove this history.",
  },
  recruiter: {
    title: "Verify Organisation",
    description: "Proof of employment required.",
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


  const renderStatusButton = () => {
    switch (status) {
      case "unverified":
        return (
          <Button
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
            size="sm"
          >
            Request Verification <ArrowRight className="ml-2 w-3 h-3" />
          </Button>
        );
      case "pending":
        return (
          <Button
            variant="secondary"
            disabled
            className="bg-amber-100 text-amber-800 opacity-100 cursor-default"
          >
            <Clock className="mr-2 h-4 w-4" /> Pending Review
          </Button>
        );
      case "verified":
        return (
          <Button
            variant="secondary"
            disabled
            className="bg-emerald-100 text-emerald-800 opacity-100 cursor-default"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Verified
          </Button>
        );
      case "rejected":
        return (
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        );
      case "blocked":
        return (
          <Button disabled variant="destructive" size="sm">
            <XCircle className="mr-2 h-4 w-4" /> Blocked
          </Button>
        );
      default:
        return null;
    }
  };

  if (context === "interview") {
    if (status === "verified") {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
        </div>
      );
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {status === "unverified" || status === "rejected" ? (
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 text-xs font-medium"
            >
              Verify
            </Button>
          ) : (
            renderStatusButton()
          )}
        </DialogTrigger>
        <VerificationDialogContent
          title={title}
          subject={subject}
          setSubject={setSubject}
          notes={notes}
          setNotes={setNotes}
          links={links}
          setLinks={setLinks}
          files={files}
          onFileChange={handleFileChange}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Dialog>
    );
  }

  return (
    <Card
      className={cn(
        "rounded-xl border-none shadow-md overflow-hidden",
        status === "verified"
          ? "bg-emerald-50/50 border border-emerald-100"
          : "bg-gradient-to-r from-slate-900 to-slate-800 text-white",
      )}
    >
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-3 rounded-xl",
              status === "verified" ? "bg-emerald-100" : "bg-white/10",
            )}
          >
            <ShieldCheck
              className={cn(
                "h-8 w-8",
                status === "verified" ? "text-emerald-600" : "text-blue-200",
              )}
            />
          </div>
          <div className="space-y-1">
            <h4
              className={cn(
                "text-lg font-bold",
                status === "verified" ? "text-emerald-900" : "text-white",
              )}
            >
              {status === "verified" ? "Your profile is verified" : title}
            </h4>
            <p
              className={cn(
                "text-sm max-w-lg leading-relaxed",
                status === "verified" ? "text-emerald-700" : "text-slate-300",
              )}
            >
              {status === "verified"
                ? "Great job! You have full access to direct offers."
                : description}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          {status === "verified" ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-800">
                Verified
              </span>
            </div>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                {status === "unverified" ? (
                  <Button className="bg-white text-slate-900 hover:bg-blue-50 border-none font-semibold shadow-xl">
                    Verify Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  renderStatusButton()
                )}
              </DialogTrigger>
              <VerificationDialogContent
                title={title}
                subject={subject}
                setSubject={setSubject}
                notes={notes}
                setNotes={setNotes}
                links={links}
                setLinks={setLinks}
                files={files}
                onFileChange={handleFileChange}
                loading={loading}
                onSubmit={handleSubmit}
              />
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function VerificationDialogContent({
  title,
  subject,
  setSubject,
  notes,
  setNotes,
  links,
  setLinks,
  files,
  onFileChange,
  loading,
  onSubmit,
}: any) {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          {title}
        </DialogTitle>
        <p className="text-sm text-slate-500">
          Upload documents to prove your claim. We accept offer letters,
          official emails, or badges.
        </p>
      </DialogHeader>
      <div className="grid gap-5 py-4">
        <div className="grid gap-2">
          <Label
            htmlFor="subject"
            className="text-xs font-semibold uppercase text-slate-500"
          >
            Item to Verify
          </Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Google L4 Role"
            className="bg-slate-50"
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="files"
            className="text-xs font-semibold uppercase text-slate-500"
          >
            Proof Documents
          </Label>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
            <input
              id="files"
              type="file"
              multiple
              onChange={onFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700">
              {files.length > 0
                ? `${files.length} files selected`
                : "Click to upload files"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              PDF, PNG, JPG (Max 5MB)
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="notes"
            className="text-xs font-semibold uppercase text-slate-500"
          >
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any context you want to add..."
            className="resize-none"
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="links"
            className="text-xs font-semibold uppercase text-slate-500"
          >
            External Links (Optional)
          </Label>
          <Input
            id="links"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <DialogFooter className="bg-slate-50 -mx-6 -mb-6 p-4 border-t border-slate-100">
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button
          onClick={onSubmit}
          disabled={loading || !subject.trim() || files.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Verification"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
