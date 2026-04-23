## Why

Currently, when a user renames a scraping session, the session ID is updated in the `scrapedData` collection but remains unchanged in the `pinnedSessions` list. This causes pinned sessions to disappear from the pinned list because the reference (the old session name) no longer points to a valid session. This bug breaks the session management user experience.

## What Changes

- Update the `renameSession` logic in `useDashboard` to synchronize the `pinnedSessions` list.
- Ensure that if a renamed session was pinned, its entry in the `pinnedSessions` list is updated to the new name.
- Maintain persistence of the pinning state across renames.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `session-management`: Update session renaming requirement to include synchronization of pinning state.

## Impact

- `src/lib/hooks/use-dashboard.ts`: The `renameSession` function will be modified to handle `pinnedSessions` state and storage synchronization.
- `chrome.storage.local`: A new write operation for `pinnedSessions` will be added to the renaming flow.
