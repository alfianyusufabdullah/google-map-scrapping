## Context

The scraper's `performScraping()` function currently tracks visited cards using a `scrapedIds = new Set<string>()` keyed by the card's `href` URL. This prevents the same URL from being clicked twice within a session but does not guard against two different URLs resolving to the same business (e.g., a place appearing in both a standard slot and a featured slot). The result is duplicate rows in the exported CSV.

The fix is a second, complementary in-memory Set keyed by a normalized version of the business name and address — the two most stable and human-meaningful identifiers available in the scraped data.

## Goals / Non-Goals

**Goals:**
- Eliminate within-session duplicate rows caused by a business appearing under multiple card URLs
- Keep the check purely in-memory (no storage reads during the loop)
- Preserve the existing URL-based guard (`scrapedIds`) as a first-pass filter
- Ensure `currentSessionCount` only increments for genuinely unique items

**Non-Goals:**
- Cross-session deduplication (out of scope per requirements)
- Fuzzy/phonetic matching of business names
- Deduplication in the dashboard or on export
- Any UI changes

## Decisions

### Decision 1: Key = normalized(title) + normalized(address), phone excluded

**Choice**: `key = title.toLowerCase().trim() + "|" + address.toLowerCase().trim()`

**Rationale**: Phone is frequently empty or formatted inconsistently across renders (`0812-xxx` vs `08123xxx`). Including it would cause false negatives — a business scraped twice would not be recognized as a duplicate if one extraction missed the phone. Title and address are both always present (an item is skipped if `details.title` is empty) and stable enough for within-session matching.

**Alternative considered**: Exact string match without normalization. Rejected because Google Maps occasionally varies casing or trailing whitespace between renders, which would cause missed deduplication.

### Decision 2: Second Set initialized once at start of `performScraping()`

**Choice**: `const contentKeys = new Set<string>()` alongside `scrapedIds`, initialized once before the loop.

**Rationale**: Since scope is within-session only, no storage read is needed. The Set lives entirely in memory for the duration of the scraping run and is discarded with the function. This is O(1) per lookup and adds zero I/O overhead.

### Decision 3: URL guard (`scrapedIds`) is kept as first-pass filter

**Choice**: Maintain both Sets — URL check first, content check second.

**Rationale**: URL deduplication is cheaper (no extraction required) and handles the common case of the same card re-appearing after scroll. The content key check only runs after a card has been clicked and details extracted, serving as a safety net for the rarer case of different URLs pointing to the same business.

## Risks / Trade-offs

- **[Risk] Normalization collapses legitimately different businesses with similar names** → Mitigation: The key uses both title AND address. Two different branches of "Indomaret" will have different addresses and will NOT be collapsed.
- **[Risk] Address format variation across renders** → Low probability within a single session since the DOM structure is stable during one scraping run. Acceptable trade-off.
- **[Trade-off] A skipped duplicate still consumed scraping time** → The card was clicked and details extracted before the content key was checked. This is unavoidable without pre-extraction deduplication, which is impossible since we don't know the title/address before clicking. The URL guard already prevents the most common re-click cases.
