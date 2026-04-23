## Context

The `useDashboard` hook manages the `pinnedSessions` state, which is an array of strings representing session IDs. When a session is renamed, the underlying data items in `scrapedData` are updated with the new `sessionId`. However, the `pinnedSessions` list in `chrome.storage.local` is not updated, leading to a disconnect.

## Goals / Non-Goals

**Goals:**
- Ensure `pinnedSessions` array is synchronized when a session is renamed.
- Update both local state and persistent storage during the rename operation.

**Non-Goals:**
- Modifying how pinning works (e.g., changing the ID type).
- Implementing bulk renaming features.

## Decisions

### Update `pinnedSessions` during `renameSession`
- **Choice:** Map through the current `pinnedSessions` array and replace the `oldName` with `newName` if it exists.
- **Rationale:** This is the most straightforward way to maintain the user's intent (keeping the session pinned) without complex logic.

### Atomic Storage Update
- **Choice:** Use a single `chrome.storage.local.set` call to update both `scrapedData` and `pinnedSessions`.
- **Rationale:** Prevents race conditions or partial updates where data is renamed but pinning is lost.

## Risks / Trade-offs

- **Risk:** If the storage update fails halfway (unlikely in local storage), data could be inconsistent.
- **Mitigation:** Wrap the update in the callback to ensure state only updates if storage was successful (already existing pattern in the hook).
