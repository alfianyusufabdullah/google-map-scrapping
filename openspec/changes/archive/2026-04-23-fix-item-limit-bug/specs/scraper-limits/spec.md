## MODIFIED Requirements

### Requirement: User-Defined Item Limit
The system SHALL allow users to specify a maximum number of items to scrape, with a hard limit of 5,000. The scraping engine MUST strictly follow this limit and avoid using default values when a valid user limit is provided.

#### Scenario: Set valid limit greater than default
- **WHEN** user enters "1000" in the Item Limit field and clicks Start
- **THEN** the scraper session MUST initialize with a limit of 1000 and stop only after extracting 1000 items (or reaching the end of the feed).
