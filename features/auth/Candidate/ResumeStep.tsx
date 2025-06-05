"use client";

import React from "react";
import { Upload, Check } from "lucide-react";

interface ResumeStepProps {
  resume: File | null;
  onFileChange: (file: File | null) => void;
}

export const ResumeStep: React.FC<ResumeStepProps> = ({
  resume,
  onFileChange,
}) => (
  <div className="space-y-4">
    <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition">
      <input
        id="resume"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        required
      />
      <Upload className="mb-2 h-10 w-10 text-gray-500" />
      <p className="text-sm font-medium text-gray-700">Upload your resume</p>
      <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 2 MB)</p>
    </div>

    {resume && (
      <p className="flex items-center text-sm text-green-600">
        <Check className="mr-1 h-4 w-4" />
        {resume.name} selected
      </p>
    )}
  </div>
);
