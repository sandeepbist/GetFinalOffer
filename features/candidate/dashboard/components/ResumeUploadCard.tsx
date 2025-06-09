"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Upload, Check } from "lucide-react";
import { toast } from "sonner";

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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    setFile(f);
    setUploading(true);
    try {
      await onUploaded(f);
      toast.success("Resume uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0">
      <CardHeader>
        <h3 className="text-lg font-semibold">Resume</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mb-2 h-10 w-10 text-gray-500" />
          <p className="text-sm font-medium text-gray-700">
            {resumeUrl ? "Replace resume" : "Upload your resume"}
          </p>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 2 MB)</p>
        </div>
        {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
        {file && !uploading && (
          <p className="flex items-center text-sm text-green-600">
            <Check className="mr-1 h-4 w-4" />
            {file.name}
          </p>
        )}
        {!file && resumeUrl && (
          <a
            href={resumeUrl}c
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-sm"
          >
            View current resume
          </a>
        )}
      </CardContent>
    </Card>
  );
};
