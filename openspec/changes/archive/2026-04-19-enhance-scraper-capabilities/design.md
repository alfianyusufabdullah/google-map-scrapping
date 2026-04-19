## Context

The current extension uses basic `chrome.storage.local` which has a 5MB default limit. For 5000+ items, we need `unlimitedStorage`. The UI is currently a simple side panel without a way to view large datasets. We need a secondary entry point (Options page) to show a data table.

## Goals / Non-Goals

**Goals:**
- Implement `unlimitedStorage` permission.
- Add a "Limit" input and "Loading" state to the Side Panel.
- Create an Options page with a Shadcn DataTable for results.
- Implement a jittered 2s delay in the scraper loop.

**Non-Goals:**
- Exporting to CSV (will be a separate change).
- Real-time sync to cloud databases.

## Decisions

- **State Sync**: Use `chrome.storage.local` to sync `isScraping` state between the Background script, Side Panel, and Content Script. This ensures the UI remains disabled even if the Side Panel is closed and reopened.
- **Jittered Delay**: Use `Math.random()` to vary the 2s delay by +/- 500ms (1.5s - 2.5s) to mimic human behavior more effectively.
- **Options Page UI**: Use `lucide-react` for icons and `shadcn/ui` (specifically Table and Card) for the dashboard.
- **Data Table**: Use a standard Shadcn Table. If performance becomes an issue with 5,000 items, we will consider `tanstack/react-table` with virtualization in a future iteration.

## Risks / Trade-offs

- **Memory usage**: Rendering 5,000 rows in a DOM table might be slow.
  - *Mitigation*: Implement basic pagination (50 items per page) in the Options page.
- **Anti-bot detection**: Even with 2s delays, 5,000 sequential clicks might trigger captchas.
  - *Mitigation*: Limit the default to 500 and allow users to override up to 5000 with a warning.
