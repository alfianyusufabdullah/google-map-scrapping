## 1. Infrastructure & UI Components

- [x] 1.1 Install and initialize Shadcn `Accordion` and `ScrollArea` components.
- [x] 1.2 Update the `ScrapedData` interface in `src/contents/scraper.ts` to include `sessionId`, `ratingScore`, and `reviewCount`.
- [x] 1.3 Update types in `src/sidepanel.tsx` and `src/options.tsx` to match the new interface.

## 2. Scraper Engine Improvements

- [x] 2.1 Implement session initialization in `scraper.ts` (generate unique ID and timestamp).
- [x] 2.2 Update DOM selectors for `ratingScore` (span.MW4etd) and `reviewCount` (span.UY7F9).
- [x] 2.3 Add logic to strip parentheses from `reviewCount`.
- [x] 2.4 Refine website URL extraction to use `getAttribute('href')` and resolve relative paths.
- [x] 2.5 Add real-time progress updates to `chrome.storage.local` (e.g., `currentSessionCount`) within the scraping loop.

## 3. Side Panel Enhancement

- [x] 3.1 Remove the "Auto Scroll" toggle from the UI and simplify the start logic.
- [x] 3.2 Add a progress display section (e.g., "123 / 500 items found") above the STOP button.
- [x] 3.3 Implement a storage listener in `sidepanel.tsx` to update the progress count in real-time.

## 4. Dashboard (Options Page) Redesign

- [x] 4.1 Refactor data retrieval to group `scrapedData` by `sessionId`.
- [x] 4.2 Implement the `Accordion` layout to separate different scraping sessions.
- [x] 4.3 Integrate `ScrollArea` to wrap the results table within each session.
- [x] 4.4 Fix link rendering in the table to ensure they are clickable and absolute.
- [x] 4.5 Update the "Clear All" logic to handle session-based data.
