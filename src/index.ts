import { chromium } from 'playwright'
import { extractItems } from './extract/extractItems.js'
import { navigate } from './navigation/navigate.js'
import type { Item } from './types/Item.js'
import { targetSite } from './sites/target.js'

const browser = await chromium.launch({ headless: true })

const context = await browser.newContext({
    userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
})

const page = await context.newPage()

const query = 'pokemon cards'
await navigate(
  page,
  targetSite.searchUrl.replace('{query}', encodeURIComponent(query)),
  targetSite.selectors.card
);

const allItems: Item[] = [];

for (;;) {
  const items = await extractItems(page, targetSite.selectors);
  allItems.push(...items);

  const next = page.locator(targetSite.selectors.paginationNext);
  if (await next.getAttribute("disabled") !== null) break;

  await Promise.all([
    next.click(),
    page.waitForTimeout(1500)
  ]);
}

console.log(allItems.length, 'items extracted')

await browser.close()
