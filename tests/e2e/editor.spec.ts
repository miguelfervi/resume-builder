import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Start fresh — clear localStorage before each test
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  // Wait for hydration
  await page.waitForSelector("h1", { state: "visible" });
});

test.describe("Page load", () => {
  test("shows editor and preview side by side", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Resume Builder" })).toBeVisible();
    await expect(page.getByText("Download PDF")).toBeVisible();
    await expect(page.getByText("Full Preview")).toBeVisible();
  });

  test("starts with blank personal details", async ({ page }) => {
    const nameInput = page.getByPlaceholder("Your name");
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue("");
  });

  test("shows data-saved hint", async ({ page }) => {
    await expect(page.getByText("Data is saved automatically in your browser")).toBeVisible();
  });
});

test.describe("Personal details editor", () => {
  test("typing in Full Name updates the preview", async ({ page }) => {
    const nameInput = page.getByPlaceholder("Your name");
    await nameInput.fill("Jane Doe");

    // Preview panel contains the name
    // The preview is in the right panel — wait a moment for React to render
    await expect(page.locator('[style*="fontFamily"]').filter({ hasText: "Jane Doe" }).first()).toBeVisible({ timeout: 3000 });
  });

  test("filling in job title appears in preview", async ({ page }) => {
    await page.getByPlaceholder("Your name").fill("Test User");
    await page.getByPlaceholder("Senior Front-End Engineer").fill("Staff Engineer");

    await expect(page.locator("text=Staff Engineer").first()).toBeVisible({ timeout: 3000 });
  });

  test("email field accepts input", async ({ page }) => {
    const emailInput = page.getByPlaceholder("you@email.com");
    await emailInput.fill("test@example.com");
    await expect(emailInput).toHaveValue("test@example.com");
  });
});

test.describe("Employment history", () => {
  test("Add job button creates a new entry", async ({ page }) => {
    const addJobBtn = page.getByRole("button", { name: "+ Add job" });
    await expect(addJobBtn).toBeVisible();

    await addJobBtn.click();

    // A job entry card appears with a Job Title field
    await expect(page.getByPlaceholder("Front-End Engineer").first()).toBeVisible();
  });

  test("can fill in a job entry", async ({ page }) => {
    await page.getByRole("button", { name: "+ Add job" }).click();

    const jobTitleInput = page.getByPlaceholder("Front-End Engineer").first();
    await jobTitleInput.fill("Senior Engineer");

    const employerInput = page.getByPlaceholder("Acme Corp").first();
    await employerInput.fill("Globex Inc");

    await expect(jobTitleInput).toHaveValue("Senior Engineer");
    await expect(employerInput).toHaveValue("Globex Inc");
  });

  test("can remove a job entry", async ({ page }) => {
    await page.getByRole("button", { name: "+ Add job" }).click();
    await expect(page.getByPlaceholder("Front-End Engineer").first()).toBeVisible();

    // Click the delete (trash) button inside the entry — it has the trash icon SVG
    const entryCard = page.locator(".border.border-gray-100.rounded-lg").first();
    const deleteBtn = entryCard.locator('button[title=""]').first();
    // The delete button is the second button in the card header row
    await entryCard.locator("button").first().click({ force: true }); // first button is the "Job" label delete

    // After delete, the entry is gone
    await expect(page.getByPlaceholder("Front-End Engineer")).toHaveCount(0);
  });

  test("can add an achievement bullet to a job entry", async ({ page }) => {
    await page.getByRole("button", { name: "+ Add job" }).click();
    await page.getByRole("button", { name: "+ Add bullet" }).click();

    const bulletInput = page.getByPlaceholder("Describe an achievement...").first();
    await expect(bulletInput).toBeVisible();
    await bulletInput.fill("Shipped a major feature");
    await expect(bulletInput).toHaveValue("Shipped a major feature");
  });
});

test.describe("Template selector", () => {
  test("three templates are visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Classic" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Modern" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Minimal" })).toBeVisible();
  });

  test("clicking Modern switches template", async ({ page }) => {
    const modernBtn = page.getByRole("button", { name: "Modern" });
    await modernBtn.click();
    // Active template button has blue border
    await expect(modernBtn).toHaveClass(/border-blue-500/);
  });

  test("clicking Minimal switches template", async ({ page }) => {
    const minimalBtn = page.getByRole("button", { name: "Minimal" });
    await minimalBtn.click();
    await expect(minimalBtn).toHaveClass(/border-blue-500/);
  });

  test("switching template does not crash — page stays intact", async ({ page }) => {
    await page.getByRole("button", { name: "Modern" }).click();
    await page.getByRole("button", { name: "Minimal" }).click();
    await page.getByRole("button", { name: "Classic" }).click();
    // App is still alive
    await expect(page.getByRole("heading", { name: "Resume Builder" })).toBeVisible();
  });
});

test.describe("Full preview modal", () => {
  test("Full Preview button opens the modal", async ({ page }) => {
    await page.getByRole("button", { name: /Full Preview/i }).click();
    // The modal contains a close button
    await expect(page.getByRole("button", { name: /close/i })).toBeVisible({ timeout: 3000 });
  });

  test("modal closes with the close button", async ({ page }) => {
    await page.getByRole("button", { name: /Full Preview/i }).click();
    await page.getByRole("button", { name: /close/i }).click();
    // Modal is dismissed
    await expect(page.getByRole("button", { name: /close/i })).not.toBeVisible({ timeout: 2000 });
  });
});

test.describe("PDF download button", () => {
  test("Download PDF button is visible and enabled", async ({ page }) => {
    const downloadBtn = page.getByRole("button", { name: /Download PDF/i });
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toBeEnabled();
  });
});
