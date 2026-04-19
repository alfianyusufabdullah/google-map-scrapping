## ADDED Requirements

### Requirement: Advanced Filter UI Integration
The dashboard sidebar SHALL visually group advanced filtering toggles (Top Tier Leads, Min/Max Reviews) alongside the existing display and sorting controls to keep the UI organized.

#### Scenario: User navigates the advanced filters
- **WHEN** the dashboard is loaded
- **THEN** the sidebar displays a new section titled "Advanced Filtering" or integrates seamlessly into the "Display & Sort" section with clear label hierarchy.
- **AND** the changes in filter state immediately reflect on the `paginatedData` in the main table view without page reloads.
