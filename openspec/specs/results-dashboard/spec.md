## ADDED Requirements

### Requirement: Results Dashboard Entry Point
The extension SHALL provide a dedicated full-page dashboard (Options Page) to view scraped results.

#### Scenario: Open dashboard from side panel
- **WHEN** user clicks the "View Results Database" button in the Side Panel
- **THEN** a new tab opens showing the Results Dashboard page

### Requirement: Scraped Data Table
The dashboard SHALL display all scraped data in a tabular format using Shadcn UI components.

#### Scenario: Display existing data
- **WHEN** the dashboard page loads
- **THEN** it retrieves data from `chrome.storage.local` and renders it in a paginated table

### Requirement: Data Pagination
The results table SHALL implement pagination to handle up to 5,000 items without degrading performance.

#### Scenario: Navigate between pages
- **WHEN** user clicks the "Next" or "Previous" page buttons
- **THEN** the table updates to show the corresponding subset of 50 items
