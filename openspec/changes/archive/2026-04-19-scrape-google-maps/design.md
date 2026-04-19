## Context

Google Maps relies heavily on client-side rendering and infinite scrolling. A direct API call approach is prohibited or heavily rate-limited by Google without an expensive enterprise API key. Therefore, extracting search result data through DOM parsing via Chrome Extension Content Scripts provides a viable zero-cost alternative. The user will specify context (e.g., "coffee shop") and location (e.g., "Bali") from the extension popup/sidepanel to initiate scraping on an already active Google Maps tab.

## Goals / Non-Goals

**Goals:**
- Reliable DOM scraping of Google Maps by simulating native search and detail pane navigation.
- Auto-scroll mechanism to bypass lazy loading.
- Clean inter-process communication between Side Panel, Background Worker, and Content Script.
- Saving scraped data into Chrome's local storage for export.

**Non-Goals:**
- Scraping deep review data (only high-level stats like review count and average rating are captured).
- Bypassing captchas or advanced rate-limiting (assumed running under normal user session).

## Decisions

- **Content Script Injection**: We will use Plasmo's content script injection targeting `https://www.google.com/maps/*`. The script will listen for a trigger message from the Background worker.
- **Message Passing Protocol**: The Side Panel dispatches `{ action: "START_SCRAPING", payload: { context, location } }` to the Content Script directly via the active tab, assuming the user is already on Google Maps.
- **Search Orchestration**: The Content Script will directly input the combined `{context} {location}` query into `input#searchboxinput` and click `button#searchbox-searchbutton`.
- **Detail Pane Extraction**: The scraper will click each result `a.hfpxzc` in the feed, wait for the Detail Pane to slide in, and use highly robust XPath locators (e.g., `//button[@data-item-id="address"]`) to extract Phone, Website, Address, Rating, and Title.
- **Auto-Scrolling strategy**: An interval-based JS script that selects the `role="feed"` element and scrolls it `scrollTo(0, scrollHeight)` every X seconds until `scrollHeight` no longer changes.

## Risks / Trade-offs

- **Risk: DOM Class Mutation** -> Google updates obfuscated classes frequently.
  - **Mitigation**: Use ARIA labels, structural hierarchy (e.g., extracting the `h1` inside the link), and provide an easy way to update selectors centrally using XPath.
- **Risk: Infinite Scroll Loop** -> The scraper might never stop if Google Maps keeps loading irrelevant broad matches.
  - **Mitigation**: Implement a max-results limit (e.g., stop after 100 records) or a manual "Stop Scraping" button.
