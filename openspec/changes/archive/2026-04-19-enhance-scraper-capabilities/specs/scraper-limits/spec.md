## ADDED Requirements

### Requirement: User-Defined Item Limit
The system SHALL allow users to specify a maximum number of items to scrape, with a hard limit of 5,000.

#### Scenario: Set valid limit
- **WHEN** user enters "100" in the Item Limit field and clicks Start
- **THEN** the scraper stops after extracting 100 items

### Requirement: Anti-Detection Delay
The scraper SHALL implement a randomized delay of 2 seconds (+/- 500ms) between significant DOM interactions.

#### Scenario: Delay between clicks
- **WHEN** the scraper finishes extracting details for one card
- **THEN** it waits for a random duration between 1.5s and 2.5s before clicking the next card
