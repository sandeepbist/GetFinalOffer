import { NextRequest, NextResponse } from "next/server";
import { bufferAnalyticsBatch } from "@/features/analytics/analytics-data-access";
import { AnalyticsBatchSchema } from "@/features/analytics/analytics-validation";

export async function POST(req: NextRequest) {
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

        await bufferAnalyticsBatch(validation.data);

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown API Error";
        console.error("🔥 Analytics API Ingestion Failed:", errorMessage);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}