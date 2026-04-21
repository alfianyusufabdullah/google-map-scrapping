## ADDED Requirements

### Requirement: Progress Reporting
The scraper engine SHALL periodically update the total number of items found in the current session.

#### Scenario: Real-time count update
- **WHEN** a new item is successfully scraped
- **THEN** the system updates a persistent counter in storage accessible by the side panel.

### Requirement: Side Panel Progress Display
The side panel SHALL display the current progress (items found / limit) during an active scraping session.

#### Scenario: Progress feedback
- **WHEN** scraping is active
- **THEN** the side panel shows the live count of extracted items retrieved from storage.
