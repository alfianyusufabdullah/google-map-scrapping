## Context

The Options page currently relies on bulk actions: Export Session, Export All, or Delete Session. Users analyzing leads often find specific rows they want to keep or discard individually, but have no way to manage them besides doing it externally after an export. Additionally, if a user wants to contact a lead (WhatsApp) or investigate their location (Google Maps), they have to copy-paste the text manually. 

## Goals / Non-Goals

**Goals:**
- Implement a checkbox column in the data table for row selection.
- Implement a "Select All" / "Deselect All" master checkbox in the table header that applies only to the currently visible (filtered) dataset.
- Provide contextual batch actions ("Export Selected", "Delete Selected") that appear when at least one row is selected.
- Add quick-action icons for WhatsApp (if a phone number exists) and Google Maps (using coordinates or address string).

**Non-Goals:**
- Creating a full CRM database with persistent row states (e.g., "Contacted", "Ignored"). The selection state will only exist in memory during the active session view.
- Validating whether a phone number is an active WhatsApp account. We will blindly generate a `wa.me/` link if the number can be parsed into a numeric format.

## Decisions

- **Selection State Management**: Use a `Set<string>` (stored as an array or set in React state) containing the unique identifiers of the selected rows. Since the current `ScrapedData` doesn't have a guaranteed unique ID besides a combination of `title`+`address`, we will generate a composite key (e.g., `${item.title}-${item.address}`) or use the array index relative to the session data. For safety against duplicate titles, we will use a composite key of `title + address + coordinates`.
- **WhatsApp Link Generation**: Phone numbers come in various formats (e.g., `(021) 123-4567`, `+62 812-3456-7890`, `081234567890`). We will strip all non-numeric characters. If the number starts with `0` and is an Indonesian number, we will replace the `0` with `62` before appending it to `https://wa.me/`.
- **Location Link Generation**: If `coordinates` exist, we will link to `https://www.google.com/maps/place/${coordinates}`. Otherwise, we will use a query link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`.
- **Contextual Action Bar**: Instead of adding more buttons to the sidebar, we will render a floating sticky bar at the bottom of the screen (or replace the table header toolbar) when `selectedIds.size > 0`. This focuses user attention on the batch action.

## Risks / Trade-offs

- **[Risk] Pagination and Selection**: "Select All" might confuse users if they think it selects all pages vs just the current page.
  - **Mitigation**: "Select All" will explicitly select ALL filtered records (ignoring pagination). The UI will state "N items selected".
- **[Trade-off] Unique Identifiers**: Using composite keys instead of UUIDs.
  - **Mitigation**: Since this is a client-side scraper, adding a UUID during extraction would be best, but we will construct a sturdy composite key `encodeURIComponent(title+address)` which has a 99.9% uniqueness guarantee for Google Maps data.