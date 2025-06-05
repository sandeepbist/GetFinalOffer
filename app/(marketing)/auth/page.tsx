"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/features/auth/UI/LoginForm";
import { SignupWizard } from "@/features/auth/UI/SignupWizard";
import { RecruiterSignupWizard } from "@/features/auth/UI/RecruiterSignupWizard";

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-50 pt-10 pb-10 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${role}`}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <Card className="w-full min-w-xl max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-white px-8 pb-4 text-center">
              <CardTitle className="text-3xl pt-2 font-bold text-gray-900">
                {mode === "login" ? "Sign In" : ""}
              </CardTitle>
            </CardHeader>

            <CardContent className="bg-white px-8 space-y-2">
              {mode === "login" ? (
                <LoginForm />
              ) : (
                <>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={role === "candidate" ? "default" : "outline"}
                      onClick={() => setRole("candidate")}
                    >
                      Candidate
                    </Button>
                    <Button
                      variant={role === "recruiter" ? "default" : "outline"}
                      onClick={() => setRole("recruiter")}
                    >
                      Recruiter
                    </Button>
                  </div>
                  {role === "candidate" ? (
                    <SignupWizard />
                  ) : (
                    <RecruiterSignupWizard />
                  )}
                </>
              )}

              <div className="text-center pt-4">
                {mode === "login" ? (
                  <p className="text-sm text-gray-600">
                    New here?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
