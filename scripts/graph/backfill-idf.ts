import { refreshSkillIdfScores } from "@/lib/graph/idf-calculator";

async function main() {
  const result = await refreshSkillIdfScores();
  console.log(
    `IDF refresh complete. totalCandidates=${result.totalCandidates}, updatedSkills=${result.updatedSkills}`
  );
  process.exit(0);
}

main().catch((error) => {
  console.error("IDF refresh failed", error);
  process.exit(1);
});
