import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

if (process.env.NEXT_RUNTIME === "nodejs") {
    process.env.OTEL_SERVICE_NAME = "getoffer-web";

    const sdk = new NodeSDK({
        traceExporter: new OTLPTraceExporter({
            url: "https://api.honeycomb.io/v1/traces",
            headers: {
                "x-honeycomb-team": process.env.HONEYCOMB_API_KEY || "",
            },
        }),
        instrumentations: [
            getNodeAutoInstrumentations({
                "@opentelemetry/instrumentation-fs": { enabled: false },
                "@opentelemetry/instrumentation-net": { enabled: false },
                "@opentelemetry/instrumentation-dns": { enabled: false },
            }),
        ],
    });

    try {
        sdk.start();
        console.log("✅ OpenTelemetry initialized (Honeycomb Direct)");
    } catch (error) {
        console.error("❌ Error initializing OpenTelemetry:", error);
    }

    process.on("SIGTERM", () => {
        sdk.shutdown()
            .then(() => console.log("OTel SDK terminated"))
            .catch((error) => console.log("Error terminating OTel SDK", error))
            .finally(() => process.exit(0));
    });
}