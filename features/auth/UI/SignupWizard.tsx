"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/features/auth/Recruiter/components/StepIndicator";
import { BasicInfoStep } from "@/features/auth/Candidate/BasicInfoStep";
import {
  ProfessionalStep,
  InterviewProgress,
  CompanyDTO,
  SkillDTO,
} from "@/features/auth/Candidate/ProfessionalStep";
import { ResumeStep } from "@/features/auth/Candidate/ResumeStep";
import { signUp } from "@/lib/auth/auth-client";
import {
  CreateCandidateProfileDTO,
  InterviewProgressEntryDTO,
} from "@/features/candidate/candidate-dto";
import { CandidateRepository } from "@/features/candidate/candidate-repository";
import apiAdapter from "@/features/common/api/api-local-adapter";
import {
  getAllCompanies,
  getAllSkills,
} from "@/features/candidate/candidate-use-cases";

export const SignupWizard: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const labels = ["Basic", "Professional", "Resume"];
  const totalSteps = labels.length;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [professionalTitle, setProfessionalTitle] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);

  const [companiesList, setCompaniesList] = useState<CompanyDTO[]>([]);
  const [skillsList, setSkillsList] = useState<SkillDTO[]>([]);
  const [excludedCompanyIds, setExcludedCompanyIds] = useState<number[]>([]);

  const [interviewProgress, setInterviewProgress] = useState<
    InterviewProgress[]
  >([]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      const fetchedCompanies = await getAllCompanies();
      setCompaniesList(fetchedCompanies);
      const fetchedSkills = await getAllSkills();
      setSkillsList(fetchedSkills);
    })();
  }, []);

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) setStep((s) => s + 1);
  };
  const back = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 1) setStep((s) => s - 1);
  };

  const handleCompleteProfile = async (e: FormEvent) => {
    e.preventDefault();

    const { data, error } = await signUp.email({
      email,
      password,
      name: fullName,
    });

    if (error || !data?.user) {
      toast.error(error?.message || "Signup failed");
      return;
    }
    const user = data.user;

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    const interviewEntries: InterviewProgressEntryDTO[] = interviewProgress.map(
      (entry) => ({
        companyId: Number(entry.companyId),
        position: entry.position,
        roundsCleared: Number(entry.roundsCleared),
        totalRounds: Number(entry.totalRounds),
        status: entry.status,
        dateCleared: entry.dateCleared,
      })
    );

    const dto: CreateCandidateProfileDTO = {
      userId: user.id,
      professionalTitle,
      currentRole,
      yearsOfExperience,
      location,
      bio,
      skillIds: selectedSkillIds,
      interviewProgress: interviewEntries,
      resumeFile,
    };

    const repository = CandidateRepository(apiAdapter);
    const response = await repository.createProfile(dto);

    if (!response.ok) {
      toast.error(response.error || "Failed to save profile data");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/dashboard");
  };

  return (
    <Card className="w-full rounded-xl border-0 shadow-none overflow-visible">
      <form onSubmit={step < totalSteps ? next : handleCompleteProfile}>
        <CardContent className="p-8">
          <h2 className="text-2xl mb-1 font-bold text-gray-800">
            {labels[step - 1]}
          </h2>
          <StepIndicator labels={labels} step={step} />

          {step === 1 && (
            <BasicInfoStep
              formData={{ fullName, email, password }}
              onChange={(e) => {
                const { name, value } = e.target;
                if (name === "fullName") setFullName(value);
                else if (name === "email") setEmail(value);
                else if (name === "password") setPassword(value);
              }}
            />
          )}

          {step === 2 && (
            <ProfessionalStep
              formData={{
                professionalTitle,
                currentRole,
                yearsOfExperience: yearsOfExperience.toString(),
                location,
                about: bio,
              }}
              onChangeField={(e) => {
                const { name, value } = e.target;
                if (name === "professionalTitle") setProfessionalTitle(value);
                else if (name === "currentRole") setCurrentRole(value);
                else if (name === "yearsOfExperience")
                  setYearsOfExperience(Number(value));
                else if (name === "location") setLocation(value);
                else if (name === "about") setBio(value);
              }}
              availableSkills={skillsList}
              selectedSkillIds={selectedSkillIds}
              onChangeSkillIds={setSelectedSkillIds}
              availableCompanies={companiesList}
              excludedCompanyIds={excludedCompanyIds}
              onChangeExcludedCompanies={setExcludedCompanyIds}
              interviewProgress={interviewProgress}
              onAddInterviewEntry={() =>
                setInterviewProgress((prev) => [
                  ...prev,
                  {
                    companyId: "",
                    position: "",
                    roundsCleared: "",
                    totalRounds: "",
                    status: "",
                    dateCleared: "",
                  },
                ])
              }
              onRemoveInterviewEntry={(idx) =>
                setInterviewProgress((prev) => prev.filter((_, i) => i !== idx))
              }
              onUpdateInterviewEntry={(idx, field, value) =>
                setInterviewProgress((prev) =>
                  prev.map((entry, i) =>
                    i === idx
                      ? {
                          ...entry,
                          [field]:
                            field === "companyId"
                              ? Number(value)
                              : String(value),
                        }
                      : entry
                  )
                )
              }
            />
          )}

          {step === 3 && (
            <ResumeStep
              resume={resumeFile}
              onFileChange={(file) => setResumeFile(file)}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between mb-4">
          {step > 1 ? (
            <Button variant="outline" onClick={back}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            type="submit"
            disabled={step === totalSteps && !resumeFile}
            className={
              step === totalSteps && !resumeFile
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          >
            {step < totalSteps ? "Next" : "Complete Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
