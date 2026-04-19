## Context

The current Google Maps scraper uses global class-based XPath selection (`//span[contains(@class, "MW4etd")]`) to extract ratings. Because the search results feed remains in the DOM when a specific place is clicked, these global selectors match the first element in the entire DOM (i.e., the first result card) instead of the rating displayed in the detail pane.

## Goals / Non-Goals

**Goals:**
- Implement contextual XPath selectors that restrict search strictly to the detail pane.
- Fix the bug where rating and review data is erroneously duplicated from the first search result.

**Non-Goals:**
- Completely redesign the scraper's execution flow.
- Add new scraping data fields.

## Decisions

- **Decision:** Use the `following::` XPath axis anchored to the detail pane title (`h1`).
  - **Rationale:** The detail pane title is reliably unique (only one `h1` exists at a time on the page). By using `following::` anchored to `h1`, combined with **language-agnostic structural patterns** (e.g., looking for parentheses `()` for reviews, or decimal formats for ratings), we can find the next occurring rating/review in the DOM tree. This guarantees it belongs to the detail pane that was just opened, bypassing the feed elements, preventing breakage from obfuscated class changes (like `DUwDvf` or `MW4etd`), and supporting any locale (Spanish, French, English, etc.).
  - **Alternative Considered:** Finding the closest common container using `ancestor::div`. This is riskier as Google Maps frequently alters container nesting levels and structure.

## Risks / Trade-offs

- **Risk:** Google Maps changes the layout such that the rating visually appears above the `h1` in the DOM tree, breaking the `following::` selector.
  - **Mitigation:** Fallback logic could be implemented if this occurs. Currently, `following::` is the most reliable and simplest approach based on standard Google Maps DOM structure.
