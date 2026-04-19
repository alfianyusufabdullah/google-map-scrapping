## MODIFIED Requirements

### Requirement: Trigger Scraping Process
The system SHALL provide a button to start the scraping process which validates inputs and sends the target context, location, and item limit to the background orchestrator.

#### Scenario: Dispatch payload with limit
- **WHEN** the user inputs "cafe", "Bali", and a limit of "100" and clicks "Start Scraping"
- **THEN** the UI validates that all fields are filled and dispatches a `START_SCRAPING` message with the full payload.

## ADDED Requirements

### Requirement: Active Scraping UI Feedback
The side panel SHALL disable the "Start Scraping" button and show a loading indicator while a scraping session is active.

#### Scenario: Visual feedback during active session
- **WHEN** the system state `isScraping` is true
- **THEN** the "Start Scraping" button is disabled and a spinner/loading icon is displayed.
