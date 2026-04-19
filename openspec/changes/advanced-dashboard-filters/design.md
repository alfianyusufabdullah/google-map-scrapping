## Context

The current dashboard displays all scraped data from a session. While users can filter by a minimum rating or hide empty contacts, finding the "sweet spot" for B2B leads (e.g., businesses that aren't too small to afford services but aren't too large/corporate to reach the decision-maker) is difficult. We need to introduce a "Lead Quality Score", dynamic review ranges, and negative search keywords to make the table immediately actionable for sales teams.

## Goals / Non-Goals

**Goals:**
- Calculate a 0-100 "Lead Quality Score" based on predefined metrics (Website, Phone, Rating, Review volume).
- Allow users to filter the table by a specific range of reviews (e.g., 50 to 500 reviews).
- Enhance the search bar to parse `-keyword` syntax to exclude specific terms from the title or address.
- Provide a "Top Tier Leads" quick-filter toggle.

**Non-Goals:**
- We will **not** attempt complex natural language processing (NLP) on the address field to extract the city, as global address formats vary wildly and regex will be too brittle. Instead, we will rely on the enhanced search bar to let users type the city name.

## Decisions

- **Lead Quality Algorithm**: 
  - +30 points for having a Website.
  - +30 points for having a Phone Number.
  - +20 points if Rating is >= 4.0.
  - +20 points if Reviews are between 10 and 1000 (indicating an active but not overly-corporate business).
  - Total: 100 points.
- **Review Range UI**: We will add two number inputs (`minReviews` and `maxReviews`) to the sidebar.
- **Negative Search Logic**: The `searchQuery` will be split by spaces. Any term starting with `-` will be treated as an exclusion term. The filter will `return false` if the title or address includes the exclusion term.

## Risks / Trade-offs

- **[Risk] Complex UI**: Adding too many filters to the sidebar might make it overwhelming.
  - **Mitigation**: Group the new filters under logical headings like "Lead Quality" and "Review Volume" using Shadcn's layout tools.
- **[Trade-off] Hardcoded Scoring**: The lead scoring algorithm is hardcoded and might not fit every user's ideal customer profile.
  - **Mitigation**: Document the scoring logic clearly in the UI so users understand why a lead is marked "Top Tier".