## MODIFIED Requirements

### Requirement: Trigger Scraping Process
The system SHALL provide a button to start the scraping process which sends the target context and location to the background orchestrator.

#### Scenario: Dispatch payload
- **WHEN** the user inputs "cafe" for context and "Bali" for location and clicks "Start Scraping"
- **THEN** the UI dispatches a `START_SCRAPING` message to the background worker containing these parameters.
