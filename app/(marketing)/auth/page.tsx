"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/UI/LoginForm";
import { SignupWizard } from "@/features/auth/UI/SignupWizard";
import RecruiterSignupWizard from "@/features/auth/UI/RecruiterSignupWizard";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4 bg-section">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/18 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-highlight/70 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10 space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center space-y-2"
        >
          <h1 className="text-2xl font-bold tracking-tight text-heading">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-text-muted text-sm">
            {mode === "login"
              ? "Enter your credentials to access your account"
              : "Join thousands of professionals finding their dream jobs"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border/70 shadow-xl bg-surface/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 pt-8 space-y-6 min-h-[420px]">

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-2 p-1 bg-highlight rounded-lg"
                >
                  <button
                    onClick={() => setRole("candidate")}
                    className={cn(
                      "relative text-sm font-medium py-2 rounded-md transition-colors duration-200",
                      role === "candidate"
                        ? "text-primary"
                        : "text-text-muted hover:text-heading"
                    )}
                  >
                    {role === "candidate" && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute inset-0 bg-surface shadow-sm rounded-md"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">Candidate</span>
                  </button>
                  <button
                    onClick={() => setRole("recruiter")}
                    className={cn(
                      "relative text-sm font-medium py-2 rounded-md transition-colors duration-200",
                      role === "recruiter"
                        ? "text-primary"
                        : "text-text-muted hover:text-heading"
                    )}
                  >
                    {role === "recruiter" && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute inset-0 bg-surface shadow-sm rounded-md"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">Recruiter</span>
                  </button>
                </motion.div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${mode}-${role}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  {mode === "login" ? (
                    <LoginForm />
                  ) : role === "candidate" ? (
                    <SignupWizard />
                  ) : (
                    <RecruiterSignupWizard />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-2 text-text-muted">Or</span>
                </div>
              </div>

              <div className="text-center">
                {mode === "login" ? (
                  <p className="text-sm text-text-muted">
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-text-muted">
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Log in
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
