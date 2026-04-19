## ADDED Requirements

### Requirement: Compute Lead Quality Score
The system SHALL compute a 0-100 score for each scraped business based on data completeness and reputation metrics.

#### Scenario: Business with full data and great reputation
- **WHEN** a business has a website, phone number, rating >= 4.0, and reviews between 10 and 1000
- **THEN** its Lead Quality Score is calculated as 100.

#### Scenario: Business with missing contact info
- **WHEN** a business lacks a website but has a phone and good reviews
- **THEN** its Lead Quality Score is penalized by 30 points (Max 70).

### Requirement: Filter by Top Tier Leads
The dashboard SHALL provide a UI toggle to display only "Top Tier Leads" (Score >= 80).

#### Scenario: User enables the Top Tier toggle
- **WHEN** the user switches on the "Top Tier Leads" filter
- **THEN** the table only renders businesses that achieved a Lead Quality Score of 80 or higher.
