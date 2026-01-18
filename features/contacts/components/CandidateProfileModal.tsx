"use client";

import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { sendInvite } from "@/features/contacts/contact-use-cases";
import { getCandidateFullById } from "@/features/candidate/candidate-use-cases";
import type { CandidateFullProfileDTO } from "@/features/candidate/candidate-dto";

import { trackProfileView } from "@/features/analytics/analytics-use-cases";
import { useSession } from "@/lib/auth/auth-client";

interface Props {
  userId: string;
  open: boolean;
  onClose: () => void;
}

export function CandidateProfileModal({ userId, open, onClose }: Props) {
  const { data: session } = useSession();
  const [full, setFull] = useState<CandidateFullProfileDTO | null>(null);
  const [sending, setSending] = useState(false);

  const viewStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      viewStartTimeRef.current = Date.now();

      getCandidateFullById(userId)
        .then(setFull)
        .catch(() => setFull(null));
    } else {
      setFull(null);
    }

    return () => {
      if (open && viewStartTimeRef.current && session?.user?.id) {
        const duration = Date.now() - viewStartTimeRef.current;

        if (duration > 500) {
          trackProfileView(session.user.id, {
            candidateId: userId,
            durationMs: duration
          });
        }
      }
    };
  }, [open, userId, session?.user?.id]);

  const handleSend = async () => {
    setSending(true);
    const { success, error, alreadyInvited } = await sendInvite({
      candidateUserId: userId,
    });
    setSending(false);

    if (!success) toast.error(error || "Failed to send invite");
    if (success && alreadyInvited) toast.success("Already Invited");
    else {
      toast.success("Invite sent!");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 space-y-4">
        {!full ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={full.user.image} alt={full.user.name} />
              <AvatarFallback>{full.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{full.user.name}</h2>
              <p className="text-sm text-gray-600">{full.profile.location}</p>
            </div>
          </div>
        )}

        {full && (
          <>
            {full.profile.skills && full.profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {full.profile.skills.map((skillName, index) => (
                  <Badge key={index} variant="secondary">
                    {skillName}
                  </Badge>
                ))}
              </div>
            )}

            <p>
              <span className="font-medium">Email:</span> {full.user.email}
            </p>

            {full.profile.interviewProgress.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Interview Progress</h3>
                <div className="space-y-3">
                  {full.profile.interviewProgress.map((step) => (
                    <Card key={step.id} className="border">
                      <CardContent className="p-4 space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{step.companyId}</h4>
                          <Badge variant="secondary">{step.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>
                            <span className="font-medium">Position:</span>{" "}
                            {step.position}
                          </p>
                          <p>
                            <span className="font-medium">Rounds:</span>{" "}
                            {step.roundsCleared}/{step.totalRounds}
                          </p>
                          <p>
                            <span className="font-medium">Cleared:</span>{" "}
                            {new Date(step.dateCleared).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={sending} onClick={handleSend}>
                {sending ? "Sending…" : "Send Invite"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
