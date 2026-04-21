## ADDED Requirements

### Requirement: Separate Rating and Reviews
The system SHALL extract the numeric rating score (0-5) and the total review count as separate data fields.

#### Scenario: Accurate rating extraction
- **WHEN** a result card is being processed
- **THEN** the system extracts the rating score from the numeric rating element (e.g., span.MW4etd) and the review count from the count element (e.g., span.UY7F9), removing any parentheses.

### Requirement: Absolute Website Links
The system SHALL resolve all website URLs to their absolute form to prevent browser-specific extension prefixes.

#### Scenario: Absolute link resolution
- **WHEN** a website link is captured
- **THEN** the system ensures the captured URL is a complete, absolute link (e.g., starting with https://).
