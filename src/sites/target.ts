import type { SelectorMap } from '../types/SelectorMap.js'

export const targetSite = {
    searchUrl: 'https://www.target.com/s?searchTerm={query}',

    selectors: {
        // extraction
        card: '[data-test="@web/site-top-of-funnel/ProductCardWrapper"]',
        title: '[data-test="@web/ProductCard/title"] div',
        price: '[data-test="current-price"] span',
        url: '[data-test="@web/ProductCard/title"]',

        // pagination
        paginationNext: '[data-test="next"]',
    } satisfies SelectorMap & {
        paginationNext: string
    },
}
