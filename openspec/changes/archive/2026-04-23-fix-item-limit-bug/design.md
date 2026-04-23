## Context

The current scraping architecture has a synchronization gap. When a user starts scraping, the Side Panel sets `isScraping: true` but does not update `currentSessionLimit` in storage. The content script waits 7 seconds for the page to load before it finally sets `currentSessionLimit` to the user's value. During this window, the UI defaults to 500, leading to user confusion and potentially misconfigured scraping sessions.

## Goals / Non-Goals

**Goals:**
- Synchronize the session limit immediately upon starting a session.
- Ensure the scraper engine uses the exact numeric limit provided by the user.
- Fix UI feedback that incorrectly displays 500 as the limit during the initial search phase.

**Non-Goals:**
- Changing the 7-second search timeout (necessary for Google Maps navigation).
- Modifying the maximum cap of 5000 items.

## Decisions

- **Eager Storage Updates**: Update `src/sidepanel.tsx` to include `currentSessionLimit` in the initial `chrome.storage.local.set` call within `handleStartScraping`.
- **UI State Pre-empting**: Explicitly call `setCurrentSessionLimit(limit)` in `sidepanel.tsx` before sending the message to ensure the local React state is correct even before the storage listener fires.
- **Robust Scraper Defaults**: Modify `src/contents/scraper.ts` to log a warning if `limit` is missing from the payload, but prioritize the payload value over any hardcoded defaults.
- **Type Safety**: Ensure `limit` is explicitly cast to a number in the content script message listener to avoid coercion issues.

## Risks / Trade-offs

- **[Risk] State Desync**: If the storage update fails but the message is sent, the UI and Scraper might disagree. → **Mitigation**: Use a single storage call for both `isScraping` and `currentSessionLimit`.
