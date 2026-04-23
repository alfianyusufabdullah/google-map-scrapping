## MODIFIED Requirements

### Requirement: Trigger Scraping Process
The system SHALL provide a button to start the scraping process which validates inputs and sends the target context, location, and item limit to the background orchestrator.

#### Scenario: Dispatch payload with limit and sync storage
- **WHEN** the user inputs "cafe", "Bali", and a limit of "100" and clicks "Start Scraping"
- **THEN** the UI validates inputs, dispatches a `START_SCRAPING` message, and IMMEDIATELY updates local storage with `isScraping: true` and `currentSessionLimit: 100`.
