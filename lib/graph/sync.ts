import { graphSyncQueue } from "@/lib/queue";

export interface GraphSyncExtractedSkill {
  name: string;
  confidence: number;
  evidence?: string;
  evidenceType?: string;
}

export interface GraphSyncJobPayload {
  userId: string;
  reason: "candidate_profile_update" | "resume_ingestion" | "manual";
  extractedSkills?: GraphSyncExtractedSkill[];
}

export async function queueGraphSync(payload: GraphSyncJobPayload): Promise<void> {
  try {
    await graphSyncQueue.add("sync-candidate-graph", payload, {
      jobId: `graph-sync:${payload.userId}`,
      removeOnComplete: true,
      removeOnFail: { count: 50 },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("already exists")) {
      console.error("Failed to queue graph sync", error);
    }
  }
}
