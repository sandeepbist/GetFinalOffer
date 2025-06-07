"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import {
  InterviewProgressItem as EditorItem,
  InterviewProgress,
} from "./InterviewProgressItem";
import { VerifyCallout } from "./VerifyCallout";
import { requestCandidateVerification } from "@/features/candidate/candidate-use-cases";

interface InterviewProgressManagerProps {
  interviewProgress: InterviewProgress[];
  availableCompanies: { id: string; name: string }[];
  onSave: (entries: InterviewProgress[]) => Promise<void>;
}
const uuid = () => crypto.randomUUID();

export const InterviewProgressManager: React.FC<
  InterviewProgressManagerProps
> = ({ interviewProgress, availableCompanies, onSave }) => {
  const [open, setOpen] = useState(false);
  const [edited, setEdited] = useState<InterviewProgress[]>([]);

  const openEditor = () => {
    setEdited(interviewProgress);
    setOpen(true);
  };

  const save = async () => {
    await onSave(edited);
    setOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Interview Progress</h3>
          <Button size="sm" variant="outline" onClick={openEditor}>
            {interviewProgress.length ? (
              <Pencil size={16} />
            ) : (
              <Plus size={16} />
            )}
            {interviewProgress.length ? "Edit" : "Add"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {interviewProgress.length === 0 ? (
            <p className="text-sm text-gray-500">No progress yet.</p>
          ) : (
            interviewProgress.map((e) => {
              const company =
                availableCompanies.find((c) => c.id === e.companyId)?.name ||
                "Unknown";
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium">{company}</p>
                    <p className="text-sm">
                      {e.roundsCleared}/{e.totalRounds} rounds
                    </p>
                    <p className="text-sm">
                      {new Date(e.dateCleared).toLocaleDateString()}
                    </p>
                  </div>
                  <VerifyCallout
                    context="interview"
                    status={e.verificationStatus}
                    onSubmit={async ({ subject, notes, links, files }) => {
                      await requestCandidateVerification("interview", {
                        subject,
                        notes,
                        links,
                        files,
                        interviewProgressId: String(e.id),
                      });
                    }}
                  />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Manage Interview Progress</h3>
          <div className="space-y-4 max-h-[60vh] overflow-auto">
            {edited.map((e, idx) => (
              <EditorItem
                key={idx}
                entry={e}
                index={idx}
                availableInterviewCompanies={availableCompanies}
                onRemove={(i) => setEdited(edited.filter((_, j) => j !== i))}
                onUpdate={(i, field, val) =>
                  setEdited(
                    edited.map((ent, j) =>
                      j === i ? { ...ent, [field]: val } : ent
                    )
                  )
                }
              />
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                setEdited([
                  ...edited,
                  {
                    id: uuid(),
                    companyId: "",
                    position: "",
                    roundsCleared: "",
                    totalRounds: "",
                    status: "unverified",
                    verificationStatus: "unverified",
                    dateCleared: new Date().toISOString().slice(0, 10),
                  } satisfies InterviewProgress,
                ])
              }
            >
              <Plus className="mr-1" /> Add Entry
            </Button>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
