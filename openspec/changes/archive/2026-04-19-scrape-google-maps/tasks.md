## 1. Extension Configurations

- [x] 1.1 Update `package.json` manifest section to include `scripting`, `tabs`, and `host_permissions` for Google Maps.

## 2. Orchestrator Logic (Background)

- [x] 2.1 Forward `START_SCRAPING` messages from the Side Panel directly to the active tab's Content Script.
- [x] 2.2 Verify that the active tab's URL matches `https://www.google.com/maps/*` before forwarding the message.

## 3. Map Scraper Engine (Content Script)

- [x] 3.1 Create content script file `src/contents/scraper.ts` targeting Google Maps URL matches.
- [x] 3.2 Listen to `START_SCRAPING` message.
- [x] 3.3 Implement DOM interaction to populate `#searchboxinput` and click `#searchbox-searchbutton`.
- [x] 3.4 Implement the sequential card clicking loop (finding `a.hfpxzc` and clicking them).
- [x] 3.5 Implement `extractDetails` function using `document.evaluate` and robust XPaths (`data-item-id`, `aria-label`).
- [x] 3.6 Implement the "Back to results" click action to return to the feed list.
- [x] 3.7 Implement auto-scroll interval loop targeting the `role="feed"` element container.
- [x] 3.8 Dispatch scraped batch data to `chrome.storage.local` to be aggregated for the Options page.

## 4. UI Hookups

- [x] 4.1 Update `src/sidepanel.tsx` to handle the "Start Scraping" button click and dispatch `chrome.runtime.sendMessage` with the input state (keyword/location and context).
- [x] 4.2 Validate inputs before sending the message to ensure location/context are not empty.
