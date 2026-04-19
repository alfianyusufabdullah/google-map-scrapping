## ADDED Requirements

### Requirement: In-Page Search Execution
The system SHALL execute the user's search query using the native Google Maps search box without opening new tabs.

#### Scenario: Native DOM Search
- **WHEN** the orchestrator receives the payload `{ context: "cafe", location: "Bali" }` while the active tab is Google Maps
- **THEN** it locates the `#searchboxinput` element, inputs "cafe Bali", and triggers the `#searchbox-searchbutton` click event.

### Requirement: Content Script Injection
The system SHALL trigger the `map-scraper-engine` after the search results feed is populated.

#### Scenario: Trigger scraping
- **WHEN** the Google Maps search feed container is rendered and populated
- **THEN** it initiates the card iteration and extraction sequence.
