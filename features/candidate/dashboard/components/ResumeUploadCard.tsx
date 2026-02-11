"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Upload, Check, FileText } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface ResumeUploadCardProps {
  resumeUrl?: string;
  onUploaded: (file: File) => Promise<void>;
}

export const ResumeUploadCard: React.FC<ResumeUploadCardProps> = ({
  resumeUrl,
  onUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const getFileName = (url: string) => {
    try {
      const basename = url.split("/").pop() || "";
      const decoded = decodeURIComponent(basename);
      const newFormatMatch = decoded.match(/^.+?-\d+-(.+)$/);
      if (newFormatMatch) return newFormatMatch[1];

      const oldFormatMatch = decoded.match(/^\d+-(.+)$/);
      if (oldFormatMatch) return oldFormatMatch[1];

      return decoded;
    } catch {
      return "Current Resume";
    }
  };

  const currentFileName = resumeUrl ? getFileName(resumeUrl) : null;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    setFile(f);
    setUploading(true);
    try {
      await onUploaded(f);
      toast.success("Resume uploaded successfully");
    } catch {
      toast.error("Upload failed");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardHeader className="px-0 pt-0">
        <h3 className="text-lg font-semibold text-heading">Resume</h3>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-highlight p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/5">
          <input
            type="file"
            accept=".pdf"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="mb-3 rounded-full bg-surface p-3 shadow-sm ring-1 ring-border transition-transform group-hover:scale-105">
            <Upload className="h-6 w-6 text-text-muted group-hover:text-primary" />
          </div>
          <p className="text-sm font-medium text-text">
            {resumeUrl ? "Replace resume" : "Upload your resume"}
          </p>
          <p className="text-xs text-text-muted mt-1">PDF (max 20MB)</p>
        </div>

        {uploading && (
          <div className="flex justify-center text-sm text-text-muted">
            <LoadingIndicator label="Processing and analyzing resume..." />
          </div>
        )}

        {(file || currentFileName) && !uploading && (
          <div className="rounded-lg border border-border bg-surface p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium text-heading truncate"
                  title={file ? file.name : currentFileName || ""}
                >
                  {file ? file.name : currentFileName}
                </p>
                <p className="text-xs text-text-muted">
                  {file ? "Ready to submit" : "Active Resume"}
                </p>
              </div>
            </div>
            {resumeUrl && !file && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-primary hover:text-primary/80 hover:underline px-2"
              >
                View
              </a>
            )}
            {file && <Check className="h-4 w-4 text-emerald-500" />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
