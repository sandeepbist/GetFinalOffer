import { NextRequest, NextResponse } from "next/server";
import { bufferAnalyticsBatch } from "@/features/analytics/analytics-data-access";
import { AnalyticsBatchSchema } from "@/features/analytics/analytics-validation";
import { getCurrentSession } from "@/lib/auth/current-user";

export async function POST(req: NextRequest) {
    const session = await getCurrentSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: unknown = await req.json();

        const validation = AnalyticsBatchSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Invalid Analytics Batch Format",
                    details: validation.error.format()
                },
                { status: 400 }
            );
        }

        // A single request must not be able to flood the worker buffer.
        if (validation.data.length > 100) {
            return NextResponse.json(
                { error: "Batch too large; maximum 100 events" },
                { status: 413 }
            );
        }

        // The session user is the authoritative author of every event; the
        // client-supplied userId field is never trusted for attribution.
        const authenticatedEvents = validation.data.map((event) => ({
            ...event,
            userId: session.user.id,
        }));

        await bufferAnalyticsBatch(authenticatedEvents);

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown API Error";
        console.error("Analytics API Ingestion Failed:", errorMessage);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
