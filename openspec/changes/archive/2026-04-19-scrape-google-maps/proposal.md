## Why

The primary goal of this extension is to allow users to automatically scrape point-of-interest data from Google Maps. Users need a reliable and structured way to extract information (like coffee shops in Bali) without manual copy-pasting, which is tedious and error-prone. This change provides the core extraction engine that connects the user's input context and location to the actual DOM scraping process.

## What Changes

- Implement a background service worker or content script to orchestrate the search and scraping process on Google Maps.
- Create an entry point for users to input a target `context` (e.g., "coffee shop") and `location` (e.g., "Bali").
- Automatically inject input into the active Google Maps tab's search box and trigger the search natively without opening a new tab.
- Iterate over search results, click each result to open the Detail Pane, and extract robust data points (Name, Rating, Reviews, Address, Phone, Website) using stable XPath locators.
- Implement auto-scrolling to bypass Google Maps' lazy loading of search results.

## Capabilities

### New Capabilities
- `map-scraper-engine`: The core content script logic responsible for driving the Google Maps DOM. It clicks individual result cards, extracts structured data from the detailed pane using XPath, closes the pane, and manages feed auto-scrolling.
- `search-orchestrator`: Logic to populate the existing Google Maps search box (`#searchboxinput`) with the user's query and simulate a click on the search button (`#searchbox-searchbutton`).

### Modified Capabilities
- `extension-ui`: Update the side panel to hook the "Start Scraping" button into the `search-orchestrator` capability, passing the user-defined `location` and `context` inputs.

## Impact

- **Extension Permissions**: May require adding `scripting` and `tabs` permissions to inject content scripts into `google.com/maps`.
- **Background Worker**: Needs to act as a bridge between the Side Panel UI and the Content Script injected into Google Maps.
- **Content Scripts**: New content scripts will be added to the build process (`plasmo`).
