## 1. Side Panel UI & State Sync

- [x] 1.1 Update `handleStartScraping` in `src/sidepanel.tsx` to include `currentSessionLimit` in the `chrome.storage.local.set` call.
- [x] 1.2 Call `setCurrentSessionLimit(limit)` in `src/sidepanel.tsx` inside `handleStartScraping` to ensure immediate UI feedback.

## 2. Scraper Engine Fix

- [x] 2.1 Update `src/contents/scraper.ts` message listener to explicitly cast `limit` to a number.
- [x] 2.2 Refactor the `performScraping` call in `src/contents/scraper.ts` to log a warning if the limit is missing instead of silently falling back to 500.

## 3. Verification

- [x] 3.1 Verify that clicking "Start" with a limit of 1000 immediately shows "0 out of 1000" in the Side Panel.
- [x] 3.2 Verify that the scraper does not stop at 500 items when a higher limit is set.
