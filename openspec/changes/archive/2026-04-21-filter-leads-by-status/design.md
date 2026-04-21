## Context

The Results Dashboard currently filters scraped data based on intrinsic business properties (rating, reviews, presence of website/phone). Now that we have a mutable CRM layer (`crmData`), users need to filter based on their own categorization (Lead Status).

## Goals / Non-Goals

**Goals:**
- Enable filtering the leads list by a single lead status.
- Provide a "Show All" option to remove the status filter.
- Persist the filter selection during the active dashboard session.

**Non-Goals:**
- Multi-select status filtering (V1 will be single-select for simplicity).
- Filtering by notes content.
- Filtering by "last updated" timestamp.

## Decisions

### Decision 1: Filter UI Placement
**Choice**: Place a new `Select` component in the `SessionSidebar` under a "CRM Filters" heading.
**Rationale**: The sidebar is the established home for all view-modifying controls. Categorizing it under "CRM Filters" helps distinguish it from raw data filters.

### Decision 2: Filtering Implementation
**Choice**: Add `statusFilter` state to the `useDashboard` hook and incorporate it into the `filteredData` useMemo block.
**Rationale**: Centralizing the filtering logic in the hook ensures consistency and leverages existing patterns for reactivity and pagination resets.

### Decision 3: Default Value
**Choice**: The default `statusFilter` will be `"ALL"`.
**Rationale**: Users should see all data by default when opening a session.

## Risks / Trade-offs

- **[Risk] Complexity in `filteredData` memo** → As we add more filters, the `useMemo` dependency array and logic grow. 
- **[Mitigation]** The logic remains O(n) where n is the number of leads in the session (max 5,000), which is highly performant in React.
