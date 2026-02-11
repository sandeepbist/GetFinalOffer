"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SkillMultiSelect, SkillDTO } from "./SkillMultiSelect";

interface ProfessionalValues {
  professionalTitle: string;
  currentRole: string;
  yearsExperience: string;
  location: string;
  about: string;
}

interface ProfileProfessionalFormProps {
  values: ProfessionalValues;
  availableSkills: SkillDTO[];
  selectedSkillIds: string[];
  onChangeField: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onChangeSkillIds: (ids: string[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileProfessionalForm: React.FC<
  ProfileProfessionalFormProps
> = ({
  values,
  availableSkills,
  selectedSkillIds,
  onChangeField,
  onChangeSkillIds,
  onSave,
  onCancel,
}) => {
  return (
    <div className="space-y-6 p-1">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="professionalTitle" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Professional Title
          </Label>
          <Input
            id="professionalTitle"
            name="professionalTitle"
            value={values.professionalTitle}
            onChange={onChangeField}
            placeholder="Senior Software Engineer"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currentRole" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Current Role
          </Label>
          <Input
            id="currentRole"
            name="currentRole"
            value={values.currentRole}
            onChange={onChangeField}
            placeholder="Frontend Engineer"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="yearsExperience" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Years of Experience
          </Label>
          <Input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            value={values.yearsExperience}
            onChange={onChangeField}
            placeholder="4"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={values.location}
            onChange={onChangeField}
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="about" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          About
        </Label>
        <Textarea
          id="about"
          name="about"
          rows={3}
          value={values.about}
          onChange={onChangeField}
          placeholder="Highlight your strengths, product impact, and interview history."
        />
      </div>

      <SkillMultiSelect
        availableSkills={availableSkills}
        selectedSkillIds={selectedSkillIds}
        onChangeSkillIds={onChangeSkillIds}
      />

      <div className="flex justify-end space-x-2 border-t border-border/75 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};
