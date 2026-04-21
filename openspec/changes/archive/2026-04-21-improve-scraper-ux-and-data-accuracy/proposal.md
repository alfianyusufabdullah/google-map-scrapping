## Why

The current scraper has several UX and data accuracy issues: ratings are incorrectly formatted (review counts are mistaken for ratings), website links include extension prefixes, and the dashboard lacks organization (all results are flattened into one list). Additionally, the side panel lacks real-time progress feedback, making it difficult for users to know if the scraper is working effectively.

## What Changes

- **Data Accuracy**: Fix rating and review count extraction logic to separate the two and remove extra parentheses.
- **Link Integrity**: Resolve absolute URLs for websites to avoid `chrome-extension://` prefixes.
- **Side Panel UX**:
    - Remove the "Auto Scroll" toggle (make it mandatory).
    - Add a real-time progress indicator (e.g., "135 / 500 items found").
- **Results Dashboard (Options Page)**:
    - Group results by "Scraping Session" (Query + Timestamp) using a Collapsible/Accordion UI.
    - Replace standard browser scrollbars with Shadcn's `ScrollArea` for a premium feel.

## Capabilities

### New Capabilities
- `session-management`: Ability to group scraped data into distinct sessions based on query and time.
- `real-time-progress`: Mechanism to communicate scraping progress from content scripts to the side panel UI.

### Modified Capabilities
- `map-scraper-engine`: Fix extraction logic for ratings, reviews, and website URLs.
- `extension-ui`: Simplify side panel controls and add progress indicators.
- `results-dashboard`: Implement grouping and premium scrollbars.

## Impact

- `src/contents/scraper.ts`: Major updates to DOM selectors and progress reporting.
- `src/sidepanel.tsx`: UI simplification and real-time state listeners.
- `src/options.tsx`: Complete overhaul of the data display logic and UI components.
- `src/components/ui/`: Introduction of `ScrollArea` and `Accordion` components.
