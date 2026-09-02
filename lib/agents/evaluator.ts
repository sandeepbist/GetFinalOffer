import OpenAI from "openai";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";
import { createCircuitBreaker } from "@/lib/resilience";
import { buildCandidatePassage } from "@/lib/reranker/cross-encoder";

const openai = new OpenAI();

async function evaluateCandidatesRaw(
    query: string,
    candidates: CandidateSummaryDTO[]
): Promise<CandidateSummaryDTO[]> {
    if (candidates.length === 0) return [];

    // Evaluate every candidate on the page with the same information-dense
    // representation the cross-encoder uses, so both rankers judge alike.
    const candidatesContext = candidates
        .map((c) => `ID: ${c.id} | ${buildCandidatePassage(c)}`)
        .join("\n");

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a Ranking Expert.
          1. Assign a relevance score (0-100) based on the Query: "${query}".
          2. Write a brutally honest 1-sentence reason.

          Format JSON: { "evaluations": { "candidate_id": { "score": 95, "reason": "Reasoning here." } } }`
            },
            { role: "user", content: candidatesContext }
        ],
        response_format: { type: "json_object" },
        temperature: 0,
        max_tokens: 1000,
    });

    const evaluations = JSON.parse(completion.choices[0].message.content || "{}").evaluations || {};

    // Annotate only: the cross-encoder already produced the final ordering,
    // and a raw 0-100 LLM score with no position normalization must not
    // re-sort it. aiReasoning is the recruiter-facing insight; the score is
    // kept for display where one exists.
    return candidates.map(c => {
        const evalData = evaluations[c.id];
        if (evalData) {
            return {
                ...c,
                matchScore: evalData.score,
                aiReasoning: evalData.reason
            };
        }
        return c;
    });
}

const breaker = createCircuitBreaker(evaluateCandidatesRaw, "evaluator-agent");

export class EvaluatorAgent {
    static async evaluateCandidates(
        query: string,
        candidates: CandidateSummaryDTO[]
    ): Promise<CandidateSummaryDTO[]> {
        try {
            return await breaker.fire(query, candidates);
        } catch (err) {
            console.warn("Evaluator agent failed. Returning raw candidates.", err);
            return candidates;
        }
    }
}
