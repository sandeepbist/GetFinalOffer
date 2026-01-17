import "dotenv/config";
import { processAnalyticsBatch } from "@/features/analytics/analytics-data-access";

const BATCH_SIZE = 50;
const MIN_POLL_INTERVAL = 10000;
const MAX_POLL_INTERVAL = 60000;
const ERROR_BACKOFF = 5000;

let shouldRun = true;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runAnalyticsWorker() {
    console.log("📊 Analytics Worker Loop Started (Adaptive Backoff Enabled)");

    let currentBackoff = MIN_POLL_INTERVAL;

    while (shouldRun) {
        try {
            const processedCount = await processAnalyticsBatch(BATCH_SIZE);

            if (processedCount > 0) {

                console.log(`✅ Analytics: Processed ${processedCount} events`);
                currentBackoff = MIN_POLL_INTERVAL;

                await sleep(50);
            } else {
                await sleep(currentBackoff);
                currentBackoff = Math.min(currentBackoff * 2, MAX_POLL_INTERVAL);
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            console.error("🔥 Analytics Worker Critical Error:", msg);
            await sleep(ERROR_BACKOFF);
        }
    }

    console.log("🛑 Analytics Worker Loop Exited Gracefully.");
}

export const stopAnalyticsWorker = async () => {
    console.log("⚠️ Stopping Analytics Worker...");
    shouldRun = false;
};

if (require.main === module) {
    runAnalyticsWorker();
}
