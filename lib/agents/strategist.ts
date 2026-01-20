import OpenAI from "openai";
import { createCircuitBreaker } from "@/lib/resilience";

const openai = new OpenAI();

export interface SearchStrategy {
    originalQuery: string;
    expandedKeywords: string[];
    semanticFocus: string;
    seniorityLevel: "Junior" | "Mid" | "Senior" | "Lead" | "Any";
}

async function analyzeQueryRaw(query: string): Promise<SearchStrategy> {
    if (query.split(" ").length < 3) {
        return {
            originalQuery: query,
            expandedKeywords: [query],
            semanticFocus: query,
            seniorityLevel: "Any"
        };
    }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are an expert Technical Recruiter Assistant specializing in semantic search query expansion for candidate retrieval systems.

Your task: Transform vague or conversational recruiter queries into structured search strategies optimized for both keyword matching and vector similarity search.

OUTPUT FORMAT (strict JSON):
{
  "expandedKeywords": string[],  // 5-10 atomic technical terms
  "semanticFocus": string,        // One sentence describing abstract intent
  "seniorityLevel": string        // "Junior" | "Mid" | "Senior" | "Lead" | "Any"
}

EXPANSION RULES:

1. TECHNICAL SYNONYMS
   - Map colloquial terms to technical equivalents
   - Examples:
     * "frontend guy" → ["React", "Vue", "Angular", "TypeScript", "CSS"]
     * "backend wizard" → ["Node.js", "Python", "PostgreSQL", "APIs", "Microservices"]
     * "full stack" → ["React", "Node.js", "PostgreSQL", "REST APIs", "TypeScript"]

2. SKILL INFERENCE
   - Infer related skills from context
   - Examples:
     * "React developer" → ["React", "TypeScript", "Hooks", "Redux", "Next.js", "JavaScript"]
     * "ML engineer" → ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "Pandas"]
     * "DevOps person" → ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Jenkins"]

3. IMPLICIT REQUIREMENTS
   - Extract hidden requirements from vague language
   - Examples:
     * "someone who can scale systems" → ["Distributed Systems", "Caching", "Load Balancing", "Redis", "Microservices"]
     * "pixel perfectionist" → ["CSS", "Responsive Design", "UI/UX", "Figma", "Tailwind"]
     * "data person" → ["SQL", "Python", "Data Analysis", "Pandas", "Visualization", "ETL"]

4. SENIORITY DETECTION
   - Junior: "entry-level", "graduate", "0-2 years", "learning", "junior"
   - Mid: "3-5 years", "experienced", "independent", "mid-level"
   - Senior: "senior", "lead", "architect", "5+ years", "expert", "mentor"
   - Lead: "tech lead", "staff", "principal", "10+ years", "leadership"
   - Any: No seniority mentioned or ambiguous

5. KEYWORD QUALITY
   - Each keyword MUST be 1-3 words maximum
   - Use canonical names: "React" not "React.js", "PostgreSQL" not "Postgres"
   - Prioritize concrete technologies over abstract concepts
   - Include 2-3 "adjacent skills" for recall expansion
   - NO sentences, NO descriptions, ONLY technical terms

6. SEMANTIC FOCUS
   - One clear sentence describing the abstract hiring intent
   - Focus on CAPABILITIES not TECHNOLOGIES
   - Examples:
     * Query: "React dev" → "Frontend development with modern component-based frameworks"
     * Query: "backend ninja" → "Server-side development with scalable architecture design"
     * Query: "AI/ML person" → "Machine learning model development and deployment"

EXAMPLES:

Input: "senior react developer with 5 years experience"
Output: {
  "expandedKeywords": ["React", "TypeScript", "Next.js", "Redux", "Hooks", "JavaScript", "Node.js", "REST APIs"],
  "semanticFocus": "Senior frontend development with modern React ecosystem and full-stack awareness",
  "seniorityLevel": "Senior"
}

Input: "someone who can build scalable APIs"
Output: {
  "expandedKeywords": ["Node.js", "Python", "REST APIs", "GraphQL", "PostgreSQL", "Redis", "Microservices", "Docker"],
  "semanticFocus": "Backend API development with focus on performance and scalability",
  "seniorityLevel": "Mid"
}

Input: "ML engineer who knows transformers"
Output: {
  "expandedKeywords": ["Python", "PyTorch", "TensorFlow", "Transformers", "BERT", "GPT", "Hugging Face", "NLP"],
  "semanticFocus": "Deep learning engineering with expertise in transformer architectures and NLP",
  "seniorityLevel": "Senior"
}

Input: "junior frontend person"
Output: {
  "expandedKeywords": ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"],
  "semanticFocus": "Entry-level frontend development with modern web technologies",
  "seniorityLevel": "Junior"
}

Input: "full stack wizard who can do everything"
Output: {
  "expandedKeywords": ["React", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "REST APIs", "Docker", "AWS"],
  "semanticFocus": "Full-stack development with end-to-end product ownership across frontend and backend",
  "seniorityLevel": "Senior"
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanation, no preamble.`
            },
            {
                role: "user",
                content: `Analyze this recruiter query: "${query}"`
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
    });

    const raw = JSON.parse(completion.choices[0].message.content || "{}");

    return {
        originalQuery: query,
        expandedKeywords: raw.expandedKeywords || [query],
        semanticFocus: raw.semanticFocus || query,
        seniorityLevel: raw.seniorityLevel || "Any"
    };
}

const breaker = createCircuitBreaker(analyzeQueryRaw, "strategist-agent");

export class StrategistAgent {
    static async analyzeQuery(query: string): Promise<SearchStrategy> {
        try {
            return await breaker.fire(query);
        } catch (err) {
            console.warn("⚠️ Strategist Agent Failed (Circuit Open or Error). Falling back to raw query.", err);
            return {
                originalQuery: query,
                expandedKeywords: [query],
                semanticFocus: query,
                seniorityLevel: "Any"
            };
        }
    }
}