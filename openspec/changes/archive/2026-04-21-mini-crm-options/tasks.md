## 1. CRM Data Types & Utilities

- [x] 1.1 Define `LeadStatus` type ("NEW" | "CONTACTED" | "FOLLOW_UP" | "NOT_INTERESTED" | "CLOSED") in `src/lib/utils/scraper-utils.ts`.
- [x] 1.2 Define `CrmData` interface (`status: LeadStatus`, `notes: string`, `lastUpdated: number`) in `src/lib/utils/scraper-utils.ts`.

## 2. Dashboard Hook Updates

- [x] 2.1 Update `src/lib/hooks/use-dashboard.ts` to add `crmData` state dictionary (`Record<string, CrmData>`).
- [x] 2.2 Update `loadData` inside `use-dashboard.ts` to fetch `crmData` from `chrome.storage.local` alongside `scrapedData`.
- [x] 2.3 Implement `updateCrmData(rowId, updates)` function inside `use-dashboard.ts` that merges updates, sets `lastUpdated`, and saves to `chrome.storage.local`.
- [x] 2.4 Expose `crmData` and `updateCrmData` from the `useDashboard` hook return payload.

## 3. UI: Status Badges in Leads Table

- [x] 3.1 Update `LeadsTableProps` in `src/components/dashboard/LeadsTable.tsx` to receive the `crmData` dictionary and an `onRowClick` callback.
- [x] 3.2 Add a new "Status" column header (`TableHead`) in `LeadsTable.tsx`.
- [x] 3.3 Render a Shadcn `Badge` in the new "Status" column showing `crmData[rowId]?.status || "NEW"`, with varying colors depending on status.

## 4. UI: Slide-out CRM Drawer (Sheet)

- [x] 4.1 Create `src/components/dashboard/CrmDrawer.tsx` to display the Shadcn `Sheet` component.
- [x] 4.2 The Drawer should accept `selectedLead`, `crmRecord`, `isOpen`, `onClose`, and `onUpdate(updates)`.
- [x] 4.3 Add a `<Select>` dropdown in `CrmDrawer.tsx` for updating the `LeadStatus`.
- [x] 4.4 Add a `<Textarea>` in `CrmDrawer.tsx` for the notes field.
- [x] 4.5 Wire the `onUpdate` callback to save changes when status or notes change.

## 5. UI: Integration in Options Page

- [x] 5.1 In `src/options.tsx`, add state to track the `drawerLead` (the lead currently opened in the drawer) and `isDrawerOpen`.
- [x] 5.2 Pass `crmData` to the `<LeadsTable>` component, and wire `onRowClick` to open the drawer.
- [x] 5.3 Modify `LeadsTable` rows to call `onRowClick(item)` when the row is clicked (but prevent it when clicking the checkbox or links).
- [x] 5.4 Render the `<CrmDrawer>` inside the `OptionsIndex` view, passing `crmData[generateRowId(drawerLead)]` and wiring the `updateCrmData` function.