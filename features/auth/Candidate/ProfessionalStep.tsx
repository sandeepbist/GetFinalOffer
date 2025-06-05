// src/features/auth/components/ProfessionalStep.tsx
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SkillMultiSelect } from "./components/SkillMultiSelect";
import { CompanyMultiSelect } from "./components/CompanyMultiSelect";
import {
  InterviewProgressItem,
  InterviewProgress,
} from "./components/InterviewProgressItem";

export interface CompanyDTO {
  id: number;
  name: string;
}

export interface SkillDTO {
  id: number;
  name: string;
}

interface ProfessionalStepProps {
  formData: {
    professionalTitle: string;
    currentRole: string;
    yearsOfExperience: string;
    location: string;
    about: string;
  };
  onChangeField: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  availableSkills: SkillDTO[];
  selectedSkillIds: number[];
  onChangeSkillIds: (ids: number[]) => void;

  // Now using partner organizations table for hidden organizations
  availablePartnerOrgs: CompanyDTO[];
  excludedPartnerOrgIds: number[];
  onChangeExcludedPartnerOrgs: (ids: number[]) => void;

  // For interview progress dropdown
  availableInterviewCompanies: CompanyDTO[];
  interviewProgress: InterviewProgress[];
  onAddInterviewEntry: () => void;
  onRemoveInterviewEntry: (index: number) => void;
  onUpdateInterviewEntry: (
    index: number,
    field: keyof InterviewProgress,
    value: string | number
  ) => void;
}

export const ProfessionalStep: React.FC<ProfessionalStepProps> = ({
  formData,
  onChangeField,
  availableSkills,
  selectedSkillIds,
  onChangeSkillIds,
  availablePartnerOrgs,
  excludedPartnerOrgIds,
  onChangeExcludedPartnerOrgs,
  availableInterviewCompanies,
  interviewProgress,
  onAddInterviewEntry,
  onRemoveInterviewEntry,
  onUpdateInterviewEntry,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="professionalTitle">Professional Title</Label>
          <Input
            id="professionalTitle"
            name="professionalTitle"
            placeholder="e.g. Frontend Developer"
            value={formData.professionalTitle}
            onChange={onChangeField}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="currentRole">Current Role</Label>
          <Input
            id="currentRole"
            name="currentRole"
            placeholder="e.g. Software Engineer"
            value={formData.currentRole}
            onChange={onChangeField}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            placeholder="e.g. 5"
            value={formData.yearsOfExperience}
            onChange={onChangeField}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="City, Country"
            value={formData.location}
            onChange={onChangeField}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="about">About (Bio)</Label>
        <textarea
          id="about"
          name="about"
          placeholder="Tell us about your background"
          value={formData.about}
          onChange={onChangeField}
          className="w-full rounded border p-2 text-sm"
          rows={4}
          required
        />
      </div>

      <SkillMultiSelect
        availableSkills={availableSkills}
        selectedSkillIds={selectedSkillIds}
        onChangeSkillIds={onChangeSkillIds}
      />

      <CompanyMultiSelect
        availableCompanies={availablePartnerOrgs}
        excludedCompanyIds={excludedPartnerOrgIds}
        onChangeExcludedCompanies={onChangeExcludedPartnerOrgs}
      />

      <div className="mt-6 space-y-4">
        <p className="mb-1 font-medium">Interview Progress</p>
        <p className="mb-4 text-sm text-gray-500">
          For each entry, select the company and your progress details.
        </p>

        {interviewProgress.map((entry, idx) => (
          <InterviewProgressItem
            key={idx}
            entry={entry}
            index={idx}
            availableInterviewCompanies={availableInterviewCompanies}
            onRemove={onRemoveInterviewEntry}
            onUpdate={onUpdateInterviewEntry}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onAddInterviewEntry}
        >
          <Plus className="h-4 w-4" /> Add Interview Progress Entry
        </Button>
      </div>
    </div>
  );
};
