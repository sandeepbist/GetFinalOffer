import OpenAI from "openai";
import { createCircuitBreaker } from "./resilience"; //

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbeddingsBatchUnsafe(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts.map((t) => t.replace(/\n/g, " ")),
  });
  return response.data.map((item) => item.embedding);
}

const embeddingBreaker = createCircuitBreaker(generateEmbeddingsBatchUnsafe, "openai-embeddings");

export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  return embeddingBreaker.fire(texts);
}

async function generateEmbeddingUnsafe(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, " "),
  });
  return response.data[0].embedding;
}

const singleEmbeddingBreaker = createCircuitBreaker(generateEmbeddingUnsafe, "openai-single-embedding");

export async function generateEmbedding(text: string): Promise<number[]> {
  return singleEmbeddingBreaker.fire(text);
}