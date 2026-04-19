## 1. Extension Configuration

- [x] 1.1 Update `package.json` manifest section to include `unlimitedStorage` in permissions.
- [x] 1.2 Verify `src/options.tsx` is correctly configured as the Options Page entry point.

## 2. Side Panel Enhancement

- [x] 2.1 Add `limit` state and numeric input field to `src/sidepanel.tsx` (default 500, max 5000).
- [x] 2.2 Add `isScraping` state to `src/sidepanel.tsx` using `chrome.storage.local` watcher.
- [x] 2.3 Implement conditional rendering for the "Start Scraping" button (disabled + spinner when `isScraping` is true).
- [x] 2.4 Update `handleStartScraping` to include `limit` in the message payload.

## 3. Scraper Engine Upgrade

- [x] 3.1 Update `performScraping` in `src/contents/scraper.ts` to accept a `limit` parameter.
- [x] 3.2 Implement a `jitteredDelay` helper function (random duration between 1.5s and 2.5s).
- [x] 3.3 Inject `jitteredDelay` before each card click and before each scroll action.
- [x] 3.4 Implement the item counter and break the loop once `results.length >= limit`.
- [x] 3.5 Update `chrome.storage.local` to set `isScraping: true` on start and `isScraping: false` on completion/error.

## 4. Results Dashboard (Options Page)

- [x] 4.1 Scaffold `src/options.tsx` using Shadcn UI Table component.
- [x] 4.2 Implement data retrieval from `chrome.storage.local` on page mount.
- [x] 4.3 Add basic pagination logic (50 items per page) to the results table.
- [x] 4.4 Add a "Clear Database" button to wipe `scrapedData` from storage.
