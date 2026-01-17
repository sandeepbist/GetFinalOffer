"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import type { PartnerOrganisationDTO } from "@/features/organisation/partner-organisations-dto";
import type {
  CandidateProfileSummaryDTO,
  InterviewProgressEntryDTO,
} from "@/features/candidate/candidate-dto";
import type { CompanyDTO } from "./components/SingleCompanySelect";
import type { SkillDTO } from "./components/SkillMultiSelect";
import type { InterviewProgress } from "./components/InterviewProgressItem";
import { VerificationStatus, VerifyCallout } from "./components/VerifyCallout";

export default function CandidateDashboard({ user }: { user: TUserAuth }) {
  const router = useRouter();
  const { data: session, error } = authClient.useSession();
  const [profile, setProfile] = useState<CandidateProfileSummaryDTO | null>(
    null
  );
  const [companies, setCompanies] = useState<CompanyDTO[]>([]);
  const [skills, setSkills] = useState<SkillDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formVals, setFormVals] = useState({
    professionalTitle: "",
    currentRole: "",
    yearsExperience: "",
    location: "",
    about: "",
  });
  const [selSkills, setSelSkills] = useState<string[]>([]);
  const [partnerOrgs, setPartnerOrgs] = useState<PartnerOrganisationDTO[]>([]);
  const [hiddenOrgs, setHiddenOrgs] = useState<string[]>([]);

  useEffect(() => {
    if (error) {
      router.replace("/auth");
      return;
    }
    if (session?.user) {
      Promise.all([
        getCandidateProfile(),
        getAllCompanies(),
        getAllSkills(),
        getAllPartnerOrganisations(),
      ])
        .then(([p, c, s, o]) => {
          setProfile(p);
          setCompanies(c);
          setSkills(s);
          setPartnerOrgs(o);
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
        .catch((err) => {
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

  if (!session || loading) return null;

  const isProfileComplete = !!(
    profile &&
    profile.professionalTitle &&
    profile.location
  );

  const entries: InterviewProgress[] =
    profile?.interviewProgress.map((e) => ({
      id: e.id,
      companyId: e.companyId,
      position: e.position,
      roundsCleared: String(e.roundsCleared),
      totalRounds: String(e.totalRounds),
      status: e.status,
      verificationStatus: e.verificationStatus as VerificationStatus,
      dateCleared: e.dateCleared,
    })) || [];

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
    } catch (err: any) {
      toast.error(err.message || "Resume upload failed");
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
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handleProfileVerify = async (data: {
    subject: string;
    notes: string;
    links: string;
    files: File[];
  }) => {
    try {
      const ok = await requestCandidateVerification("profile", data);
      if (ok) {
        setProfile(await getCandidateProfile());
        toast.success("Verification request sent");
      } else {
        toast.error("Request failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Request failed");
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
    profile?.skillIds.map(
      (id) => skills.find((s) => s.id === id)?.name || ""
    ) || [];

  return (
    <main className="max-w-7xl mx-auto space-y-6 px-6 py-8">
      <WelcomeBanner name={user.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        <div className="lg:col-span-2 space-y-6">
          <InterviewProgressManager
            interviewProgress={entries}
            availableCompanies={companies}
            isLocked={!isProfileComplete}
            onSave={handleSaveProgress}
          />
        </div>
      </div>

      {profile && (
        <HideOrganisations
          partnerOrgs={partnerOrgs}
          hiddenOrgs={hiddenOrgs}
          onToggle={toggleHidden}
          onSave={saveHidden}
        />
      )}

      {profile && (
        <VerifyCallout
          context="profile"
          status={profile.verificationStatus ?? "unverified"}
          onSubmit={handleProfileVerify}
        />
      )}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-lg">
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
    </main>
  );
}
