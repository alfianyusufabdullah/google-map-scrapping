## ADDED Requirements

### Requirement: Session Identification
The system SHALL assign a unique session ID and timestamp to each scraping operation.

#### Scenario: New session start
- **WHEN** a user starts a scraping process
- **THEN** the system generates a unique identifier and records the start timestamp for the current batch.

### Requirement: Grouped Data Storage
The system SHALL store scraped items grouped by their respective session identifiers in the local database.

#### Scenario: Data storage with session ID
- **WHEN** items are scraped
- **THEN** they are saved with the current session ID to enable grouping in the dashboard.
