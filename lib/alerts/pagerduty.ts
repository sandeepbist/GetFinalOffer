interface PagerDutyAlertPayload {
  summary: string;
  severity: "critical" | "error" | "warning" | "info";
  source?: string;
  customDetails?: Record<string, unknown>;
}

export async function sendPagerDutyAlert(payload: PagerDutyAlertPayload): Promise<void> {
  const routingKey = process.env.PAGERDUTY_ROUTING_KEY;
  if (!routingKey) return;

  try {
    const response = await fetch("https://events.pagerduty.com/v2/enqueue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routing_key: routingKey,
        event_action: "trigger",
        payload: {
          summary: payload.summary,
          severity: payload.severity,
          source: payload.source || "getoffer-graph",
          custom_details: payload.customDetails || {},
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("PagerDuty alert failed", response.status, body);
    }
  } catch (error) {
    console.error("PagerDuty alert request error", error);
  }
}
