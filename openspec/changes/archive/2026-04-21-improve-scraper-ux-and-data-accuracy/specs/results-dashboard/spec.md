## ADDED Requirements

### Requirement: Session Grouping
The results dashboard SHALL display data grouped by scraping sessions, ordered by most recent first.

#### Scenario: Viewing grouped results
- **WHEN** the dashboard is loaded
- **THEN** users see results organized in sections or collapsibles corresponding to each search session.

### Requirement: Custom ScrollArea
The dashboard SHALL use a stylized custom scroll component instead of the native browser scrollbar.

#### Scenario: Premium scrolling interaction
- **WHEN** content exceeds the viewport height
- **THEN** the system renders a Shadcn ScrollArea component for navigation.
