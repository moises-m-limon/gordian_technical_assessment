import { chromium } from 'playwright'
import { runSite } from './run.js'
import { targetSite } from './sites/target.js'
import fs from 'fs'

/**
 * Entry point for running a Playwright-based scraping job.
 *
 * Responsibilities:
 * - Configure and launch the browser
 * - Create a hardened browser context (UA, viewport, locale)
 * - Delegate site-specific scraping logic to a runner abstraction
 * - Persist scraped results to disk
 *
 * Notes:
 * - Site-specific behavior is intentionally abstracted away via `runSite` and `targetSite` to support scaling to many sites.
 */

const isHeadless = process.env.NODE_ENV !== 'development'

const browser = await chromium.launch({ headless: isHeadless })

const context = await browser.newContext({
    userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
})

const page = await context.newPage()

const query = 'pokemon cards'

const items = await runSite(page, targetSite, query)

/**
 * Persist results to disk.
 *
 * Data is pretty-printed to make debugging and manual inspection easier.
 * In a production system, this could be replaced with DB insertion logic or API calls.
 */
fs.writeFileSync('./data.json', JSON.stringify(items, null, 2))

await browser.close()
