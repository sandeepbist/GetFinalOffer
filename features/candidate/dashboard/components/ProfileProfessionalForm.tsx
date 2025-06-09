"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="professionalTitle">Professional Title</Label>
          <Input
            id="professionalTitle"
            name="professionalTitle"
            value={values.professionalTitle}
            onChange={onChangeField}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="currentRole">Current Role</Label>
          <Input
            id="currentRole"
            name="currentRole"
            value={values.currentRole}
            onChange={onChangeField}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="yearsExperience">Years of Experience</Label>
          <Input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            value={values.yearsExperience}
            onChange={onChangeField}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={values.location}
            onChange={onChangeField}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="about">About (Bio)</Label>
        <textarea
          id="about"
          name="about"
          rows={3}
          className="w-full rounded border p-2 text-sm"
          value={values.about}
          onChange={onChangeField}
        />
      </div>

      <SkillMultiSelect
        availableSkills={availableSkills}
        selectedSkillIds={selectedSkillIds}
        onChangeSkillIds={onChangeSkillIds}
      />

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};
