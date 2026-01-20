"use client";

import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BasicInfoStep } from "@/features/auth/Candidate/BasicInfoStep";
import { signUp } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";

export const SignupWizard: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await signUp.email({
      name: fullName,
      email,
      password,
      callbackURL: "/dashboard",
    });

    setLoading(false);

    if (error || !data?.user) {
      toast.error(error?.message || "Signup failed");
      return;
    }

    toast.success("Check your email to complete signup");
  };

  return (
    <Card className="w-full rounded-xl border-0 shadow-none overflow-visible">
      <form onSubmit={handleSubmit}>
        <CardContent className="px-0 py-2">
          <BasicInfoStep
            formData={{ fullName, email, password }}
            onChange={(e) => {
              const { name, value } = e.target;
              if (name === "fullName") setFullName(value);
              else if (name === "email") setEmail(value);
              else if (name === "password") setPassword(value);
            }}
          />
        </CardContent>

        <CardFooter className="flex flex-col gap-4 px-0 pt-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 shadow-lg shadow-blue-500/20"
            disabled={loading || !fullName || !email || !password}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
          <p className="text-xs text-center text-slate-500">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};