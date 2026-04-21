## Context

The Options page currently displays scraped Google Maps data stored in `chrome.storage.local` under the `scrapedData` key. When users re-scrape areas or manage their data, this array is often replaced or augmented. To turn this tool into a CRM, users need to add mutable data (status, notes) to individual leads. Storing this mutable data directly on the `scrapedData` objects would result in data loss if a business is re-scraped, as the fresh scrape would overwrite the user's CRM notes.

## Goals / Non-Goals

**Goals:**
- Provide a persistent CRM layer that maps to scraped leads without modifying the core `scrapedData` array schema.
- Allow users to view a lead's CRM status inline in the Leads Table.
- Provide a slide-out drawer (Shadcn Sheet) for editing notes and updating the status of a lead.
- Ensure CRM data is joined seamlessly with the filtered data in the Dashboard view.

**Non-Goals:**
- Complex multi-user CRM syncing (we are sticking to `chrome.storage.local`).
- Custom pipeline stages (we will use a hardcoded set of statuses for V1: NEW, CONTACTED, FOLLOW_UP, NOT_INTERESTED, CLOSED).
- Adding complex CRM export functionality (we will just include the Status and Notes in the existing CSV export for now).

## Decisions

**1. Decoupled CRM State**
Instead of mutating `scrapedData`, we will create a parallel `crmData` object in `chrome.storage.local`. This will be a dictionary keyed by `rowId` (which is deterministically generated from business title, address, and coordinates).
*Rationale:* If a user re-scrapes the same business, the `rowId` remains the same, allowing the new scrape data to instantly re-attach to the existing CRM notes.

**2. Slide-out Drawer (Shadcn Sheet)**
Clicking on a row in the `LeadsTable` will open a slide-out drawer on the right side of the screen, rather than using inline table editing or a separate page.
*Rationale:* Inline editing is difficult for multi-line notes. A modal blocks the context of the table. A Sheet allows the user to see the list while interacting with a specific lead's rich details.

**3. Data Merging in `useDashboard`**
The `crmData` will be fetched alongside `scrapedData` in `loadData`. We will expose `crmData` and an `updateCrmData(rowId, data)` function from the hook so the UI can quickly look up and modify `crmData[rowId]`.

## Risks / Trade-offs

- **Row ID Changes:** If the Google Maps scraper changes how it extracts titles or addresses, the `rowId` generation might change, breaking the link between new scrapes and old CRM data.
  *Mitigation:* Keep `rowId` generation logic as stable and normalized as possible.
- **Storage Limits:** `chrome.storage.local` has limits (though quite large). A huge `crmData` dictionary could eventually hit quota limits.
  *Mitigation:* Since this is a text-only dictionary, it will take tens of thousands of leads to hit the 5MB+ limit. We can consider `unlimitedStorage` permission later if needed.