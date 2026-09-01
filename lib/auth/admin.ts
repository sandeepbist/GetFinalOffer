import "server-only";

/**
 * Admin access is granted by an env allowlist of email addresses
 * (ADMIN_EMAILS, comma- or whitespace-separated). This avoids a new role
 * column and migration: admins are trusted operators, not user-editable
 * accounts.
 */
export function isAdminEmail(email: string): boolean {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return false;

  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  return raw
    .split(/[\s,]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}
