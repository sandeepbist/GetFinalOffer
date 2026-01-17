import "dotenv/config";
import { Job } from "bullmq";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import db from "@/db";
import { gfoCandidateResumeChunksTable } from "@/db/schemas";
import { generateEmbeddingsBatch } from "@/lib/ai";
import { extractTextFromPDF } from "@/lib/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createResumeWorker } from "@/lib/queue";

console.log("Worker Listening for Jobs...");

const processResumeJob = async (job: Job) => {
  const { userId, fileUrl, bio } = job.data;
  console.log(`[${job.id}] Processing resume for User: ${userId}`);

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to download PDF");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = await extractTextFromPDF(buffer);
    if (resumeText.length > 20000) resumeText = resumeText.slice(0, 20000);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const fullContext = `Bio: ${bio || ""}\n\nResume: ${resumeText}`;
    const docs = await splitter.createDocuments([fullContext]);
    const chunkTexts = docs.map((d) => d.pageContent);

    const embeddings = await generateEmbeddingsBatch(chunkTexts);

    await db.transaction(async (tx) => {
      await tx
        .delete(gfoCandidateResumeChunksTable)
        .where(eq(gfoCandidateResumeChunksTable.candidateUserId, userId));

      if (chunkTexts.length > 0) {
        const chunksData = chunkTexts.map((text, idx) => ({
          id: randomUUID(),
          candidateUserId: userId,
          chunkContent: text,
          chunkIndex: idx,
          embedding: embeddings[idx],
        }));
        await tx.insert(gfoCandidateResumeChunksTable).values(chunksData);
      }
    });

    console.log(`[${job.id}] Done`);
    return { success: true };
  } catch (error) {
    console.error(`[${job.id}] Failed:`, error);
    throw error;
  }
};

const worker = createResumeWorker(processResumeJob);

export { worker };