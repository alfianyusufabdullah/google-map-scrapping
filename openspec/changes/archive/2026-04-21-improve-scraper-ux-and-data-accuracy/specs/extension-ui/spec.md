## MODIFIED Requirements

### Requirement: Trigger Scraping Process
The system SHALL provide a button to start the scraping process which validates inputs and sends the target context, location, and item limit to the background orchestrator, with auto-scrolling behavior enabled by default.

#### Scenario: Dispatch payload with limit and implicit auto-scroll
- **WHEN** the user inputs "cafe", "Bali", and a limit of "100" and clicks "Start Scraping"
- **THEN** the UI validates inputs and dispatches a `START_SCRAPING` message, ensuring the scraper engine is instructed to auto-scroll without requiring a separate toggle.
