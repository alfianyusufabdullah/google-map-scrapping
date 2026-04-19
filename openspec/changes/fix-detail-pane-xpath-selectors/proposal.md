## Why

The current Google Maps scraper extracts incorrect rating and review data because the XPath selectors search globally from the document root. Since the list of search results remains in the DOM, the global selector `//span[contains(@class, "MW4etd")]` always captures the rating of the first place in the feed, rather than the actively opened detail pane.

## What Changes

- Update the XPath selector for `ratingScore` to use a contextual anchor, specifically searching for elements that follow the `h1` title of the detail pane (e.g., `//h1[contains(@class, "DUwDvf")]/following::span[contains(@class, "MW4etd")][1]`).
- Update the XPath selector for `reviewCount` similarly to ensure it targets the detail pane.
- Remove reliance on global `//div[@role="main"]` or `//div[contains(@class, "F7kYyc")]` selectors for ratings which are prone to matching feed items.

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `map-scraper-engine`: Fix the data extraction logic to accurately target the detail pane for ratings and reviews instead of globally capturing the first matching elements.

## Impact

- **Code:** Modifies `extractDetails` function in `src/contents/scraper.ts`.
- **System:** Enhances data accuracy, ensuring scraped ratings and reviews belong to the correct location.
