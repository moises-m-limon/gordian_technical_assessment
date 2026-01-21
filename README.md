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

```bash
npm run dev
```
  Runs the scraper directly from TypeScript using `tsx`.  
  This is intended for local development and rapid iteration without a build step.

```bash
npm run build
``` 
  Compiles the TypeScript source code into JavaScript using the TypeScript compiler (`tsc`).
  This ensures the project can be built and run without relying on runtime transpilation.

```bash
npm run start
```
  Runs the compiled JavaScript output from the `dist/` directory.
  This mirrors how the scraper would run in a production or CI environment.

``` bash
npm run lint
```
  Runs formatting checks using Prettier to ensure consistent code style.
  Linting is included for maintainability but is not required to run the scraper.

## Part I. Browser Automation & Scraping

- This section covers the core browser automation and scraping functionality. It includes navigation, pagination handling, and selector-driven extraction for a single site using Playwright. The focus is on correctness, stability, and clear separation between site definitions, navigation, and extraction logic.

## Part II. Automation Framework

- Created A single “runner” process [run.ts](src/run.ts) that will use the interface to direct a scraper instance
- The function `runSite(page, targetSite, query)` takes in:
    - Accepts a Playwright `Page`
    - Accepts a site definition (search URL + selectors)
    - Accepts a query string for modularity of product item
    - Returns the items extracted from the site

## Part III. Minimal Frontend (optional)

- A frontend UI was considered but intentionally deprioritized in favor of focusing on the core scraping and automation architecture. The current implementation is designed to be frontend-agnostic and could be easily integrated with a UI layer in future work.

## Part IV. Written Questions


### 1. A scraper that worked reliably suddenly starts failing. How do you debug and stabilize it?
- Initial Troubleshooting:
    - Check HTTP status codes to validate the type of error occurring (e.g., 403 Forbidden, 429 Too Many Requests).
    - Evaluate if the website being scraped has undergone any structural changes.
- Debugging & Stabilization:
    - Build out HTML and screenshot logic to capture the instance where the error first occurred to backtrace the root cause.
    - Re-evaluate the exception handling logic to identify and close any gaps in the code.

### 2. Playwright tests pass locally but fail in CI. What do you investigate?
- Dependency Mismatch: Evaluate the environment dependencies for potential version mismatches between local and CI.
- Headless Execution: Investigate if the site has an issue with Playwright running in headless mode within the CI environment.
- Environment Differences: Check for differences in network latency or hardware resources that might cause timing issues.

### 3. How do you approach bot detection ethically and technically?
- Philosophy: My philosophy is based on the principle of Public Accessibility. If a site serves data to the open web without a login, that data is public. I use automation tools (Playwright, Selenium) as a "high-speed browser" to gather these insights efficiently.
- Ethics: I balance this by ensuring my automation does not degrade the site’s performance for human users—this means respecting the host's resources as much as the data's visibility. I have created automation pipelines for academic purposes (e.g., Canvas or O'Reilly) to organize assignments for personal quality-of-life improvements.
- Technical Approach: I take an honest approach by using open-source tools and sharing my work on GitHub. I treat bot detection as a signal to slow down, not a challenge to bypass via brute force.

### 4. What would you refactor/improve if you had more time?
- UI & Persistence: I would work further on the UI and create a database schema to allow data to be easily loaded into PostgreSQL to demonstrate full-stack capabilities.

### 5. How would you scale this to scraper 100+ sites?
- Configuration-Driven Scaling: Since I am leveraging a SelectorMap pattern, scaling becomes a configuration problem rather than a coding problem.
- MCP (Model Context Protocol) Approach:
    - Use an LLM to ingest a site's HTML and output the SelectorMap object directly into the /sites/ directory.
    - Run a validation test in CI that verifies the SelectorMap against a live page before the scraper is added to the production pool.
- Self-Healing: If a selector returns zero results during a production run, the system triggers the MCP to re-analyze the page and suggest an updated SelectorMap or flags it for manual intervention.