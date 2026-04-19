## Context

The initial iteration of the session-based scraping UI grouped results in the Options page using an Accordion and placed the data in a ScrollArea. The Side Panel also introduced real-time progress. However, user feedback indicated that the Accordion becomes unmanageable with many sessions, nested scrolling is a poor pattern for desktop tabular data, and the side panel's loading state could be clearer and avoid showing stale data from previous runs.

## Goals / Non-Goals

**Goals:**
- Prevent stale progress data from flashing when a new scrape starts.
- Create a more prominent, distinct "Active Scraping" state in the Side Panel.
- Improve the Options page layout by using a `Select` dropdown for session filtering instead of an `Accordion`.
- Remove the nested `ScrollArea` around the data table.

**Non-Goals:**
- Changing the underlying scraping logic in the content script.
- Adding pagination to the table (it already exists).

## Decisions

- **Panel State Reset**: The `handleStartScraping` function will explicitly set the `currentSessionCount` to `0` both in React state and in `chrome.storage.local` to immediately clear any stale data.
- **Panel Active UI**: We will conditionally render a completely different block of UI when `isScraping` is true. This block will feature a large progress indicator and the Stop button, hiding the configuration inputs to reinforce that the scraper is busy and the configuration is locked.
- **Dashboard Layout**: The Options page will be refactored into a two-column layout using CSS Grid or Flexbox. The left column (Sidebar) will be `sticky` with `top: 0` and `h-screen`, containing the session `Select`, `Refresh`, `Export`, and `Clear` buttons. The right column will expand to fill the full remaining width without a `max-w` constraint.
- **Table Interactivity**: A search bar will be added to the dashboard header to allow real-time filtering of the displayed results by name. A rating filter (e.g., "Show only 4+ stars") will also be implemented.
- **Advanced Filtering & Sorting**: We will implement a `sortBy` state to allow ordering results by rating (highest/lowest). New toggle-based filters will be added to the sidebar to hide records that are missing website or phone information, ensuring higher quality lead exports.
- **Sidebar Action Buttons**: The sidebar action buttons (Refresh, Export, etc.) will be redesigned to have more visual weight, moving away from ghost/flat styles to a more prominent "action card" style with distinct borders and background highlights.
- **Sticky Table Header**: The `TableHeader` component will use `sticky top-0` and a solid background to remain visible above the results as the user scrolls through long tables.
- **Rating Visualization**: We will create a small helper component to render visual star icons (filled and empty) alongside the numeric `ratingScore` to provide immediate qualitative feedback.
- **Dashboard Scrolling**: We will use a single `ScrollArea` wrapping the entire page content. Within this, the sidebar will be fixed/sticky relative to the viewable area, ensuring that session management is always accessible even when scrolling through hundreds of table rows.
- **Visual Polish**: The sidebar will use a subtle background (`bg-slate-100/50` or similar) to visually separate control logic from the data presentation.

## Risks / Trade-offs

- **[Risk] State Desync**: If the content script immediately starts sending progress updates before the UI's `set(0)` is registered, we might see a flicker. 
  - **Mitigation**: The UI `set(0)` is synchronous with the start click, whereas the content script has a delay before extracting, so the reset will safely beat the first update.
- **[Trade-off] Empty State Handling**: With a Select dropdown, if no session is selected, the table will be empty.
  - **Mitigation**: We will auto-select the most recent session by default when the Options page loads, so the user immediately sees their latest data.
