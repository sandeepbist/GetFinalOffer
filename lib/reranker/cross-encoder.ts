import { AutoTokenizer, AutoModelForSequenceClassification, env } from "@xenova/transformers";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";

// Configure Transformers.js for serverless / edge runtime
env.allowLocalModels = false;
env.useBrowserCache = false;
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    // Vercel serverless functions have write access only in /tmp
    env.cacheDir = "/tmp/.transformers_cache";
}

const MODEL_ID = "Xenova/ms-marco-TinyBERT-L-2-v2";

interface RerankerInstance {
    tokenizer: (queries: string[], options: Record<string, unknown>) => Promise<unknown>;
    model: (inputs: unknown) => Promise<{ logits: { data: ArrayLike<number> } }>;
}

let rerankerPromise: Promise<RerankerInstance | null> | null = null;

async function initReranker(): Promise<RerankerInstance | null> {
    try {
        const tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
        const model = await AutoModelForSequenceClassification.from_pretrained(MODEL_ID, {
            quantized: true,
        });
        return { tokenizer, model };
    } catch (error) {
        console.warn("⚠️ Cross-Encoder model initialization failed, using fallback:", error);
        return null;
    }
}

export function getReranker(): Promise<RerankerInstance | null> {
    if (!rerankerPromise) {
        rerankerPromise = initReranker();
    }
    return rerankerPromise;
}

/**
 * Builds an information-dense passage text from a candidate profile for cross-attention
 */
export function buildCandidatePassage(c: CandidateSummaryDTO): string {
    const parts: string[] = [];
    if (c.title) parts.push(c.title);
    if (c.skills && c.skills.length > 0) parts.push(`Skills: ${c.skills.slice(0, 8).join(", ")}`);
    if (c.yearsExperience) parts.push(`${c.yearsExperience} yrs experience`);
    if (c.bio) {
        // Use first 150 chars of bio
        parts.push(c.bio.substring(0, 150).replace(/\s+/g, " ").trim());
    } else if (c.matchHighlight) {
        parts.push(c.matchHighlight.substring(0, 150).replace(/\s+/g, " ").trim());
    }
    return parts.join(" | ");
}

/**
 * Sigmoid function to map raw model logit to a 0.0 - 1.0 probability
 */
function sigmoid(val: number): number {
    return 1 / (1 + Math.exp(-val));
}

/**
 * High-performance batch cross-encoder reranker
 * Evaluates all candidates in a single tensor pass in ~10-20ms
 */
export async function crossEncoderRerank(
    query: string,
    candidates: CandidateSummaryDTO[],
    timeoutMs = 400
): Promise<CandidateSummaryDTO[]> {
    if (!query.trim() || candidates.length === 0) {
        return candidates;
    }

    try {
        const rerankExecution = async (): Promise<CandidateSummaryDTO[]> => {
            const instance = await getReranker();
            if (!instance) {
                return candidates;
            }

            const { tokenizer, model } = instance;
            const passages = candidates.map(buildCandidatePassage);
            const queries = Array(passages.length).fill(query);

            const inputs = await tokenizer(queries, {
                text_pair: passages,
                padding: true,
                truncation: true,
                max_length: 256,
            });

            const { logits } = await model(inputs);
            const scores: number[] = Array.from(logits.data).map((logit) => sigmoid(Number(logit)));

            // Attach cross-encoder scores (blending 70% cross-encoder + 30% prior score for stability)
            const reranked = candidates.map((c, idx) => {
                const ceScore = scores[idx] ?? 0;
                const priorScore = c.matchScore ? (c.matchScore <= 1 ? c.matchScore : c.matchScore / 100) : 0.5;
                const blended = (ceScore * 0.75) + (priorScore * 0.25);

                return {
                    ...c,
                    matchScore: Math.round(blended * 100),
                    crossEncoderScore: ceScore,
                };
            });

            // Sort descending by match score
            return reranked.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        };

        let timer: NodeJS.Timeout | undefined;
        const timeoutPromise = new Promise<CandidateSummaryDTO[]>((resolve) => {
            timer = setTimeout(() => {
                console.warn(`⚠️ Cross-Encoder timed out (${timeoutMs}ms), returning baseline candidates`);
                resolve(candidates);
            }, timeoutMs);
        });

        try {
            return await Promise.race([rerankExecution(), timeoutPromise]);
        } finally {
            if (timer) clearTimeout(timer);
        }
    } catch (err) {
        console.warn("⚠️ Cross-Encoder reranking error, falling back:", err);
        return candidates;
    }
}
