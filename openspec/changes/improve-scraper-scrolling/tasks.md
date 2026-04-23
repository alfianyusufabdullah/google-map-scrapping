## 1. Scraper Scrolling Improvements

- [x] 1.1 Implement `findScrollableContainer` helper in `src/contents/scraper.ts`.
- [x] 1.2 Refactor the scrolling logic in `performScraping` to directly target `div[role="feed"]`.
- [x] 1.3 Add an aggressive "Nudge Scroll" logic (up 200px, then down).
- [x] 1.4 Improve end-of-feed detection with multiple retries.

## 2. Verification

- [ ] 2.1 Test with "Laundry Bali" to verify it passes the 9-item limit.
- [ ] 2.2 Verify that the feed scrolls and loads new items correctly.
