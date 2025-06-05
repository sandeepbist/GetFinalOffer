"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";

import { StepIndicator } from "@/features/auth/Recruiter/components/StepIndicator";
import { RecruiterBasicStep } from "@/features/auth/Recruiter/RecruiterBasicStep";
import { RecruiterCompanyStep } from "@/features/auth/Recruiter/RecruiterCompanyStep";

interface RecruiterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  companyDescription?: string;
}

function getDomainFromUrl(url: string): string | null {
  try {
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function RecruiterSignupWizard() {
  const [step, setStep] = useState(1);
  const labels = ["Basic", "Company"];
  const stepTitles = ["Create Your Account", "Company Details"];
  const stepUnder = [
    "Sign up with your company-email to get started",
    "Tell us about your company",
  ];

  const form = useForm<RecruiterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyWebsite: "",
      companySize: "",
      companyDescription: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    trigger,
    setError,
    formState: { isSubmitting },
  } = form;

  const onNext = async () => {
    const valid = await trigger([
      "fullName",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (valid) {
      setStep(2);
    }
  };

  const onBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (values: RecruiterFormValues) => {
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", {
        type: "validate",
        message: "Passwords must match.",
      });
      setStep(1);
      return;
    }

    const domain = getDomainFromUrl(values.companyWebsite);
    if (!domain) {
      setError("companyWebsite", {
        type: "validate",
        message: "Enter a valid URL (e.g. acme.com).",
      });
      return;
    }

    const emailDomain = values.email.split("@")[1]?.toLowerCase();
    if (!emailDomain || emailDomain !== domain) {
      setError("email", {
        type: "validate",
        message: `Email domain must match company domain (“${domain}”).`,
      });
      setStep(1);
      return;
    }

    try {
      console.log("Recruiter signup:", values);
      toast.success("Recruiter account created! Redirecting…");
      setTimeout(() => {
        window.location.href = "/recruiter/dashboard";
      }, 800);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-2xl rounded-xl border-0 shadow-none overflow-hidden">
        <form onSubmit={step < labels.length ? onNext : handleSubmit(onSubmit)}>
          <CardContent className="p-8">
            <h2 className="text-2xl mb-1 font-bold text-gray-800">
              {stepTitles[step - 1]}
            </h2>
            <p className="text-sm mb-6 text-gray-600">{stepUnder[step - 1]}</p>

            <StepIndicator step={step} labels={labels} />

            {step === 1 && <RecruiterBasicStep />}

            {step === 2 && <RecruiterCompanyStep />}
          </CardContent>

          <CardFooter className="flex justify-between px-8">
            {step > 1 ? (
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < labels.length ? (
              <Button type="button" onClick={onNext}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Signing Up…" : "Sign Up"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
}
