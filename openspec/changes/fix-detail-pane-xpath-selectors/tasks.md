## 1. Scraper Logic Updates

- [x] 1.1 Update the `ratingScore` XPath selector in `extractDetails` to use `following::` anchored to the `h1` element and language-agnostic patterns (e.g., `//h1/following::span[@aria-hidden="true" and (contains(text(), ".") or contains(text(), ","))][1]`).
- [x] 1.2 Update the `reviewCount` XPath selector in `extractDetails` to use `following::` anchored to the `h1` element and language-agnostic patterns (e.g., `//h1/following::span[contains(text(), "(") and contains(text(), ")")][1]`).
- [x] 1.3 Remove fallback selectors (like `//div[@role="main"]` or `F7kYyc`) that search the global document for rating/review data.
- [x] 1.4 Test the scraping logic locally by running the extension and verifying the scraped rating and reviews accurately reflect the active detail pane, avoiding duplication from the first result card.
