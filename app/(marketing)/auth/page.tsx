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
    <main className="flex flex-col min-h-screen items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl opacity-50" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-slate-100/40 blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md z-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-slate-500 text-sm">
            {mode === "login"
              ? "Enter your credentials to access your account"
              : "Join thousands of professionals finding their dream jobs"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Card className="border-slate-200/60 shadow-xl shadow-blue-900/5 backdrop-blur-sm bg-white/90">
              <CardContent className="p-6 pt-8 space-y-6">

                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-lg mb-6">
                    <button
                      onClick={() => setRole("candidate")}
                      className={cn(
                        "text-sm font-medium py-2 rounded-md transition-all duration-200",
                        role === "candidate"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Candidate
                    </button>
                    <button
                      onClick={() => setRole("recruiter")}
                      className={cn(
                        "text-sm font-medium py-2 rounded-md transition-all duration-200",
                        role === "recruiter"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Recruiter
                    </button>
                  </div>
                )}

                {mode === "login" ? (
                  <LoginForm />
                ) : role === "candidate" ? (
                  <SignupWizard />
                ) : (
                  <RecruiterSignupWizard />
                )}

                <div className="relative pt-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">Or</span>
                  </div>
                </div>

                <div className="text-center">
                  {mode === "login" ? (
                    <p className="text-sm text-slate-600">
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={() => setMode("signup")}
                        className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Already have an account?{" "}
                      <button
                        onClick={() => setMode("login")}
                        className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                      >
                        Log in
                      </button>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}