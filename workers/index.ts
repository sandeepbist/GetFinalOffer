import "dotenv/config";
import { worker as resumeWorker } from "./resume-worker";
import { runAnalyticsWorker, stopAnalyticsWorker } from "./analytics-worker";

console.log("🔧 Master Worker Process Starting...");

runAnalyticsWorker().catch((err) => {
    console.error("❌ Analytics Worker crashed:", err);
});

const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    try {
        await stopAnalyticsWorker();

        console.log("⏳ Closing Resume Worker...");
        await resumeWorker.close();
        console.log("✅ Resume Worker Closed.");

        console.log("👋 All workers stopped. Exiting.");
        process.exit(0);
    } catch (err) {
        console.error("💥 Error during shutdown:", err);
        process.exit(1);
    }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("🔥 Unhandled Rejection at:", promise, "reason:", reason);
});

console.log("✅ Worker Manager Initialized. Waiting for jobs...");