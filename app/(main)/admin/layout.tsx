import type { Metadata } from "next";
import { getCurrentSession } from "@/lib/auth/current-user";
import { isAdminEmail } from "@/lib/auth/admin";
import { AdminShell } from "@/features/admin/dashboard/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side gate: non-admins never receive the shell (or the admin email
  // allowlist embedded in it) at all.
  const session = await getCurrentSession();
  const email = (session?.user as { email?: string } | undefined)?.email ?? "";
  if (!isAdminEmail(email)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-section px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-heading">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            This area is restricted. If you believe you should have access,
            contact the maintainer.
          </p>
        </div>
      </main>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
