import "server-only";

/**
 * Transactional email via Resend's REST API (plain fetch — no SDK).
 *
 * Degrades silently: when RESEND_API_KEY (or the from-address env) is not
 * configured, sends become a no-op with a debug log. Email must never
 * block or fail a request path; the in-app surfaces remain the source of
 * truth for state.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail({ to, subject, text }: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.debug(`[Email] Not configured; would send "${subject}" to ${to}`);
    return;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn(`[Email] Resend rejected "${subject}" (${response.status}):`, body.slice(0, 200));
    }
  } catch (error) {
    console.warn(`[Email] Send failed for "${subject}":`, error);
  }
}

export async function notifyVerificationDecision(params: {
  recipientEmail: string;
  recipientName: string | null;
  scope: string;
  approved: boolean;
  note: string | null;
}): Promise<void> {
  const firstName = params.recipientName?.split(" ")[0] || "there";
  const target =
    params.scope === "candidate_profile"
      ? "your profile"
      : "an interview-progress entry";
  const outcome = params.approved ? "approved" : "not approved";
  const decisionNote = params.note?.trim()
    ? `\n\nReviewer note: ${params.note.trim()}`
    : "";

  await sendEmail({
    to: params.recipientEmail,
    subject: `Your verification request was ${params.approved ? "approved" : "reviewed"}`,
    text: `Hi ${firstName},

Your verification request for ${target} has been reviewed and ${outcome}.${decisionNote}

You can see the current status on your dashboard.

— GetFinalOffer`,
  });
}

export async function notifyCandidateInvite(params: {
  candidateEmail: string;
  candidateName: string | null;
  recruiterName: string | null;
  organisationName: string | null;
}): Promise<void> {
  const firstName = params.candidateName?.split(" ")[0] || "there";
  const fromWho = params.recruiterName
    ? `${params.recruiterName}${params.organisationName ? ` at ${params.organisationName}` : ""}`
    : "a recruiter";

  await sendEmail({
    to: params.candidateEmail,
    subject: "You have a new invite on GetFinalOffer",
    text: `Hi ${firstName},

${fromWho} invited you to connect on GetFinalOffer.

You can review and respond to the invite on your dashboard.

— GetFinalOffer`,
  });
}
