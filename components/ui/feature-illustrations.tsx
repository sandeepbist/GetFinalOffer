"use client";

import { motion } from "framer-motion";

export function SpeedGraph() {
  return (
    <div className="relative w-full h-full flex items-end justify-center px-8 pb-0 overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="flex items-end gap-3 w-full h-32 z-10 relative mb-0">
        <div className="w-full h-12 bg-slate-200 rounded-t-md border-t border-x border-slate-300 relative group">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Avg
          </div>
        </div>
        <div className="w-full h-20 bg-slate-300 rounded-t-md border-t border-x border-slate-400" />

        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
          className="w-full bg-blue-600 rounded-t-md relative group shadow-xl border-t border-x border-blue-500"
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/30 rounded-full" />

          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-100 transition-all whitespace-nowrap z-20">
            70% Faster
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function PrivacyShield() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 to-transparent" />

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-32 h-32 border border-blue-500/30 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute w-32 h-32 border border-blue-500/20 rounded-full"
      />

      <div className="relative z-10 w-20 h-24 bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl shadow-2xl flex items-center justify-center border border-slate-700 group hover:border-blue-500 transition-colors duration-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors duration-500"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
    </div>
  );
}

export function NetworkMap() {
  return (
    <div className="relative w-full h-full p-8 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="grid grid-cols-2 gap-4 h-full relative z-10">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-blue-300 transition-colors cursor-default"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i === 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
            >
              <div className="w-2 h-2 rounded-full bg-current" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
              <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
