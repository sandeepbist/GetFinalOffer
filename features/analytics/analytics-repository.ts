import { AnalyticsEventDTO } from "./analytics-validation";

const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000;

class AnalyticsRepository {
    private queue: AnalyticsEventDTO[] = [];
    private flushTimer: NodeJS.Timeout | null = null;

    constructor() {
        if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", () => {
                this.flush(true);
            });
        }
    }

    public track(event: AnalyticsEventDTO): void {
        this.queue.push(event);

        if (this.queue.length >= BATCH_SIZE) {
            this.flush();
        }
        else if (!this.flushTimer) {
            this.flushTimer = setTimeout(() => {
                this.flush();
            }, FLUSH_INTERVAL);
        }
    }

    private async flush(useBeacon = false): Promise<void> {
        if (this.queue.length === 0) return;

        const eventsToSend = [...this.queue];
        this.queue = [];

        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }

        try {
            const body = JSON.stringify(eventsToSend);

            if (useBeacon && navigator.sendBeacon) {
                const blob = new Blob([body], { type: "application/json" });
                navigator.sendBeacon("/api/analytics/batch", blob);
            } else {
                await fetch("/api/analytics/batch", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: body,
                    keepalive: true,
                });
            }
        } catch (error) {
            console.error("Failed to flush analytics batch", error);
        }
    }
}

export const analyticsRepository = new AnalyticsRepository();