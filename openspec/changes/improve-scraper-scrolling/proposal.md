## Why

The scraper frequently prematurely concludes that it has reached the end of the Google Maps search results feed, often extracting significantly fewer items than requested (e.g., 27 instead of 100). This is due to a simplistic "scroll once and check height" logic that fails to account for Google Maps' lazy loading behavior and "dead zones" in the virtual scroll.

## What Changes

- **Robust Scrolling Engine**: Implement a multi-attempt scrolling strategy that tries multiple times to trigger the loading of more items before giving up.
- **Loading Trigger**: Add a "nudge" scroll behavior (scrolling slightly up then back down) to re-trigger the lazy loading observers in the Google Maps DOM.
- **End-of-Feed Validation**: Supplement height-based detection with a check for explicit "End of results" UI indicators.
- **Duplicate Resilience**: Implement a logic to force a deep scroll if the scraper hits a high threshold of consecutive duplicate entries.

## Capabilities

### Modified Capabilities
- `map-scraper-engine`: Improve the reliability of feed navigation and end-of-results detection.

## Impact

- `src/contents/scraper.ts`: Significant refactoring of the main extraction loop and scrolling logic.
