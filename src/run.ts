import type { Page } from 'playwright'
import { navigate } from './navigation/navigate.js'
import { extractItems } from './extract/extractItems.js'
import type { Item } from './types/Item.js'

export async function runSite(
    page: Page,
    site: {
        searchUrl: string
        selectors: {
            card: string
            paginationNext?: string
            title: string
            url: string
            price?: string
        }
    },
    query: string
): Promise<Item[]> {
    const url = site.searchUrl.replace('{query}', encodeURIComponent(query))

    await navigate(page, url, site.selectors.card)

    const allItems: Item[] = []

    for (;;) {
        const items = await extractItems(page, site.selectors)
        allItems.push(...items)

        if (!site.selectors.paginationNext) break

        const next = page.locator(site.selectors.paginationNext)
        if ((await next.getAttribute('disabled')) !== null) break

        await Promise.all([next.click(), page.waitForTimeout(1500)])
    }
    console.info(
        `[runSite] Extracted ${allItems.length} items for query "${query}" from ${url}`
    )
    return allItems
}
