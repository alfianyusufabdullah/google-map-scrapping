## MODIFIED Requirements

### Requirement: Session grouping
The dashboard SHALL group scraped data by `sessionId` allowing users to view data from distinct scraping runs.

#### Scenario: User views the results dashboard
- **WHEN** the dashboard loads
- **THEN** it displays a `Select` dropdown listing all available sessions.
- **AND** the table only displays data for the currently selected session.
- **AND** the table expands naturally within the document flow without a constrained `ScrollArea`.
- **AND** if no session is explicitly chosen, it defaults to the most recent session or displays a placeholder.
