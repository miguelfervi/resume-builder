import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector("h1", { state: "visible" });
});

test.describe("Multi-CV management", () => {
  test("app starts with a single resume in the selector", async ({ page }) => {
    // The selector button shows the active resume name
    const selectorBtn = page.locator("button").filter({ hasText: "My Resume" }).first();
    await expect(selectorBtn).toBeVisible();
  });

  test("can create a new resume", async ({ page }) => {
    // Open the resume selector dropdown
    await page.locator("button").filter({ hasText: "My Resume" }).first().click();
    await page.getByText("+ New resume").click();

    // After creation, selector shows the new resume is active
    // There should now be 2 resumes listed — reopen dropdown to verify
    await page.locator("button").filter({ hasText: "My Resume" }).first().click();
    const items = page.locator(".max-h-48 button").filter({ hasNotText: "" });
    await expect(items).toHaveCount(2);
  });

  test("switching between resumes changes active indicator", async ({ page }) => {
    // Create a second resume
    await page.locator("button").filter({ hasText: "My Resume" }).first().click();
    await page.getByText("+ New resume").click();

    // Reopen dropdown and verify "active" badge appears on new one
    await page.locator("button").filter({ hasText: "My Resume" }).first().click();
    // The active resume row has an "active" badge
    await expect(page.locator("text=active").first()).toBeVisible();
  });

  test("can duplicate a resume", async ({ page }) => {
    await page.locator("button").filter({ hasText: "My Resume" }).first().click();
    // Click the duplicate icon (copy icon, title="Duplicate")
    const duplicateBtn = page.locator('button[title="Duplicate"]').first();
    await expect(duplicateBtn).toBeVisible();
    await duplicateBtn.click();

    // Now 2 resumes exist — reopen to verify
    await page.locator("button").filter({ hasText: "My Resume" }).first().click();
    const items = page.locator(".max-h-48 button").filter({ hasText: "My Resume" });
    await expect(items).toHaveCount(2); // original + copy
  });

  test("can rename a resume", async ({ page }) => {
    await page.locator("button").filter({ hasText: "My Resume" }).first().click();

    // Click pencil (rename) icon
    const renameBtn = page.locator('button[title="Rename"]').first();
    await renameBtn.click();

    // Inline input appears — type new name
    const renameInput = page.locator(".max-h-48 input").first();
    await renameInput.clear();
    await renameInput.fill("Awesome CV");
    await renameInput.press("Enter");

    // Selector now shows the new name
    await expect(page.locator("button").filter({ hasText: "Awesome CV" }).first()).toBeVisible();
  });
});

test.describe("Export / Import JSON", () => {
  test("Export button triggers a file download", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByTitle("Export JSON").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test("Import button shows an error for invalid JSON", async ({ page }) => {
    // Create a temp file with invalid JSON
    const tmpFile = path.join(os.tmpdir(), "invalid.json");
    fs.writeFileSync(tmpFile, "not valid json }{");

    // Set the file on the hidden file input directly
    const fileInput = page.locator('input[type="file"][accept*="json"]');
    await fileInput.setInputFiles(tmpFile);

    await expect(page.getByText("Invalid JSON file")).toBeVisible({ timeout: 3000 });

    fs.unlinkSync(tmpFile);
  });

  test("Import loads valid resume data", async ({ page }) => {
    // First, fill some data so we have something to export
    await page.getByPlaceholder("Your name").fill("Import Test User");

    // Export current data
    const downloadPromise = page.waitForEvent("download");
    await page.getByTitle("Export JSON").click();
    const download = await downloadPromise;

    // Save download to a temp file
    const tmpFile = path.join(os.tmpdir(), "resume_export.json");
    await download.saveAs(tmpFile);

    // Clear name, then import
    await page.getByPlaceholder("Your name").fill("");
    await page.locator('input[type="file"][accept*="json"]').setInputFiles(tmpFile);

    // The imported name should reappear
    await expect(page.getByPlaceholder("Your name")).toHaveValue("Import Test User", { timeout: 3000 });

    fs.unlinkSync(tmpFile);
  });
});

test.describe("Undo / Redo", () => {
  test("Undo button is visible and initially disabled", async ({ page }) => {
    const undoBtn = page.locator('button[title="Undo (Ctrl+Z)"]');
    await expect(undoBtn).toBeVisible();
    await expect(undoBtn).toBeDisabled();
  });

  test("Redo button is visible and initially disabled", async ({ page }) => {
    const redoBtn = page.locator('button[title="Redo (Ctrl+Shift+Z)"]');
    await expect(redoBtn).toBeVisible();
    await expect(redoBtn).toBeDisabled();
  });

  test("Undo becomes enabled after editing", async ({ page }) => {
    await page.getByPlaceholder("Your name").fill("Some Name");
    // Wait for debounce snapshot (600ms)
    await page.waitForTimeout(800);

    const undoBtn = page.locator('button[title="Undo (Ctrl+Z)"]');
    await expect(undoBtn).toBeEnabled({ timeout: 2000 });
  });

  test("Keyboard shortcut Ctrl+Z triggers undo", async ({ page }) => {
    await page.getByPlaceholder("Your name").fill("Before Undo");
    await page.waitForTimeout(800); // wait for snapshot

    await page.getByPlaceholder("Your name").fill("After Edit");
    await page.waitForTimeout(800);

    // Undo from outside the input
    await page.locator("h1").click();
    await page.keyboard.press("Control+z");

    await expect(page.getByPlaceholder("Your name")).toHaveValue("Before Undo", { timeout: 2000 });
  });
});

test.describe("Persistence across reload", () => {
  test("data persists after page reload", async ({ page }) => {
    await page.getByPlaceholder("Your name").fill("Persistent User");

    // Wait for autosave debounce (500ms)
    await page.waitForTimeout(700);
    await page.reload();
    await page.waitForSelector("h1", { state: "visible" });

    await expect(page.getByPlaceholder("Your name")).toHaveValue("Persistent User");
  });
});
