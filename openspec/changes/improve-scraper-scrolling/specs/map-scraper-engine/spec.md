## MODIFIED Requirements

### Requirement: Auto-scroll Feed
The system SHALL simulate user scrolling on the feed container to load more results. If a scroll attempt does not yield new content, the system MUST perform up to 3 retries, including "nudge" scrolls (scrolling up then back down), to trigger lazy-loading observers before concluding the feed has ended.

#### Scenario: Robust scrolling with retries
- **WHEN** the item limit has not been reached and a scroll attempt does not increase the feed height
- **THEN** the system performs a nudge scroll (up 100px, then down to bottom), waits for loading, and retries the height check up to 3 times before terminating the session.
