## Why

With the introduction of Mini CRM features (statuses and notes), users now have a growing volume of categorized leads. To efficiently manage outreach, users need the ability to filter the dashboard view by lead status (e.g., viewing only "NEW" leads or excluding "REJECTED" ones).

## What Changes

- Add a "Lead Status" filter section in the `SessionSidebar.tsx`.
- Update the `useDashboard` hook to include `statusFilter` state and apply it to the `filteredData` calculation.
- Support "All" statuses (default) and individual status filtering.

## Capabilities

### New Capabilities
- `status-filtering`: Ability to filter the leads list by their CRM status.

### Modified Capabilities
- `results-dashboard`: The sidebar will be extended to include CRM status filters.

## Impact

- `src/lib/hooks/use-dashboard.ts`: New filter state and updated `filteredData` logic.
- `src/components/dashboard/SessionSidebar.tsx`: UI for the status filter (dropdown or checkbox list).
- `src/options.tsx`: Passing new filter props to the sidebar.
