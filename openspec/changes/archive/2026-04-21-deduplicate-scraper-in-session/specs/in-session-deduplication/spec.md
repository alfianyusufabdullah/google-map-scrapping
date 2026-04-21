## ADDED Requirements

### Requirement: In-session content-based deduplication
The scraper SHALL maintain a normalized content key Set (`contentKeys`) within `performScraping()` to detect and discard duplicate business entries within the same session, regardless of whether they share the same card URL.

#### Scenario: Duplicate URL skipped before extraction
- **WHEN** a card's `href` is already in `scrapedIds`
- **THEN** the card is skipped immediately without clicking or extracting (existing behavior preserved)

#### Scenario: Duplicate content skipped after extraction
- **WHEN** a card has a unique `href` but its extracted `title` and `address`, after normalization, match a key already in `contentKeys`
- **THEN** the item is NOT added to `results[]` and `currentSessionCount` is NOT incremented
- **AND** a console log message is emitted: `SCRAPER: Duplicate detected, skipping: "<title>"`

#### Scenario: Unique item is recorded
- **WHEN** a card's normalized `title + address` key is NOT in `contentKeys`
- **THEN** the item is added to `results[]`, the key is added to `contentKeys`, and `currentSessionCount` is incremented as before

#### Scenario: Normalization is case-insensitive and trims whitespace
- **WHEN** two extractions return the same business name but with different casing or trailing spaces (e.g., `"Kopi Kenangan"` vs `"kopi kenangan "`)
- **THEN** the normalized key is identical and the second occurrence is treated as a duplicate

## MODIFIED Requirements

### Requirement: Scraping completion notification
The content script (`scraper.ts`) SHALL send a message to the side panel upon scraping completion. The payload MUST include the count of unique items saved (duplicates excluded).

#### Scenario: Successful scraping completion message
- **WHEN** scraping finishes by reaching the item limit or end of feed
- **THEN** the content script sends `{ action: "SCRAPING_COMPLETE", payload: { count: number, wasCancelled: false } }` where `count` reflects only non-duplicate items

#### Scenario: Cancelled scraping message
- **WHEN** scraping is halted by the stop signal
- **THEN** the content script sends `{ action: "SCRAPING_COMPLETE", payload: { count: number, wasCancelled: true } }` where `count` reflects only non-duplicate items

#### Scenario: Side panel receives and toasts the message
- **WHEN** the side panel receives a `SCRAPING_COMPLETE` message
- **THEN** it displays a `sonner` toast with the appropriate success or cancellation message using the unique-item count
