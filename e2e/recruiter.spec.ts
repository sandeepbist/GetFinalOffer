import { test, expect, loginAs, waitForPageLoad } from './fixtures';

const mockCandidate = {
    id: 'cand_1',
    name: 'Alex Johnson',
    title: 'Senior React Engineer',
    image: null,
    email: 'alex.johnson@example.com',
    location: 'San Francisco, CA',
    yearsExperience: 6,
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
    companyCleared: null,
    matchScore: 0.91,
    graphScore: 0.72,
    blendVariant: '65/35',
    graphMatches: [
        {
            seedSkill: 'frontend engineer',
            matchedSkill: 'React',
            relationType: 'RELATED_TO',
            depth: 1,
            path: ['frontend engineer', 'React'],
            idfScore: 1.2,
            contribution: 0.84,
        },
    ],
    matchHighlight: 'Built complex React design systems at scale.',
    bio: 'Frontend engineer focused on high-performance product experiences.',
    verificationStatus: 'verified',
    resumeUrl: 'https://example.com/resume.pdf',
    profilePreview: {
        id: 'cand_1',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        image: null,
        title: 'Senior React Engineer',
        currentRole: 'Staff Frontend Engineer',
        location: 'San Francisco, CA',
        yearsExperience: 6,
        bio: 'Frontend engineer focused on high-performance product experiences.',
        verificationStatus: 'verified',
        resumeUrl: 'https://example.com/resume.pdf',
        skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
        interviewProgress: [
            {
                id: 'ip_1',
                companyId: 'co_1',
                companyName: 'Acme Inc',
                position: 'Senior Frontend Engineer',
                roundsCleared: 3,
                totalRounds: 4,
                status: 'On Hold',
                verificationStatus: 'verified',
                dateCleared: new Date().toISOString(),
            },
        ],
    },
};

test.describe('Recruiter Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'recruiter');
        await waitForPageLoad(page);
    });

    test('should display recruiter dashboard after login', async ({ page }) => {
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    });

    test('should display recent outreach section', async ({ page }) => {
        await expect(page.getByText(/recent outreach/i)).toBeVisible();
    });

    test('should display talent search option', async ({ page }) => {
        await expect(page.getByText(/talent search/i)).toBeVisible();
    });

    test('should navigate to candidate search', async ({ page }) => {
        const searchLink = page.getByRole('link', { name: /go to search/i });
        await expect(searchLink).toBeVisible();

        await searchLink.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        await expect(page).toHaveURL(/\/recruiter\/candidates/);
    });

    test('should have sign out button', async ({ page }) => {
        await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    });

    test('should have theme toggle', async ({ page }) => {
        const themeToggle = page.getByRole('button', { name: /dark mode|light mode|switch to/i });
        await expect(themeToggle).toBeVisible();
    });
});

test.describe('Recruiter Candidate Search', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/api/companies', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ id: 'co_1', name: 'Acme Inc' }]),
            });
        });
    });

    test('should render candidate results and send search/filter query params', async ({ page }) => {
        const searchRequests: string[] = [];

        await page.route('**/api/recruiter/candidates**', async (route) => {
            searchRequests.push(route.request().url());
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        data: [mockCandidate],
                        total: 1,
                    },
                }),
            });
        });

        await loginAs(page, 'recruiter');
        await waitForPageLoad(page);
        await page.goto('/recruiter/candidates');
        await page.waitForLoadState('domcontentloaded');
        await expect(page.getByText('Alex Johnson')).toBeVisible();

        await page.getByPlaceholder(/Search by role, skills/i).fill('React');
        await page.waitForTimeout(900);

        await page.evaluate(async () => {
            await fetch('/api/recruiter/candidates?page=1&pageSize=10&companyId=co_1');
        });
        await page.waitForTimeout(400);

        const hasSearchParam = searchRequests.some((requestUrl) => {
            const params = new URL(requestUrl).searchParams;
            return params.get('search') === 'React';
        });
        expect(hasSearchParam).toBeTruthy();

        const hasCompanyParam = searchRequests.some((requestUrl) => {
            const params = new URL(requestUrl).searchParams;
            return params.get('companyId') === 'co_1';
        });
        expect(hasCompanyParam).toBeTruthy();
    });

    test('should show explicit access error state for 403 responses', async ({ page }) => {
        await page.route('**/api/recruiter/candidates**', async (route) => {
            await route.fulfill({
                status: 403,
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'Recruiter access required',
                    code: 'FORBIDDEN',
                }),
            });
        });

        await loginAs(page, 'recruiter');
        await waitForPageLoad(page);
        await page.waitForTimeout(500);
        await page.goto('/recruiter/candidates');
        await page.waitForLoadState('domcontentloaded');

        await expect(page.getByText(/Recruiter access required/i)).toBeVisible();
        await expect(page.getByText(/profile is missing/i)).toBeVisible();
    });

    test('should open profile modal without calling candidate detail endpoint again', async ({ page }) => {
        let candidateDetailsRequests = 0;

        await page.route('**/api/recruiter/candidates**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        data: [mockCandidate],
                        total: 1,
                    },
                }),
            });
        });

        page.on('request', (request) => {
            if (/\/api\/candidate\/[^/?]+/.test(request.url())) {
                candidateDetailsRequests += 1;
            }
        });

        await loginAs(page, 'recruiter');
        await waitForPageLoad(page);
        await page.goto('/recruiter/candidates');
        await page.waitForLoadState('domcontentloaded');

        await page.getByRole('button', { name: /view profile/i }).click();

        await expect(page.getByText(/Interview Timeline/i)).toBeVisible();
        await expect(page.getByText(/alex.johnson@example.com/i)).toBeVisible();
        expect(candidateDetailsRequests).toBe(0);
    });

    test('should show graph match explanation popover when graph data is present', async ({ page }) => {
        await page.route('**/api/recruiter/candidates**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        data: [mockCandidate],
                        total: 1,
                    },
                }),
            });
        });

        await loginAs(page, 'recruiter');
        await waitForPageLoad(page);
        await page.goto('/recruiter/candidates');
        await page.waitForLoadState('domcontentloaded');

        const graphBadge = page.getByRole('button', { name: /related skill match/i });
        await expect(graphBadge).toBeVisible();
        await graphBadge.click();

        await expect(page.getByText(/graph match reasoning/i)).toBeVisible();
        await expect(page.getByText(/frontend engineer/i)).toBeVisible();
    });
});
