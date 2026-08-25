import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCandidatePassage, crossEncoderRerank } from "./cross-encoder";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";

test("buildCandidatePassage extracts and formats core metadata cleanly", () => {
    const candidate: CandidateSummaryDTO = {
        id: "c-1",
        name: "Jane Doe",
        title: "Senior Full Stack Engineer",
        skills: ["React", "TypeScript", "Node.js", "GraphQL"],
        yearsExperience: 7,
        location: "San Francisco, CA",
        bio: "Passionate engineer specialized in building scalable distributed web applications.",
        companyCleared: null,
    };

    const passage = buildCandidatePassage(candidate);
    assert.ok(passage.includes("Senior Full Stack Engineer"));
    assert.ok(passage.includes("React, TypeScript"));
    assert.ok(passage.includes("7 yrs experience"));
    assert.ok(passage.includes("Passionate engineer specialized"));
});

test("crossEncoderRerank ranks relevant candidates above irrelevant candidates", async () => {
    const query = "Senior React developer with TypeScript";

    const candidates: CandidateSummaryDTO[] = [
        {
            id: "c-nurse",
            name: "Emily Johnson",
            title: "ICU Registered Nurse",
            skills: ["Critical Care", "Patient Monitoring", "Ventilator Management"],
            yearsExperience: 5,
            location: "Seattle, WA",
            bio: "Experienced critical care ICU nurse with deep patient care expertise.",
            matchScore: 40,
            companyCleared: null,
        },
        {
            id: "c-react-lead",
            name: "Alex Rivera",
            title: "Lead Frontend Engineer",
            skills: ["React", "TypeScript", "Next.js", "Redux", "Tailwind CSS"],
            yearsExperience: 8,
            location: "New York, NY",
            bio: "Staff engineer leading React core architecture, design systems, and TypeScript frontend apps.",
            matchScore: 40,
            companyCleared: null,
        },
        {
            id: "c-accountant",
            name: "David Miller",
            title: "Senior Tax Accountant",
            skills: ["GAAP", "Tax Preparation", "Financial Auditing", "Excel"],
            yearsExperience: 9,
            location: "Chicago, IL",
            bio: "CPA accountant managing corporate tax filings and accounting compliance.",
            matchScore: 40,
            companyCleared: null,
        },
    ];

    const reranked = await crossEncoderRerank(query, candidates, 3000);

    // Assert that the React developer is ranked #1
    assert.equal(reranked[0].id, "c-react-lead");
    assert.ok(
        (reranked[0].matchScore || 0) > (reranked[1].matchScore || 0),
        "React Lead matchScore must be strictly greater than irrelevant candidate scores"
    );
    assert.ok((reranked[0].matchScore || 0) >= 70, "Relevant candidate score should be >= 70%");
});

test("crossEncoderRerank returns original candidates on empty query", async () => {
    const candidates: CandidateSummaryDTO[] = [
        {
            id: "c-1",
            name: "Test",
            title: "Software Engineer",
            skills: ["React"],
            yearsExperience: 2,
            location: "Remote",
            matchScore: 50,
            companyCleared: null,
        },
    ];

    const result = await crossEncoderRerank("", candidates);
    assert.deepEqual(result, candidates);
});
