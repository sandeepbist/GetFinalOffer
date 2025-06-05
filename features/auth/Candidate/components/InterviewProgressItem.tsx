"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { SingleCompanySelect, CompanyDTO } from "./SingleCompanySelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export interface InterviewProgress {
  companyId: number | "";
  position: string;
  roundsCleared: string;
  totalRounds: string;
  status: string;
  dateCleared: string;
}

interface InterviewProgressItemProps {
  entry: InterviewProgress;
  index: number;
  availableInterviewCompanies: CompanyDTO[];
  onRemove: (idx: number) => void;
  onUpdate: (
    idx: number,
    field: keyof InterviewProgress,
    value: string | number
  ) => void;
}

export const InterviewProgressItem: React.FC<InterviewProgressItemProps> = ({
  entry,
  index,
  availableInterviewCompanies,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="relative mb-4 rounded-lg border p-4">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        aria-label="Remove"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="space-y-4">
        {/* Company dropdown instead of numeric ID input */}
        <div className="space-y-1">
          <Label htmlFor={`company-${index}`}>Company</Label>
          <SingleCompanySelect
            availableCompanies={availableInterviewCompanies}
            selectedCompanyId={entry.companyId}
            onChangeCompanyId={(id) => onUpdate(index, "companyId", id)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`position-${index}`}>Position</Label>
          <Input
            id={`position-${index}`}
            name={`position-${index}`}
            placeholder="e.g. Software Engineer"
            value={entry.position}
            onChange={(e) => onUpdate(index, "position", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor={`roundsCleared-${index}`}>Rounds Cleared</Label>
            <Input
              id={`roundsCleared-${index}`}
              name={`roundsCleared-${index}`}
              type="number"
              placeholder="e.g. 2"
              value={entry.roundsCleared}
              onChange={(e) => onUpdate(index, "roundsCleared", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`totalRounds-${index}`}>Total Rounds</Label>
            <Input
              id={`totalRounds-${index}`}
              name={`totalRounds-${index}`}
              type="number"
              placeholder="e.g. 5"
              value={entry.totalRounds}
              onChange={(e) => onUpdate(index, "totalRounds", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`dateCleared-${index}`}>Month Cleared</Label>
            <Input
              id={`dateCleared-${index}`}
              name={`dateCleared-${index}`}
              type="month"
              value={entry.dateCleared}
              onChange={(e) => onUpdate(index, "dateCleared", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={`status-${index}`}>Status</Label>
            <Select
              name={`status-${index}`}
              value={entry.status}
              onValueChange={(e) => onUpdate(index, "status", e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Offer Received">Offer Received</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
