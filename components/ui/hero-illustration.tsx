"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Building2, Briefcase, Mail } from "lucide-react";

export function HeroIllustration() {
  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-slate-950 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 select-none flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[380px] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-10 left-6 p-1 bg-slate-900 rounded-2xl">
            <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center text-3xl">
              👨‍💻
            </div>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Alex Chen</h3>
              <p className="text-slate-400 text-sm">Senior Systems Engineer</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Verified
              </span>
            </motion.div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Verified History
            </div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <div className="p-2 bg-white rounded-lg">
                <Building2 className="w-4 h-4 text-slate-900" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">Stripe</div>
                <div className="text-xs text-slate-500">
                  L4 Software Engineer
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <div className="p-2 bg-white rounded-lg">
                <Briefcase className="w-4 h-4 text-slate-900" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">Airbnb</div>
                <div className="text-xs text-slate-500">Senior Frontend</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0, y: -20 }}
        animate={{ x: 30, opacity: 1, y: 0 }}
        transition={{ delay: 1.8, type: "spring" }}
        className="absolute top-1/4 right-[15%] z-20 w-80 bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-200 p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex justify-between items-center w-full mb-1">
              <h4 className="text-sm font-bold text-slate-900">
                New Interview Request
              </h4>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-900">Linear</span> wants
              to skip the phone screen based on your Stripe history.
            </p>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-medium text-center rounded-md shadow-sm">
                Accept
              </div>
              <div className="flex-1 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium text-center rounded-md">
                Decline
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-6 -left-2 w-3 h-3 bg-white border-l border-b border-slate-200 transform rotate-45" />
      </motion.div>

      <motion.div
        initial={{ top: "30%", opacity: 0 }}
        animate={{ top: ["30%", "60%", "30%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute left-[50%] -translate-x-[50%] w-[380px] h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20 blur-[2px]"
      />
    </div>
  );
}
