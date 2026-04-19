## 1. Advanced Search Engine

- [x] 1.1 In `src/options.tsx`, update the `searchQuery` filtering logic to split by spaces and identify keywords prefixed with `-`.
- [x] 1.2 Implement the negative keyword logic: if an exclusion term is present in the `title` or `address`, `return false` for that row.
- [x] 1.3 Verify that normal (positive) search keywords still function as an `AND` operation for improved precision over the previous `OR` logic.

## 2. Lead Quality Scoring

- [x] 2.1 Create a helper function `calculateLeadScore(item: ScrapedData): number` in `src/options.tsx`.
- [x] 2.2 Implement the scoring algorithm: +30 for website, +30 for phone, +20 for rating >= 4.0, +20 for reviews between 10 and 1000.
- [x] 2.3 Add a new `showTopTierOnly` boolean state.
- [x] 2.4 Add a `Switch` toggle in the Sidebar under the "Filters" section labeled "Top Tier Leads (>80 Score)".
- [x] 2.5 Integrate the `showTopTierOnly` check into the `filteredData` computation.

## 3. Review Range Filtering

- [x] 3.1 Add `minReviews` and `maxReviews` numerical states (defaulting to 0 and Infinity/Empty respectively).
- [x] 3.2 Add two small `Input` fields in the Sidebar under the Filters section to control these boundaries.
- [x] 3.3 Parse the `item.reviewCount` string (removing commas) to a valid integer in the `filteredData` loop.
- [x] 3.4 Apply the `minReviews` and `maxReviews` boundary checks inside the `filteredData` logic.