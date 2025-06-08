"use client";

import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BasicInfoStep } from "@/features/auth/Candidate/BasicInfoStep";
import { signUp } from "@/lib/auth/auth-client";

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
        <CardContent className="p-8">
          <h2 className="text-2xl mb-4 font-bold text-gray-800">Sign Up</h2>

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

        <CardFooter className="flex justify-end mb-4">
          <Button
            type="submit"
            disabled={loading || !fullName || !email || !password}
          >
            {loading ? "Signing Up…" : "Create Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
