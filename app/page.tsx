"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap, Globe, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroIllustration } from "@/components/ui/hero-illustration";
import {
  SpeedGraph,
  PrivacyShield,
  NetworkMap,
} from "@/components/ui/feature-illustrations";

const FadeIn = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white -z-10" />

      <div className="max-w-7xl mx-auto px-6 text-center">
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 hover:border-blue-200 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-sm font-semibold text-slate-700">
              The new standard for engineering hiring
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 mb-8 leading-[1.1] md:leading-[1.05]">
            Stop Interviewing. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
              Start Negotiating.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3} className="max-w-2xl mx-auto mb-10">
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Verify your interview history once. Top companies skip the technical
            rounds and compete for you with direct offers.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full text-base bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 font-semibold"
              asChild
            >
              <Link href="/auth">
                Verify My Profile <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full text-base border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
              asChild
            >
              <Link href="#how-it-works">How it Works</Link>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.6} className="max-w-6xl mx-auto px-2 md:px-0">
          <HeroIllustration />
        </FadeIn>
      </div>
    </section>
  );
}

function SocialProof() {
  const logos = [
    "Linear",
    "Vercel",
    "Stripe",
    "Airbnb",
    "Coinbase",
    "OpenAI",
    "Rippling",
  ];
  return (
    <section className="py-12 border-y border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">
          Trusted by Engineering Teams At
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, i) => (
            <span
              key={i}
              className="text-2xl font-bold text-slate-400 select-none"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    {
      num: "01",
      title: "Log Your History",
      desc: "Add your past interview results from top companies (e.g. L5 at Google). We support data from the last 24 months.",
    },
    {
      num: "02",
      title: "Get Verified",
      desc: "Upload offer letters or feedback emails. Our system cryptographically verifies your claims in 24 hours.",
    },
    {
      num: "03",
      title: "Receive Offers",
      desc: "Verified profiles skip the queue. Recruiters browse by verified skills and send final round invites.",
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <Badge
            variant="outline"
            className="mb-4 border-blue-200 text-blue-700 bg-blue-50"
          >
            How It Works
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900">
            Three steps to your next role.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10" />

          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.2} className="relative bg-white pt-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xl font-bold text-blue-600 mb-6">
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {s.title}
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {s.desc}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoGrid() {
  return (
    <section id="features" className="py-32 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Everything you need to <br /> skip the whiteboard.
          </h2>
          <p className="text-xl text-slate-600">
            We built the infrastructure to make your engineering reputation
            portable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">
          <FadeIn className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-10 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
            <div className="relative z-20">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">
                Instant Qualification
              </h3>
              <p className="text-lg text-slate-600 max-w-md font-medium">
                Don't waste 40 hours on take-home assignments. Prove your skills
                once and apply to 50+ companies instantly.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[220px] z-10">
              <SpeedGraph />
            </div>
          </FadeIn>

          <FadeIn
            delay={0.2}
            className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-10 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500"
          >
            <div className="relative z-20">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 mb-6">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Stealth Mode</h3>
              <p className="text-slate-300">
                Block your current employer. Control exactly who sees your
                verification data.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[220px] z-10">
              <PrivacyShield />
            </div>
          </FadeIn>

          <FadeIn
            delay={0.3}
            className="relative group overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-10 hover:border-blue-300 hover:shadow-xl transition-all duration-500"
          >
            <div className="relative z-20">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                <Globe className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Global Access
              </h3>
              <p className="text-slate-600 font-medium">
                Access remote opportunities from US and EU companies looking for
                verified talent.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[200px] z-10">
              <NetworkMap />
            </div>
          </FadeIn>

          <FadeIn
            delay={0.4}
            className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-700 text-white p-10 flex flex-col justify-between hover:shadow-xl transition-all duration-500"
          >
            <div className="relative z-10 max-w-xl">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 mb-6">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Verified History</h3>
              <p className="text-lg text-blue-50 leading-relaxed font-medium">
                We validate your previous interview performance and employment
                history cryptographically, creating a tamper-proof record of
                your excellence.
              </p>
              <Button
                variant="secondary"
                className="mt-8 rounded-full bg-white text-blue-700 hover:bg-blue-50 border-none font-bold"
              >
                Learn about verification
              </Button>
            </div>
            <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Senior Engineer",
      company: "Ex-Stripe",
      text: "GetFinalOffer saved me roughly 20 hours of interviewing. I verified my status and got 3 offers in a week.",
    },
    {
      name: "Sarah Miller",
      role: "Frontend Lead",
      company: "Ex-Airbnb",
      text: "The privacy controls are a game changer. I could hunt for a new role without my current team finding out.",
    },
    {
      name: "James Wilson",
      role: "Staff Engineer",
      company: "Ex-Google",
      text: "I skip the technical screen for anyone verified on GetFinalOffer. It dramatically speeds up our time-to-hire.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Developers love us.
        </h2>
        <p className="text-slate-600 text-lg">
          Join 10,000+ engineers skipping the whiteboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
        {testimonials.map((t, i) => (
          <FadeIn
            key={i}
            delay={i * 0.1}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-lg text-slate-700 mb-8 leading-relaxed font-medium">
              "{t.text}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900">{t.name}</div>
                <div className="text-sm text-slate-500 font-medium">
                  {t.role} • {t.company}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-32 px-6 max-w-3xl mx-auto bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-lg">
          Everything you need to know about verification.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {[
          {
            q: "How do you verify my interview history?",
            a: "We use a combination of automated email parsing and manual verification. You upload proof (like offer letters or interview feedback emails) and our system validates the authenticity.",
          },
          {
            q: "Will my current employer know?",
            a: "Absolutely not. You can specifically block organizations from seeing your profile. By default, your profile is hidden from everyone until you explicitly apply or accept a contact request.",
          },
          {
            q: "Is this free for candidates?",
            a: "Yes, GetFinalOffer is 100% free for candidates. We make money by charging companies a fee when they successfully hire you.",
          },
        ].map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-slate-200 rounded-2xl px-6 data-[state=open]:bg-blue-50/50 data-[state=open]:border-blue-200 transition-all duration-300"
          >
            <AccordionTrigger className="text-lg font-bold py-6 hover:no-underline text-slate-900">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 pb-6 text-base leading-relaxed font-medium">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto rounded-[3rem] bg-blue-600 text-white text-center py-24 px-6 relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-white">
            Ready to claim your offer?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
            Create your profile in 2 minutes and start getting direct offers
            from top tech companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-16 px-12 rounded-full text-lg bg-white text-blue-600 hover:bg-blue-50 font-bold border-none shadow-xl"
              asChild
            >
              <Link href="/auth">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-slate-900">
            GetFinalOffer
          </span>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} GetFinalOffer Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="bg-white selection:bg-blue-100 selection:text-blue-900 min-h-screen">
      <Hero />
      <SocialProof />
      <Steps />
      <BentoGrid />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
