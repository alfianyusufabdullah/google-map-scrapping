## MODIFIED Requirements

### Requirement: Detail Pane Interaction
The system SHALL click each result card sequentially, wait for the detailed information pane to load, extract data using contextual selectors anchored strictly to the detail pane to prevent capturing data from the background feed, and return to the main feed after extraction, while respecting randomized anti-detection delays.

#### Scenario: Detail extraction flow with delay
- **WHEN** a result card is identified and has not been scraped yet
- **THEN** the system waits for a randomized delay (approx 2s), clicks the card, waits for the DOM to render the Detail Pane, extracts data using selectors that restrict search scope to the active pane (e.g. anchoring to the pane's title), and triggers the "Back to results" action.
