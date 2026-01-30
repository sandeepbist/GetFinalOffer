"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth/auth-client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  if (pathname.startsWith("/auth")) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  const isLoggedInView = !!session?.user || isSigningOut;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60"
          : "h-24 bg-transparent border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-slate-900 hover:text-blue-600 transition-colors"
        >
          GetFinalOffer
        </Link>

        <nav className="flex items-center gap-6">
          {isPending ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20 bg-slate-200/50" />
              <Skeleton className="h-9 w-24 rounded-full bg-slate-200/50" />
            </div>
          ) : (
            <>
              {!isLoggedInView && (
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                  <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">
                    How it Works
                  </Link>
                  <Link href="#features" className="hover:text-slate-900 transition-colors">
                    Features
                  </Link>
                </div>
              )}

              {!isLoggedInView ? (
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-6 h-10 text-sm font-medium"
                  >
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="rounded-full text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </Button>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}