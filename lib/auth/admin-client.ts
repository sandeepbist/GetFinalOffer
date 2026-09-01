/**
 * Client-safe mirror of lib/auth/admin.ts. The logic is duplicated because
 * the server module carries the "server-only" guard; keep both in sync.
 */
export function isAdminEmail(email: string): boolean {
  if (typeof window === "undefined") return false;

  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (!raw) return false;

  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  return raw
    .split(/[\s,]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}
