## MODIFIED Requirements

### Requirement: Detail Pane Interaction
The system SHALL click each result card sequentially, wait for the detailed information pane to load, and return to the main feed after extraction, while respecting randomized anti-detection delays.

#### Scenario: Detail extraction flow with delay
- **WHEN** a result card is identified and has not been scraped yet
- **THEN** the system waits for a randomized delay (approx 2s), clicks the card, waits for the DOM to render the Detail Pane, extracts data, and triggers the "Back to results" action.

### Requirement: Auto-scroll Feed
The system SHALL simulate user scrolling on the feed container to load more results, respecting session item limits and anti-detection delays.

#### Scenario: Continuous scrolling with limits
- **WHEN** the scraping loop is active and the user-defined item limit has not been reached
- **THEN** the system scrolls the feed container, waits for a randomized delay (approx 2s) for content to load, and continues the extraction loop.
