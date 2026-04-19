## ADDED Requirements

### Requirement: Identify Result Cards
The system SHALL identify all Google Maps place result cards present within the active feed container.

#### Scenario: Feed parsing
- **WHEN** the content script scans the DOM
- **THEN** it correctly identifies result cards by querying the corresponding transparent anchor tag wrappers (`a.hfpxzc` or equivalent structural selector).

### Requirement: Detail Pane Interaction
The system SHALL click each result card sequentially, wait for the detailed information pane to load, and return to the main feed after extraction.

#### Scenario: Detail extraction flow
- **WHEN** a result card is identified and has not been scraped yet
- **THEN** the system clicks the card, waits for the DOM to render the Detail Pane, extracts the robust XPath data points, and triggers the "Back to results" action.

### Requirement: Extract Data Points via XPath
The system SHALL extract Title, Rating, Reviews, Address, Phone, and Website from the detailed pane using robust semantic XPath selectors.

#### Scenario: Robust XPath extraction
- **WHEN** the detailed pane is fully loaded
- **THEN** the system extracts text content prioritizing `data-item-id`, `aria-label`, and `h1` selectors over obfuscated classes.

### Requirement: Auto-scroll Feed
The system SHALL simulate user scrolling on the feed container to load more results.

#### Scenario: Continuous scrolling
- **WHEN** the scraping loop is active
- **THEN** the system scrolls the feed container to the bottom and waits for new cards to render before repeating.
