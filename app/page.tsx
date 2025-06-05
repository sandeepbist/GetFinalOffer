"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus,
  Building,
  ChevronRight,
  Sparkles,
  Check,
  Users,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="space-y-24 font-sans text-gray-800">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
          <div className="space-y-6">
            <Badge className="tracking-wide text-sm font-light">
              Find your perfect match
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Land Your Dream Job With Confidence
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 max-w-prose">
              GetOffer helps you discover opportunities that align perfectly
              with your skills and experience. Apply in one click and track
              everything—all in one beautiful dashboard.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button asChild>
                <Link
                  href="/auth/signup"
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Join as Candidate</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href="/auth/signup"
                  className="flex items-center space-x-2"
                >
                  <Building className="h-5 w-5" />
                  <span>Join as Recruiter</span>
                </Link>
              </Button>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              Already have an account?
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-100" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-100" />
            <div className="relative z-10 w-full max-w-md">
              <Image
                src="/hunt.svg"
                alt="Job search illustration"
                width={600}
                height={400}
                className="rounded-xl shadow-lg border border-gray-200"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Companies", value: "500+" },
            { label: "Jobs Posted", value: "10k+" },
            { label: "Candidates", value: "25k+" },
            { label: "Successful Hires", value: "5k+" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-semibold text-blue-600">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why choose GetOffer?</h2>
          <p className="mt-2 text-gray-600 text-lg leading-relaxed">
            Cutting-edge matching algorithms, one-tap applications, and a
            comprehensive dashboard—all built to make your job search or hiring
            process as smooth as possible.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <div className="h-1 bg-blue-600 w-full" />
            <CardContent>
              <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl text-center font-semibold mb-2">
                Smart Matching
              </h3>
              <p className="text-gray-600 text-center">
                Our algorithm learns your strengths and suggests roles that
                actually fit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <div className="h-1 bg-green-500 w-full" />
            <CardContent>
              <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl text-center font-semibold mb-2">
                One-Tap Apply
              </h3>
              <p className="text-gray-600 text-center">
                Apply to multiple jobs with a single tap after setting up your
                profile just once.
              </p>
            </CardContent>
          </Card>

          <Card>
            <div className="h-1 bg-purple-500 w-full" />
            <CardContent>
              <div className="bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                Unified Dashboard
              </h3>
              <p className="text-gray-600 text-center">
                Track applications, messages, and analytics in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold">What Our Users Say</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Real feedback from real people who found success with GetOffer.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Alex Johnson",
              role: "Software Engineer",
              photo: "/avatar.jpg",
              feedback:
                "GetOffer helped me land my dream role at a top tech firm!",
            },
            {
              name: "Maria Garcia",
              role: "Product Manager",
              photo: "/avatar.jpg",
              feedback:
                "The matching algorithm saved me so much time—I found my perfect job within days.",
            },
            {
              name: "David Lee",
              role: "UX Designer",
              photo: "/avatar.jpg",
              feedback:
                "I love how everything’s in one dashboard. It’s organized and intuitive.",
            },
          ].map((t) => (
            <Card key={t.name}>
              <CardContent>
                <div className="flex items-center mb-3">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  &ldquo;{t.feedback}&rdquo;
                </p>
                <div className="mt-4 flex justify-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="uppercase tracking-wide font-medium">
              Ready to get started?
            </Badge>
            <h2 className="text-4xl font-bold leading-snug">
              Join thousands of professionals on GetOffer today.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sign up now and take the next big step in your career journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link
                  href="/candidate-registration"
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Get Started</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href="/learn-more"
                  className="flex items-center space-x-2"
                >
                  <ChevronRight className="h-5 w-5" />
                  <span>Learn More</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-blue-100" />
            <Image
              src="/team.svg"
              alt="Join us illustration"
              width={500}
              height={350}
              className="relative z-10 rounded-xl shadow-lg border border-gray-200"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
