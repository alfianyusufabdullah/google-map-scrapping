## Context

Google Maps uses a complex virtual scrolling system for its search results feed. Data is loaded dynamically as the user scrolls, but the triggers for this loading can be inconsistent. The current scraper stops as soon as one scroll attempt fails to increase the `scrollHeight`, which is often a false positive.

## Goals / Non-Goals

**Goals:**
- Implement a more aggressive and persistent scrolling strategy.
- Detect "End of Results" more reliably.
- Handle "Dead Zones" where scrolling doesn't immediately yield new results.

**Non-Goals:**
- Removing the duplicate check (it is still necessary for data integrity).
- Changing the detail extraction logic.

## Decisions

- **Multi-Attempt Scroll Loop**: Instead of a single scroll, the scraper will attempt to scroll up to 3 times if the height doesn't change.
- **Direct Feed Targeting**: The browser investigation confirmed that `div[role="feed"]` is the primary scrollable container. The scraper will target this element directly for scrolling.
- **Aggressive Nudge Technique**: Between scroll attempts, the scraper will scroll up by 200px and then back to the bottom. This "jiggles" the Intersection Observers used by Google Maps to trigger the next batch of results.
- **Smart Fallback**: If `div[role="feed"]` cannot be scrolled, the system will use a recursive parent search for a scrollable container.

## Risks / Trade-offs

- **[Risk] Slower Scraping**: More retries and "nudge" scrolls will increase the total session time. → **Mitigation**: Only trigger retries if the target limit hasn't been reached and the feed height appears static.
- **[Risk] Infinite Loop**: If the feed really has ended but the "nudge" makes it look like it hasn't. → **Mitigation**: Limit the number of retries to 3 per scroll-event.
