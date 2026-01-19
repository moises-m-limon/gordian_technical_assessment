import type { Page } from 'playwright'
import type { SelectorMap } from '../types/SelectorMap.js'
import type { Item } from '../types/Item.js'

export async function extractItems(
    page: Page,
    selectors: SelectorMap
): Promise<Item[]> {
    const cards = await page.$$(selectors.card)
    const results: Item[] = []

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]

        try {
            const titleEl = await card.$(selectors.title)
            const priceEl = selectors.price
                ? await card.$(selectors.price)
                : null
            const linkEl = await card.$(selectors.url)

            let title: string | null
            if (titleEl) {
                const rawTitle = await titleEl.textContent()
                title = rawTitle ? rawTitle.trim() : null
            } else {
                title = null
            }

            let price: string | null
            if (priceEl) {
                const rawPrice = await priceEl.textContent()
                price = rawPrice ? rawPrice.trim() : null
            } else {
                price = null
            }

            const url = linkEl ? await linkEl.getAttribute('href') : null

            // validation
            if (!title || !url) {
                console.warn('[extractItems] Skipping card', {
                    index: i,
                    missing: {
                        title: !title,
                        price: !price,
                        url: !url,
                    },
                })

                // log DOM ONCE per bad card
                const debug = await card.innerHTML()
                console.debug('[extractItems] Card HTML:', debug)

                continue
            }

            results.push({
                id: crypto.randomUUID(),
                title,
                price,
                url,
                scrapedAt: new Date().toISOString(),
            })
        } catch (err) {
            console.error('[extractItems] Error extracting card', {
                index: i,
                error: err instanceof Error ? err.message : err,
            })

            const debug = await card.innerHTML()
            console.debug('[extractItems] Card HTML:', debug)

            continue
        }
    }

    console.info(
        `[extractItems] Extracted ${results.length} valid items out of ${cards.length}`
    )

    return results
}
