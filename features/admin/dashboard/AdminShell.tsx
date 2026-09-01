"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { isAdminEmail } from "@/lib/auth/admin-client";
import { authClient } from "@/lib/auth/auth-client";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/verification", label: "Verifications", icon: ClipboardCheck },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/graph", label: "System", icon: Activity },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const userEmail = (session?.user as { email?: string } | undefined)?.email ?? "";
  const isAdmin = isAdminEmail(userEmail);

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileNavOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-text-muted hover:bg-highlight hover:text-heading"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  if (!isAdmin) {
    // Non-admins never see the shell; the API layer rejects them anyway.
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-section">
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
                Admin
              </p>
            </div>
            {nav}
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-16 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-semibold text-heading">Admin</p>
            <button
              onClick={() => setMobileNavOpen((open) => !open)}
              className="rounded-lg p-2 text-text-muted hover:bg-highlight"
              aria-label="Toggle admin navigation"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {mobileNavOpen && <div className="border-t border-border/70 p-3">{nav}</div>}
        </div>

        <main className="min-w-0 flex-1 pt-12 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
