interface SlackAlertPayload {
  title: string;
  message: string;
  fields?: Record<string, unknown>;
}

export async function sendSlackAlert(payload: SlackAlertPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fields = Object.entries(payload.fields || {}).map(([key, value]) => ({
    type: "mrkdwn",
    text: `*${key}:* ${String(value)}`,
  }));

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: payload.title,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${payload.title}*\n${payload.message}`,
            },
          },
          ...(fields.length
            ? [
                {
                  type: "section",
                  fields,
                },
              ]
            : []),
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Slack alert failed", response.status, body);
    }
  } catch (error) {
    console.error("Slack alert request error", error);
  }
}
