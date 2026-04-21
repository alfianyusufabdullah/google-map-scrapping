## ADDED Requirements

### Requirement: CRM Status Filter
The system SHALL allow users to filter the displayed leads by their assigned CRM status (NEW, CONTACTED, FOLLOW_UP, NOT_INTERESTED, CLOSED).

#### Scenario: Filter by Contacted status
- **WHEN** the user selects the "Contacted" status filter in the sidebar
- **THEN** the dashboard table updates to display only leads whose CRM status is "CONTACTED"

#### Scenario: Clear status filter
- **WHEN** the user selects the "All Statuses" option in the filter
- **THEN** the dashboard table removes the status-based restriction and displays leads of all statuses
