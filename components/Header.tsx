"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth/auth-client";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "@/components/providers";

export function Header() {
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
    try {
      // signOut resolves with { error } instead of throwing, so also bound
      // the wait: a stalled request must not trap the user on this page.
      const timeout = new Promise((resolve) => setTimeout(resolve, 4000));
      await Promise.race([signOut(), timeout]);
    } catch (err) {
      console.warn("SignOut error:", err);
    } finally {
      window.location.href = "/auth";
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const user = session?.user;
  const userRole = (user as { role?: string })?.role;
  const isLoggedIn = !!user && !isSigningOut;

  const landingLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#features", label: "Features" },
  ];

  const recruiterLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/recruiter/candidates", label: "Search Candidates", icon: Search },
  ];

  const candidateLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  // The admin link is visible to every signed-in user; the /admin layout
  // enforces the real gate server-side, so non-admins get a 403 page.
  // This keeps the admin allowlist itself out of the client bundle.
  const adminLinks = [
    { href: "/admin", label: "Admin", icon: ShieldCheck },
  ];

  const activeNavLinks = isLoggedIn
    ? [
        ...(userRole === "recruiter" ? recruiterLinks : candidateLinks),
        ...adminLinks,
      ]
    : landingLinks;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "h-16 bg-background/85 backdrop-blur-xl border-b border-border/70 shadow-sm"
            : "h-20 bg-background/40 backdrop-blur-md border-b border-border/20",
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-px transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="gradient-divider" />
        </div>

        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-2 font-[var(--font-display)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary/50" />
            GetFinalOffer
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              {isLoggedIn
                ? activeNavLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "relative py-1 transition-colors flex items-center gap-1.5",
                          isActive
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span>{link.label}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </Link>
                    );
                  })
                : landingLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative py-1 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </Link>
                  ))}
            </div>

            {/* Theme Switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              aria-label={
                resolvedTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            {/* Auth Actions */}
            {isPending ? (
              <div className="h-9 w-24 rounded-full bg-muted/60 animate-pulse hidden md:inline-block" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="rounded-full text-xs font-medium border-border/80 hover:border-muted-foreground hover:bg-muted/80 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  size="sm"
                  className="hidden md:inline-flex rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 px-5 h-9 text-xs font-semibold cursor-pointer"
                >
                  <Link href="/auth">
                    <span>Get Started</span>
                  </Link>
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
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
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
                {activeNavLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04 }}
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

                <div className="pt-4 border-t border-border/60">
                  {isLoggedIn ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full rounded-xl h-11 text-sm font-medium"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 h-11 text-sm font-medium cursor-pointer"
                    >
                      <Link
                        href="/auth"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
