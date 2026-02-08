"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Pencil, Lock } from "lucide-react";
import {
  InterviewProgressItem as EditorItem,
  InterviewProgress,
} from "./InterviewProgressItem";
import { VerifyCallout } from "./VerifyCallout";
import { requestCandidateVerification } from "@/features/candidate/candidate-use-cases";

interface InterviewProgressManagerProps {
  interviewProgress: InterviewProgress[];
  availableCompanies: { id: string; name: string }[];
  isLocked?: boolean;
  onSave: (entries: InterviewProgress[]) => Promise<void>;
}
const uuid = () => crypto.randomUUID();

export const InterviewProgressManager: React.FC<
  InterviewProgressManagerProps
> = ({ interviewProgress, availableCompanies, isLocked = false, onSave }) => {
  const [open, setOpen] = useState(false);
  const [edited, setEdited] = useState<InterviewProgress[]>([]);

  const openEditor = () => {
    if (isLocked) return;
    setEdited(interviewProgress);
    setOpen(true);
  };

  const save = async () => {
    await onSave(edited);
    setOpen(false);
  };

  return (
    <>
      <Card className="border-border shadow-sm relative overflow-hidden bg-surface">
        {isLocked && (
          <div className="absolute inset-0 z-10 bg-surface/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-surface p-4 rounded-full shadow-lg mb-4 ring-1 ring-border">
              <Lock className="w-6 h-6 text-text-muted" />
            </div>
            <h3 className="font-semibold text-heading">
              Interview History Locked
            </h3>
            <p className="text-sm text-text-muted max-w-xs mt-1">
              Please complete your basic profile information to start adding
              your interview history.
            </p>
          </div>
        )}

        <CardHeader className="flex flex-row justify-between items-center border-b border-border bg-highlight py-4">
          <h3 className="text-lg font-semibold text-heading">
            Interview Progress
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={openEditor}
            disabled={isLocked}
            className="bg-surface"
          >
            {interviewProgress.length ? (
              <Pencil size={14} className="mr-2" />
            ) : (
              <Plus size={14} className="mr-2" />
            )}
            {interviewProgress.length ? "Edit History" : "Add Interview"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 pt-6 min-h-[200px]">
          {interviewProgress.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-border rounded-xl">
              <div className="p-3 bg-highlight rounded-full mb-3">
                <Plus className="w-6 h-6 text-text-subtle" />
              </div>
              <p className="text-sm font-medium text-text">
                No interviews logged yet
              </p>
              <p className="text-xs text-text-muted mt-1 max-w-sm">
                Add your past interview results to get verified and skip
                technical rounds.
              </p>
            </div>
          ) : (
            interviewProgress.map((e) => {
              const company =
                availableCompanies.find((c) => c.id === e.companyId)?.name ||
                "Unknown";
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl bg-surface hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-heading">
                        {company}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-highlight text-text border border-border">
                        {e.roundsCleared}/{e.totalRounds} Rounds
                      </span>
                    </div>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      Cleared on {new Date(e.dateCleared).toLocaleDateString()}
                    </p>
                  </div>
                  <VerifyCallout
                    context="interview"
                    status={e.verificationStatus}
                    onSubmit={async ({ subject, notes, links, files }) => {
                      await requestCandidateVerification({
                        action: "interview",
                        subject: subject,
                        notes: `${notes}\n\nLinks: ${links}`,
                        files: files,
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
        <DialogContent className="w-full max-w-2xl">
          <h3 className="text-xl font-bold text-heading mb-4">Manage Interview Progress</h3>
          <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
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
              className="w-full border-dashed border-2 py-6 text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5"
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
              <Plus className="mr-2 h-4 w-4" /> Add Another Interview
            </Button>
          </div>
          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
