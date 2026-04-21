## 1. Hook Updates (State & Filtering Logic)

- [x] 1.1 Add `statusFilter` state (default: `"ALL"`) to `src/lib/hooks/use-dashboard.ts`.
- [x] 1.2 Update the `filteredData` useMemo in `use-dashboard.ts` to include lead status filtering by checking `crmData[generateRowId(item)]`.
- [x] 1.3 Add `handleStatusFilterChange` function to update state and reset current page to 1.
- [x] 1.4 Expose `statusFilter` and `handleStatusFilterChange` from the hook.

## 2. Sidebar UI Updates

- [x] 2.1 Update `SessionSidebarProps` in `src/components/dashboard/SessionSidebar.tsx` to include `statusFilter` and `onStatusFilterChange`.
- [x] 2.2 Implement a new "CRM Filters" section in `SessionSidebar.tsx` with a `Select` component for lead status.
- [x] 2.3 Populate the `Select` with options: "All Statuses", "New", "Contacted", "Follow Up", "Not Interested", "Closed".

## 3. Integration

- [x] 3.1 In `src/options.tsx`, pass `statusFilter` and `handleStatusFilterChange` from `useDashboard` to the `<SessionSidebar>` component.
