"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, BellRing } from "lucide-react";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileProfessionalForm } from "./components/ProfileProfessionalForm";
import { InterviewProgressManager } from "./components/InterviewProgressManager";
import { HideOrganisations } from "./components/HideOrganisations";
import { authClient } from "@/lib/auth/auth-client";
import {
  getCandidateProfile,
  getAllCompanies,
  getAllSkills,
  saveInterviewProgress,
  uploadCandidateResume,
  updateCandidateProfile,
  requestCandidateVerification,
} from "@/features/candidate/candidate-use-cases";
import type { TUserAuth } from "@/lib/auth/auth-types";
import {
  getAllPartnerOrganisations,
  setHiddenOrganisationsForCandidate,
} from "@/features/organisation/partner-organisations-use-cases";
import {
  getCandidateInvites,
  respondToInvite,
} from "@/features/contacts/contact-use-cases";
import type { PartnerOrganisationDTO } from "@/features/organisation/partner-organisations-dto";
import type {
  CandidateProfileSummaryDTO,
  InterviewProgressEntryDTO,
} from "@/features/candidate/candidate-dto";
import type { CandidateInviteDTO } from "@/features/contacts/contact-dto";
import type { CompanyDTO } from "./components/SingleCompanySelect";
import type { SkillDTO } from "./components/SkillMultiSelect";
import type { InterviewProgress } from "./components/InterviewProgressItem";
import { VerificationStatus, VerifyCallout } from "./components/VerifyCallout";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="space-y-2.5">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="h-fit space-y-6 rounded-2xl border border-border bg-surface p-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </main>
  );
}


const dashboardCache: {
  data: { p: CandidateProfileSummaryDTO | null; c: CompanyDTO[]; s: SkillDTO[]; o: PartnerOrganisationDTO[]; i: CandidateInviteDTO[] } | null;
  ts: number;
} = { data: null, ts: 0 };
const STALE_MS = 30_000;

export default function CandidateDashboard({ user }: { user: TUserAuth }) {
  const router = useRouter();
  const { data: session, error } = authClient.useSession();

  const cached = dashboardCache.data;
  const [profile, setProfile] = useState<CandidateProfileSummaryDTO | null>(cached?.p ?? null);
  const [companies, setCompanies] = useState<CompanyDTO[]>(cached?.c ?? []);
  const [skills, setSkills] = useState<SkillDTO[]>(cached?.s ?? []);
  const [loading, setLoading] = useState(!cached);
  const [editing, setEditing] = useState(false);
  const [formVals, setFormVals] = useState(() => {
    const p = cached?.p;
    return p ? {
      professionalTitle: p.professionalTitle,
      currentRole: p.currentRole,
      yearsExperience: String(p.yearsExperience),
      location: p.location,
      about: p.bio,
    } : {
      professionalTitle: "",
      currentRole: "",
      yearsExperience: "",
      location: "",
      about: "",
    };
  });
  const [selSkills, setSelSkills] = useState<string[]>(cached?.p?.skillIds ?? []);
  const [partnerOrgs, setPartnerOrgs] = useState<PartnerOrganisationDTO[]>(cached?.o ?? []);
  const [hiddenOrgs, setHiddenOrgs] = useState<string[]>([]);
  const [invites, setInvites] = useState<CandidateInviteDTO[]>(cached?.i ?? []);
  const didFetch = useRef(false);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return String(err);
  };

  const refreshData = () => {
    Promise.all([
      getCandidateProfile(),
      getCandidateInvites(),
    ]).then(([p, i]) => {
      setProfile(p);
      setInvites(i);
      if (dashboardCache.data) {
        dashboardCache.data.p = p;
        dashboardCache.data.i = i;
        dashboardCache.ts = Date.now();
      }
    });
  };

  useEffect(() => {
    if (error) {
      router.replace("/auth");
      return;
    }

    if (session?.user && !didFetch.current) {
      didFetch.current = true;

      if (dashboardCache.data && Date.now() - dashboardCache.ts < STALE_MS) {
        setLoading(false);
        return;
      }

      const background = !!dashboardCache.data;
      if (!background) setLoading(true);

      Promise.all([
        getCandidateProfile(),
        getAllCompanies(),
        getAllSkills(),
        getAllPartnerOrganisations(),
        getCandidateInvites(),
      ])
        .then(([p, c, s, o, i]) => {
          dashboardCache.data = { p, c, s, o, i };
          dashboardCache.ts = Date.now();
          setProfile(p);
          setCompanies(c);
          setSkills(s);
          setPartnerOrgs(o);
          setInvites(i);
          if (p) {
            setFormVals({
              professionalTitle: p.professionalTitle,
              currentRole: p.currentRole,
              yearsExperience: String(p.yearsExperience),
              location: p.location,
              about: p.bio,
            });
            setSelSkills(p.skillIds);
          }
        })
        .catch(() => {
          toast.error("Failed to initialize dashboard");
        })
        .finally(() => setLoading(false));
    }
  }, [session, error, router]);

  const toggleHidden = (orgId: string) => {
    setHiddenOrgs((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId]
    );
  };

  const saveHidden = async () => {
    try {
      await setHiddenOrganisationsForCandidate(hiddenOrgs);
      toast.success("Visibility settings saved");
    } catch {
      toast.error("Could not save visibility settings");
    }
  };

  const handleInviteResponse = async (id: string, status: "accepted" | "rejected") => {
    const ok = await respondToInvite(id, status);
    if (ok) {
      toast.success(`Invite ${status}`);
      refreshData();
    } else {
      toast.error("Failed to update status");
    }
  };

  if (!session || loading) {
    return <DashboardSkeleton />;
  }

  const isProfileComplete = !!(
    profile &&
    profile.professionalTitle &&
    profile.location
  );

  const entries: InterviewProgress[] =
    (profile?.interviewProgress ?? []).map((e) => ({
      id: e.id,
      companyId: e.companyId,
      position: e.position,
      roundsCleared: String(e.roundsCleared),
      totalRounds: String(e.totalRounds),
      status: e.status,
      verificationStatus: e.verificationStatus as VerificationStatus,
      dateCleared: e.dateCleared,
    }));

  const handleSaveProgress = async (updated: InterviewProgress[]) => {
    const dto: InterviewProgressEntryDTO[] = updated.map((e) => ({
      id: e.id,
      companyId: e.companyId,
      position: e.position,
      roundsCleared: Number(e.roundsCleared),
      totalRounds: Number(e.totalRounds),
      status: e.status,
      verificationStatus: e.verificationStatus as VerificationStatus,
      dateCleared: e.dateCleared,
    }));
    await saveInterviewProgress(dto);
    setProfile(await getCandidateProfile());
    toast.success("Interview progress saved");
  };

  const handleUpload = async (file: File) => {
    try {
      const url = await uploadCandidateResume(file);
      if (url && profile) {
        setProfile({ ...profile, resumeUrl: url });
        toast.success("Resume uploaded");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "Resume upload failed");
    }
  };

  const saveProfile = async () => {
    try {
      await updateCandidateProfile({
        professionalTitle: formVals.professionalTitle,
        currentRole: formVals.currentRole,
        yearsExperience: Number(formVals.yearsExperience),
        location: formVals.location,
        bio: formVals.about,
        skillIds: selSkills,
      });
      setProfile(await getCandidateProfile());
      setEditing(false);
      toast.success("Profile updated");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "Failed to update profile");
    }
  };

  const handleProfileVerify = async (data: {
    subject: string;
    notes: string;
    links: string;
    files: File[];
  }) => {
    try {
      const combinedNotes = data.links
        ? `${data.notes}\n\nLinks provided:\n${data.links}`
        : data.notes;

      const ok = await requestCandidateVerification({
        action: "profile",
        subject: data.subject,
        notes: combinedNotes,
        files: data.files,
      });

      if (ok) {
        setProfile(await getCandidateProfile());
        toast.success("Verification request sent");
      } else {
        toast.error("Request failed");
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || "Request failed");
    }
  };

  const completionFields = [
    profile?.professionalTitle,
    profile?.currentRole,
    profile?.yearsExperience,
    profile?.location,
    profile?.bio,
    profile?.resumeUrl,
  ];
  const filledCount = completionFields.filter((f) => f).length;
  const completion = Math.round((filledCount / completionFields.length) * 100);

  const skillNames =
    (profile?.skillIds ?? []).map(
      (id) => skills.find((s) => s.id === id)?.name || ""
    );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto min-h-screen max-w-7xl space-y-6 bg-section px-6 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <WelcomeBanner name={user.name} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <ProfileCard
          name={user.name}
          email={user.email}
          title={profile?.professionalTitle || ""}
          location={profile?.location || ""}
          experience={profile?.yearsExperience || 0}
          profileImage={user.image || "/avatar.jpg"}
          completion={completion}
          skills={skillNames}
          resumeUrl={profile?.resumeUrl}
          isLocked={!isProfileComplete}
          onUpload={handleUpload}
          onEdit={() => setEditing(true)}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 space-y-6"
        >
          {invites.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="border-b border-primary/15 pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-heading">
                  <BellRing className="w-5 h-5" /> Recruiter Invites
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {invites.map((invite, idx) => (
                  <motion.div
                    key={invite.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-surface/90 p-4"
                  >
                    <div>
                      <p className="font-bold text-heading">
                        {invite.organisationName}
                      </p>
                      <p className="text-sm text-text-muted">
                        {invite.recruiterName} wants to connect
                      </p>
                      <p className="text-xs text-text-subtle mt-1">
                        {new Date(invite.contactedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {invite.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-text-muted hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            handleInviteResponse(invite.id, "rejected")
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="min-w-[92px]"
                          onClick={() =>
                            handleInviteResponse(invite.id, "accepted")
                          }
                        >
                          <Check className="w-4 h-4 mr-2" /> Accept
                        </Button>
                      </div>
                    ) : (
                      <Badge
                        variant={
                          invite.status === "accepted" ? "default" : "destructive"
                        }
                      >
                        {invite.status}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}

          <InterviewProgressManager
            interviewProgress={entries}
            availableCompanies={companies}
            isLocked={!isProfileComplete}
            onSave={handleSaveProgress}
          />
        </motion.div>
      </motion.div>

      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <HideOrganisations
            partnerOrgs={partnerOrgs}
            hiddenOrgs={hiddenOrgs}
            onToggle={toggleHidden}
            onSave={saveHidden}
          />
        </motion.div>
      )}

      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <VerifyCallout
            context="profile"
            status={profile.verificationStatus ?? "unverified"}
            onSubmit={handleProfileVerify}
          />
        </motion.div>
      )}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-2xl">
          <ProfileProfessionalForm
            values={formVals}
            availableSkills={skills}
            selectedSkillIds={selSkills}
            onChangeField={(e) =>
              setFormVals((f) => ({ ...f, [e.target.name]: e.target.value }))
            }
            onChangeSkillIds={setSelSkills}
            onSave={saveProfile}
            onCancel={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.main>
  );
}
