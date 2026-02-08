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
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
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
            className="bg-amber-500/10 text-amber-600 border-amber-500/20 border opacity-100 cursor-default"
          >
            <Clock className="mr-2 h-4 w-4" /> Pending Review
          </Button>
        );
      case "verified":
        return (
          <Button
            variant="secondary"
            disabled
            className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 border opacity-100 cursor-default"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Verified
          </Button>
        );
      case "rejected":
        return (
          <Button
            variant="destructive"
            size="sm"
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 border"
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
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium">
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
              className="text-primary hover:text-primary/80 hover:bg-primary/5 h-8 text-xs font-medium"
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
          ? "bg-emerald-500/5 border border-emerald-500/20"
          : "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground",
      )}
    >
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-3 rounded-xl",
              status === "verified" ? "bg-emerald-500/10" : "bg-white/10",
            )}
          >
            <ShieldCheck
              className={cn(
                "h-8 w-8",
                status === "verified" ? "text-emerald-600" : "text-primary-foreground/80",
              )}
            />
          </div>
          <div className="space-y-1">
            <h4
              className={cn(
                "text-lg font-bold",
                status === "verified" ? "text-emerald-700" : "text-primary-foreground",
              )}
            >
              {status === "verified" ? "Your profile is verified" : title}
            </h4>
            <p
              className={cn(
                "text-sm max-w-lg leading-relaxed",
                status === "verified" ? "text-emerald-600" : "text-primary-foreground/80",
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
            <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg shadow-sm border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-700">
                Verified
              </span>
            </div>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                {status === "unverified" ? (
                  <Button className="bg-surface text-heading hover:bg-surface/90 border-none font-semibold shadow-xl">
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
        <DialogTitle className="flex items-center gap-2 text-heading">
          <ShieldCheck className="w-5 h-5 text-primary" />
          {title}
        </DialogTitle>
        <p className="text-sm text-text-muted">
          Upload documents to prove your claim. We accept offer letters,
          official emails, or badges.
        </p>
      </DialogHeader>
      <div className="grid gap-5 py-4">
        <div className="grid gap-2">
          <Label
            htmlFor="subject"
            className="text-xs font-semibold uppercase text-text-muted"
          >
            Item to Verify
          </Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Google L4 Role"
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="files"
            className="text-xs font-semibold uppercase text-text-muted"
          >
            Proof Documents
          </Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-highlight hover:bg-muted transition-colors cursor-pointer relative">
            <input
              id="files"
              type="file"
              multiple
              onChange={onFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-text-muted mb-2" />
            <p className="text-sm font-medium text-text">
              {files.length > 0
                ? `${files.length} files selected`
                : "Click to upload files"}
            </p>
            <p className="text-xs text-text-subtle mt-1">
              PDF, PNG, JPG (Max 5MB)
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="notes"
            className="text-xs font-semibold uppercase text-text-muted"
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
            className="text-xs font-semibold uppercase text-text-muted"
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
      <DialogFooter className="bg-highlight -mx-6 -mb-6 p-4 border-t border-border">
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button
          onClick={onSubmit}
          disabled={loading || !subject.trim() || files.length === 0}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? "Submitting..." : "Submit Verification"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
