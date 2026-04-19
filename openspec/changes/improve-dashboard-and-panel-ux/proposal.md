## Why

After implementing the initial session grouping and UI improvements, testing revealed a few UX friction points. In the side panel, the progress count remains stale from the previous session until a new one starts updating, which is confusing. Additionally, the loading state can be more prominent. In the results dashboard, using an Accordion for session history becomes unwieldy with many sessions, and the `ScrollArea` introduces annoying nested scrolling on desktop environments. 

## What Changes

- **Panel Progress Reset**: Ensure `currentSessionCount` is reset to 0 the moment a new scraping session is triggered.
- **Panel Active State Redesign**: Replace the small loading text and bottom footer with a prominent, unified "Scraping Active" card that clearly shows real-time progress and the Stop button.
- **Dashboard Filtering**: Replace the Shadcn `Accordion` with a Shadcn `Select` dropdown to allow users to filter the table by a specific session.
- **Dashboard Sidebar Layout**: Reorganize the Options page to use a sticky sidebar for all configuration and session management controls, maximizing the vertical space for the results table.
- **Dashboard Data Polish**: Enhance the results table with full-width layout, sticky headers, real-time search/filtering, and improved star-based rating visualization.
- **Dashboard Advanced Controls**: Add sorting capabilities by rating and advanced filters to hide records without website or phone data. Improve sidebar action button aesthetics.
- **Dashboard Scrolling**: Remove the Shadcn `ScrollArea` wrapping the table, allowing the table to expand naturally and rely on the browser's native window scrollbar (or a global ScrollArea).

## Capabilities

### New Capabilities
*(None - these are UX refinements to existing capabilities)*

### Modified Capabilities
- `extension-ui`: Update the side panel's active scraping state and progress reset logic.
- `results-dashboard`: Change the session layout from an Accordion to a Select dropdown and remove nested scrolling.

## Impact

- `src/sidepanel.tsx`: State reset logic and major markup changes for the active scraping UI state.
- `src/options.tsx`: Removal of Accordion and ScrollArea components; introduction of Select component logic and markup.
- Dependencies: Shadcn `Select` component will be utilized (already installed by user).
