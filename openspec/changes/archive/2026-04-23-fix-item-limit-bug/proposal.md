## Why

Fix the issue where the scraping item limit is stuck at 500 (the default value) even when the user specifies a different limit. This bug is caused by a race condition between the side panel and the content script, combined with a delayed storage update and aggressive default fallbacks.

## What Changes

- **Instant State Sync**: Modify the side panel to update the `currentSessionLimit` in local storage immediately when the "Start" button is clicked, rather than waiting for the content script to do it.
- **Strict Limit Enforcement**: Update the content script to use the passed `limit` strictly and avoid falling back to the default 500 if a valid limit is present in the message payload.
- **UI Responsiveness**: Ensure the side panel UI reflects the user's chosen limit immediately upon starting the session to avoid user confusion.

## Capabilities

### Modified Capabilities
- `scraper-limits`: Ensure strict adherence to user-defined limits and eliminate default value overrides.
- `extension-ui`: Synchronize session limits immediately between UI state and local storage.

## Impact

- `src/sidepanel.tsx`: Update `handleStartScraping` to set `currentSessionLimit`.
- `src/contents/scraper.ts`: Update `performScraping` call and state initialization.
