## 1. Core Implementation

- [x] 1.1 In `performScraping()` (`src/contents/scraper.ts`), declare `const contentKeys = new Set<string>()` immediately after `const scrapedIds = new Set<string>()`
- [x] 1.2 Add a normalize helper inline or as a module-level pure function: `const normalizeKey = (title: string, address: string) => title.toLowerCase().trim() + "|" + address.toLowerCase().trim()`
- [x] 1.3 After the `if (details.title)` check (line ~205), compute `const key = normalizeKey(details.title, details.address)`
- [x] 1.4 Add a guard: if `contentKeys.has(key)`, log `SCRAPER: Duplicate detected, skipping: "<title>"` and `continue` (skip push)
- [x] 1.5 In the `else` branch (unique item), add `contentKeys.add(key)` before or after `results.push(details)`

## 2. Verification

- [x] 2.1 Run `npx tsc --noEmit` — confirm zero type errors
- [x] 2.2 Run `npm run lint` — confirm zero lint warnings
- [x] 2.3 Run `npm test` — confirm all existing unit tests pass
- [x] 2.4 Manually test: scrape a query known to produce duplicates (e.g., a popular chain in a dense area) and confirm the console shows `SCRAPER: Duplicate detected` and the final count is lower than the raw card count
