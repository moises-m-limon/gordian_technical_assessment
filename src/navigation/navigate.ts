import type { Page } from "playwright";

export async function navigate(
  page: Page,
  url: string,
  readySelector: string
): Promise<void> {
  // Step 1: Navigate without waiting on network idle
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 45_000
  });

  // Step 2: Allow React hydration
  await page.waitForTimeout(2000);

  // Step 3: Wait for something *you care about*
  await page.waitForSelector(readySelector, {
    state: "attached",
    timeout: 45_000
  });
}
