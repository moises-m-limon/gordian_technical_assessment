# Gordian Centaur Dev Technical Assessment

## Table of Contents

- [Installation & Guide](#installation--guide)
- [Part I](#part-i-browser-automation--scraping)
- [Part II](#part-ii-automation-framework)
- [Part III](#part-iii-minimal-frontend-optional)
- [Part IV](#part-iv-written-questions)


---

## Installation & Guide

Install dependencies attached via `package.json`

```bash
npm install
npx playwright install
```

Command to build and run scraper

## Scripts

- `npm run dev`  
  Runs the scraper directly from TypeScript using `tsx`.  
  This is intended for local development and rapid iteration without a build step.

- `npm run build`  
  Compiles the TypeScript source code into JavaScript using the TypeScript compiler (`tsc`).
  This ensures the project can be built and run without relying on runtime transpilation.

- `npm run start`  
  Runs the compiled JavaScript output from the `dist/` directory.
  This mirrors how the scraper would run in a production or CI environment.

- `npm run lint` (optional)  
  Runs formatting checks using Prettier to ensure consistent code style.
  Linting is included for maintainability but is not required to run the scraper.

## Part I. Browser Automation & Scraping

- This section covers the core browser automation and scraping functionality. It includes navigation, pagination handling, and selector-driven extraction for a single site using Playwright. The focus is on correctness, stability, and clear separation between site definitions, navigation, and extraction logic.

## Part II. Automation Framework

- Created A single “runner” process [run.ts](src/run.ts) that will use the interface to direct a scraper instance
- The function `runSite(page, targetSite, query)` takes in:
    - accepts a Playwright `Page`
    - accepts a site definition (search URL + selectors)
    - accepts a query string for modularity of product item
    - returns the items extracted from the site

## Part III. Minimal Frontend (optional)

- A frontend UI was considered but intentionally deprioritized in favor of focusing on the core scraping and automation architecture. The current implementation is designed to be frontend-agnostic and could be easily integrated with a UI layer in future work.

## Part IV. Written Questions

1. A scraper that worked reliably suddenly starts failing. How do you debug and stabilize it?
    - If a scraper is failing I would:
        - check the status codes to validate the type of error occuring
        - also evaluate if the website that is being scraped has had any changes
    - To debug and stabilize I would:
        - build out HTML screenshot logic to capture the instance where error first occured to backtrace root cause
        - reevaluate the exception logic handling to see if there are any gaps that need to be built
    2. Playwright tests pass locally but fail in CI. What do you investigate?
        - If a test is failing in CI I would:
            - evaulate the dependencies for potential mismatch
            - evaluate if the site has an issue with Playwright running headless in the CI

2. How do you approach bot detection ethically and technically?
    - My philosophy is based on the principle of Public Accessibility. If a site serves data to the open web without a login, that data is public. I use automation tools (Playwright, Selenium) as a "high-speed browser" to gather these insights efficiently. However, I balance this by ensuring my automation does not degrade the site’s performance for human users—this means respecting the host's resources as much as the data's visibility. I have created automation pipelines to scrape information that I have access to via login for academic purposes, such as the academic platform Canvas or O'Reily to scrape and organize assignments for personal quality of life experiences.
    - I have an honest approach to using scrapers technically, by using open-source automation tools and usually sharing my work on Github. I treat bot detection as a signal to slow down, not a challenge to bypass via brute force.

3. What would you refactor/improve if you had more time?
    - I would work more on the UI as well as create a DB schema for the data to be easily loaded into Postgres to show off those capabilities I have as well.

4. How would you scale this to scraper 100+ sites?
    - Since I am leveraging a SelectorMap pattern, scaling to 100+ sites becomes a configuration problem rather than a coding problem.
    - Given my data science experience, by using an MCP (Model Context Protocol) approach, you can automate the maintenance of these maps:
        - Use an LLM to ingest a site's HTML and output the SelectorMap object directly into your /sites/ directory.
        - Run a validation test in CI that validates the SelectorMap against a live page before the scraper is added to the production pool.
        - If the card selector returns 0 results during a production run, the system triggers the MCP to re-analyze the page and suggest a updated SelectorMap or manually intervene for simple adjustments.
