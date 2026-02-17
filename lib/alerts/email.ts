interface EmailAlertPayload {
  subject: string;
  body: string;
  tags?: Record<string, unknown>;
}

export async function sendEmailAlert(payload: EmailAlertPayload): Promise<void> {
  const webhookUrl = process.env.ALERT_EMAIL_WEBHOOK_URL;
  const recipients = (process.env.ALERT_EMAIL_RECIPIENTS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!webhookUrl || recipients.length === 0) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: recipients,
        subject: payload.subject,
        body: payload.body,
        tags: payload.tags || {},
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Email alert failed", response.status, body);
    }
  } catch (error) {
    console.error("Email alert request error", error);
  }
}
