"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
      <Card className="relative overflow-hidden border-border/80 bg-surface">
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface/65 p-6 text-center backdrop-blur-[1px]">
            <div className="mb-4 rounded-full bg-surface p-4 shadow-lg ring-1 ring-border">
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

        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 bg-highlight/60 py-4">
          <h3 className="text-lg font-semibold text-heading">
            Interview Progress
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={openEditor}
            disabled={isLocked}
            className="border-border/80 bg-surface"
          >
            {interviewProgress.length ? (
              <Pencil size={14} className="mr-2" />
            ) : (
              <Plus size={14} className="mr-2" />
            )}
            {interviewProgress.length ? "Edit History" : "Add Interview"}
          </Button>
        </CardHeader>
        <CardContent className="min-h-[200px] space-y-3 pt-6">
          {interviewProgress.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-10 text-center">
              <div className="mb-3 rounded-full bg-highlight p-3">
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
            interviewProgress.map((e, idx) => {
              const company =
                availableCompanies.find((c) => c.id === e.companyId)?.name ||
                "Unknown";
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between rounded-xl border border-border/80 bg-highlight/45 p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-heading">
                        {company}
                      </span>
                      <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-text">
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
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-2xl">
          <h3 className="mb-4 text-xl font-bold text-heading">Manage Interview Progress</h3>
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
              className="w-full border-2 border-dashed py-6 text-text-muted hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
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
          <div className="mt-6 flex justify-end space-x-3 border-t border-border/75 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
