## 1. Setup and Helpers

- [x] 1.1 Install the Shadcn `Checkbox` component using `npx shadcn@latest add checkbox`.
- [x] 1.2 In `src/options.tsx`, create a helper function `generateRowId(item: ScrapedData): string` that returns a composite key (e.g., encoded title + address + coordinates).
- [x] 1.3 Create a helper function `formatWhatsAppLink(phone: string): string` that sanitizes the number, handles the `0` to `62` conversion, and returns the full `wa.me/` URL.
- [x] 1.4 Create a helper function `formatMapsLink(item: ScrapedData): string` that returns a coordinate link or a fallback search query link.

## 2. Row Selection Logic

- [x] 2.1 Add a `selectedIds` state using `Set<string>` (or an array of strings) in `OptionsIndex`.
- [x] 2.2 Create an `isAllSelected` boolean computed value checking if all items in `sortedData` are present in `selectedIds`.
- [x] 2.3 Implement `handleSelectRow(id: string, checked: boolean)` to toggle individual rows.
- [x] 2.4 Implement `handleSelectAll(checked: boolean)` to select/deselect the entire `sortedData` array.

## 3. Batch Actions Bar

- [ ] 3.1 Design a sticky/floating batch action toolbar that renders conditionally when `selectedIds.size > 0`.
- [x] 3.2 Add an "Export Selected" button to the toolbar. Refactor the `exportToCSV` function if necessary to accept an array of items filtered by `selectedIds`.
- [x] 3.3 Add a "Delete Selected" button to the toolbar. Implement the logic to filter out the `selectedIds` from the main `chrome.storage.local.get("scrapedData")` array, save it back, and reload the state.
- [x] 3.4 Ensure `selectedIds` state clears (resets to empty) whenever the user changes a filter (Search, Session, Rating, etc.) or successfully completes a batch delete.

## 4. UI Integration

- [x] 4.1 Update the main `Table` header to include a master `Checkbox` column.
- [x] 4.2 Update the `TableRow` mapping to render the individual `Checkbox` per row, passing the generated ID.
- [x] 4.3 Add a "WhatsApp" icon button (using Lucide's `MessageCircle` or a custom SVG) next to the phone number text, wrapping it in an `<a>` tag with the `formatWhatsAppLink`.
- [x] 4.4 Add a "Map Pin" icon button next to the address text, wrapping it in an `<a>` tag with the `formatMapsLink`.