## Why

Within a single scraping session, Google Maps can surface the same business listing under multiple cards — for example when a place appears in both a regular result and a featured/sponsored slot, or when the virtual feed re-renders cards after scrolling. The current deduplication mechanism tracks visited card URLs (`scrapedIds`), but two different URLs can point to the same physical business, causing duplicate rows in the exported data.

## What Changes

- **Add a normalized content key Set** (`contentKeys`) in `performScraping()` alongside the existing `scrapedIds` URL set.
- **Before pushing a result**, compute a normalized key from `title` and `address` (lowercase + trimmed) and skip the item if the key already exists in `contentKeys`.
- **Log skipped duplicates** to the console for debugging visibility.
- No changes to the data schema, storage format, UI, or cross-session behavior.

## Capabilities

### New Capabilities

- `in-session-deduplication`: Content-based deduplication of scraped results within a single run, using a normalized `title + address` key to detect and discard duplicate business entries before they are added to the session results.

### Modified Capabilities

- `map-scraper-engine`: The scraping loop gains a second deduplication guard. Requirement changes: items with a matching normalized title+address MUST be skipped even if their URL differs from previously visited cards.

## Impact

- **File modified**: `src/contents/scraper.ts` only — one function, ~5 lines added
- **No new dependencies**
- **No schema changes** to `ScrapedData` or `chrome.storage`
- **`currentSessionCount`** will reflect only unique items (duplicates are not counted)
- **No behavioral impact** on the dashboard, export, or cross-session data
