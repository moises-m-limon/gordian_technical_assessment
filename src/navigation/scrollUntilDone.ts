import type { Page } from 'playwright'

type ScrollOptions = {
    cardSelector: string
    maxScrolls?: number
    waitMs?: number
}

export async function scrollUntilDone(
    page: Page,
    { cardSelector, maxScrolls = 20, waitMs = 1500 }: ScrollOptions
): Promise<void> {
    let previousCount = 0

    for (let i = 0; i < maxScrolls; i++) {
        const currentCount = await page.locator(cardSelector).count()

        if (currentCount === previousCount) {
            // no new items loaded --> stop
            break
        }

        previousCount = currentCount

        // scroll to bottom
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight)
        })

        // allow network + DOM to update
        await page.waitForTimeout(waitMs)
    }
}
