## Why

Currently, the options page acts only as a read-only viewer for scraped data. Users cannot track interactions, leave notes, or manage the state of their leads without exporting to an external tool. To make the application a more powerful daily workflow tool, we need to introduce Mini CRM capabilities that persist across scraping sessions without overwriting the user's mutable data when fresh scrapes occur.

## What Changes

- Introduce a mutable CRM data layer that stores user interactions separately from the scraped Google Maps data.
- Add a new "Slide-out CRM Drawer" (using Shadcn `Sheet`) in the Options page that opens when clicking a row in the Leads Table.
- Add a Status dropdown (e.g., NEW, CONTACTED, FOLLOW_UP, NOT_INTERESTED, CLOSED) to track lead progress.
- Add a Notes text area for users to jot down interaction details.
- Display a "Status Badge" directly in the Leads Table to show lead progress at a glance.

## Capabilities

### New Capabilities
- `lead-crm`: Tracking and managing the status and notes for individual scraped leads, decoupled from raw scraped data.

### Modified Capabilities
- `results-dashboard`: The existing dashboard will be modified to join the new mutable CRM data with the read-only scraped data to display inline status badges and handle row click interactions.

## Impact

- `src/lib/utils/scraper-utils.ts`: New types for CRM data (`CrmData`, `LeadStatus`).
- `src/lib/hooks/use-dashboard.ts`: State management for `crmData` fetching from `chrome.storage.local` and merging with `scrapedData`.
- `src/components/dashboard/LeadsTable.tsx`: UI updates to render status badges and handle row clicks.
- `src/options.tsx` (or a new component): Implementation of the Slide-out CRM Drawer.
- `chrome.storage.local`: A new `crmData` object will be stored alongside `scrapedData` to hold user notes and statuses.