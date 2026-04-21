## Context

The Google Maps Scraper is functional but lacks professional polish in its UI and data extraction. Key pain points include incorrect rating formatting, relative URLs appearing in the results, and a lack of organization in the data dashboard.

## Goals / Non-Goals

**Goals:**
- Separate rating score from review count.
- Fix link resolution for websites.
- Implement session-based grouping in the dashboard.
- Provide real-time progress feedback in the side panel.
- Upgrade dashboard UI with `ScrollArea` and `Accordion`.

**Non-Goals:**
- Changing the underlying scraping technology (still based on DOM injection).
- Adding multi-tab scraping.

## Decisions

- **Session-Based Data Model**: 
    - A `ScrapingSession` object will be created at the start of each run.
    - Each item in `scrapedData` will now include a `sessionId` field.
    - Rationale: Enables historical tracking and organization in the dashboard without complex filtering.
- **Progress Communication**:
    - The content script will update `chrome.storage.local` with `currentSessionCount` during extraction.
    - The Side Panel will use a `chrome.storage.onChanged` listener to provide real-time numeric feedback.
    - Rationale: Decouples UI from the content script execution while maintaining near real-time updates.
- **DOM Extraction Improvements**:
    - Rating Score: Use `span.MW4etd` (text).
    - Review Count: Use `span.UY7F9` (text, stripped of parentheses).
    - Link Resolution: Use `getAttribute('href')` and resolve against `window.location.origin` if relative.
- **UI Components**: 
    - Use Shadcn `Accordion` for sessions.
    - Use Shadcn `ScrollArea` for the results table.

## Risks / Trade-offs

- **[Risk] DOM Change**: Google Maps frequently changes CSS classes (e.g., `MW4etd`).
    - **Mitigation**: Implement a fallback selector array and log warnings if both primary and secondary selectors fail.
- **[Trade-off] Storage Overhead**: Adding session metadata and IDs to every record increases storage footprint.
    - **Mitigation**: Negligible impact given the `unlimitedStorage` permission and the relatively small size of text data.
