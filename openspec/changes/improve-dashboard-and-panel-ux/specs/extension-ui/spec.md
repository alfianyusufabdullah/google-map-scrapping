## MODIFIED Requirements

### Requirement: Panel active scraping state
The extension SHALL display an active scraping UI state when `isScraping` is true, indicating the process is running.

#### Scenario: User initiates a scrape
- **WHEN** the user clicks "Start Scraping"
- **THEN** the progress counts (`currentSessionCount` and `currentSessionLimit`) are immediately reset to 0 in both the component state and local storage.
- **AND** the panel UI shifts to a prominent active state card displaying the current progress.
- **AND** the configuration inputs are hidden or disabled.
