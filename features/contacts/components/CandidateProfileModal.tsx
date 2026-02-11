"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { toast } from "sonner";
import { Briefcase, CalendarDays, Mail, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { sendInvite } from "@/features/contacts/contact-use-cases";
import { trackProfileView } from "@/features/analytics/analytics-use-cases";
import { useSession } from "@/lib/auth/auth-client";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";

interface Props {
  candidate: CandidateSummaryDTO;
  open: boolean;
  onClose: () => void;
}

function buildFallbackPreview(candidate: CandidateSummaryDTO) {
  return {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email || "",
    image: candidate.image || null,
    title: candidate.title,
    currentRole: null,
    location: candidate.location,
    yearsExperience: candidate.yearsExperience,
    bio: candidate.bio || "",
    verificationStatus: candidate.verificationStatus || "unverified",
    resumeUrl: candidate.resumeUrl || "",
    skills: candidate.skills || [],
    interviewProgress: [],
  };
}

export function CandidateProfileModal({ candidate, open, onClose }: Props) {
  const { data: session } = useSession();
  const [sending, setSending] = useState(false);
  const viewStartTimeRef = useRef<number | null>(null);

  const profile = useMemo(
    () => candidate.profilePreview ?? buildFallbackPreview(candidate),
    [candidate]
  );

  useEffect(() => {
    if (open) {
      viewStartTimeRef.current = Date.now();
      return;
    }

    if (viewStartTimeRef.current && session?.user?.id) {
      const duration = Date.now() - viewStartTimeRef.current;
      if (duration > 500) {
        trackProfileView(session.user.id, {
          candidateId: candidate.id,
          durationMs: duration,
        });
      }
    }
  }, [open, session?.user?.id, candidate.id]);

  const handleSend = async () => {
    setSending(true);
    const { success, error, alreadyInvited } = await sendInvite({
      candidateUserId: candidate.id,
    });
    setSending(false);

    if (!success) {
      toast.error(error || "Failed to send invite");
      return;
    }

    if (alreadyInvited) {
      toast.success("Already invited");
      return;
    }

    toast.success("Invite sent");
    onClose();
  };

  const interviewCount = profile.interviewProgress.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl overflow-hidden border-border/80 p-0">
        <div className="border-b border-border/70 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 py-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border border-border/80 shadow-sm">
              <AvatarImage src={profile.image || "/avatar.jpg"} alt={profile.name} />
              <AvatarFallback className="text-xl font-semibold">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-heading">{profile.name}</h2>
                {profile.verificationStatus === "verified" && (
                  <Badge className="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-text">{profile.title || "Candidate"}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location || "Location not provided"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {profile.email || "Email not available"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="border-border/80 bg-surface/90">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Experience</p>
                <p className="mt-1 text-xl font-semibold text-heading">{profile.yearsExperience} years</p>
              </CardContent>
            </Card>
            <Card className="border-border/80 bg-surface/90">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Skills</p>
                <p className="mt-1 text-xl font-semibold text-heading">{profile.skills.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border/80 bg-surface/90">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Interviews</p>
                <p className="mt-1 text-xl font-semibold text-heading">{interviewCount}</p>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">About</h3>
            <p className="rounded-xl border border-border/80 bg-highlight/70 p-4 text-sm leading-relaxed text-text">
              {profile.bio?.trim() || "No professional summary provided yet."}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">Skills</h3>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="border-border/80 bg-highlight text-text">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No skills listed.</p>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Interview Timeline
            </h3>
            {profile.interviewProgress.length > 0 ? (
              <div className="space-y-3">
                {profile.interviewProgress.map((step) => (
                  <Card key={step.id} className="border-border/80 bg-surface/90">
                    <CardContent className="space-y-2 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-heading">{step.companyName}</p>
                          <p className="text-xs text-text-muted">{step.position}</p>
                        </div>
                        <Badge variant="outline" className="border-border/80 bg-highlight text-text-muted">
                          {step.status}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 gap-2 text-sm text-text-muted sm:grid-cols-2">
                        <p className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          Rounds: {step.roundsCleared}/{step.totalRounds}
                        </p>
                        <p className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(step.dateCleared).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border/80 bg-highlight/70 p-4 text-sm text-text-muted">
                No interview history available.
              </p>
            )}
          </section>
        </div>

        <div className="flex justify-end gap-2 border-t border-border/75 bg-highlight px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={sending} onClick={handleSend}>
            {sending ? <LoadingIndicator label="Sending..." /> : "Send Invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
