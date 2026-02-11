"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth/auth-client";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/components/providers";

export function Header() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const scrolledRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 20;
    if (next !== scrolledRef.current) {
      scrolledRef.current = next;
      setScrolled(next);
    }
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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isLoggedInView = !!session?.user || isSigningOut;

  const navLinks = [
    { href: "#how-it-works", label: "How it Works" },
    { href: "#features", label: "Features" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "sticky top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "h-16 bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-[0_8px_24px_-20px_var(--shadow)]"
            : "h-20 bg-transparent border-transparent",
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-px transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="gradient-divider" />
        </div>

        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-2 font-[var(--font-display)]"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            GetFinalOffer
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            {isPending ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            ) : (
              <>
                {!isLoggedInView && (
                  <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="relative py-1 hover:text-foreground transition-colors group cursor-pointer"
                      >
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </Link>
                    ))}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Moon className="h-5 w-5" aria-hidden="true" />
                  )}
                </Button>

                {!isLoggedInView ? (
                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="hidden md:inline-flex rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 px-6 h-10 text-sm font-medium cursor-pointer"
                    >
                      <Link href="/auth">Get Started</Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(true)}
                      className="md:hidden rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Open menu"
                    >
                      <Menu className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="rounded-full text-muted-foreground border-border hover:border-muted-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="font-bold text-lg text-foreground">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              <nav className="p-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 text-base font-medium text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="pt-4"
                >
                  <Button
                    asChild
                    className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 h-12 text-base font-medium cursor-pointer"
                  >
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
