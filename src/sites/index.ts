import { targetSite } from './target.js'

export const siteRegistry = {
    target: targetSite,
    // add more sites here as modules
    // amazon: amazonSite,
    // walmart: walmartSite,
}

export type SiteKey = keyof typeof siteRegistry
