## Why

The current scraper is limited to a small batch of data and lacks a professional interface for monitoring and managing large datasets. To support serious business intelligence gathering, the extension needs to handle thousands of results reliably, bypass basic detection with delays, and provide a high-fidelity dashboard for data review.

## What Changes

- **User-Defined Scrapping Limits**: Allow users to set a minimum item count (up to 5,000) for scrapping sessions.
- **Enhanced Scrapping Engine**: Implement a 2-second randomized delay between card clicks and scrolls to improve stealth.
- **Dashboard Interface (Options Page)**: A professional results viewer using Shadcn UI components.
- **Improved UI Feedback**: The side panel will now show a loading state and disable actions during active scrapping sessions.
- **Persistence Upgrade**: Use `unlimitedStorage` to handle the increased data volume without browser-imposed limits.

## Capabilities

### New Capabilities
- `results-dashboard`: A full-page dashboard built with Shadcn UI for viewing, filtering, and managing scraped business data.
- `scraper-limits`: Configuration and enforcement logic for item limits and anti-detection delays.

### Modified Capabilities
- `map-scraper-engine`: Updating the extraction loop to respect limits and implement delay intervals.
- `extension-ui`: Enhancing the side panel with status indicators and input validation for limits.

## Impact

- `package.json`: Manifest update to include `unlimitedStorage`.
- `src/contents/scraper.ts`: Core loop modification.
- `src/sidepanel.tsx`: UI state management for loading/scrapping status.
- New `src/options.tsx`: Entry point for the Shadcn-powered results dashboard.
