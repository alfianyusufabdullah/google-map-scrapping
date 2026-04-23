## 1. Logic Implementation

- [x] 1.1 Update `renameSession` in `src/lib/hooks/use-dashboard.ts` to map `pinnedSessions` array.
- [x] 1.2 Include `pinnedSessions` in the `chrome.storage.local.set` payload within the rename callback.
- [x] 1.3 Ensure `setPinnedSessions` local state is updated after storage sync.

## 2. Verification

- [x] 2.1 Pin a session named "Original".
- [x] 2.2 Rename "Original" to "New Name".
- [x] 2.3 Verify that "New Name" remains pinned and "Original" is no longer in the storage/state.
- [x] 2.4 Run `npm run typecheck` to ensure no regressions.
