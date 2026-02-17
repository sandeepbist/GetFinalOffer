import { test, expect } from "@playwright/test";

test.describe("Graph Search Route Health", () => {
  test("canonical recruiter candidates endpoint exists", async ({ request }) => {
    const response = await request.get("/api/recruiter/candidates?page=1&pageSize=10");
    expect([401, 403, 429]).toContain(response.status());
  });

  test("double api prefix path is not valid", async ({ request }) => {
    const response = await request.get("/api/api/recruiter/candidates?page=1&pageSize=10");
    expect(response.status()).toBe(404);
  });
});
