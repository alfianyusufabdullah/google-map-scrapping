## Why

The current Google Maps scraper dashboard provides basic filtering and sorting, but users analyzing B2B leads need more granular control to quickly identify high-value targets. By introducing advanced geographic parsing, a composite "Lead Quality" score, and dynamic review count ranges, users can effortlessly filter out low-value or enterprise-sized businesses that don't fit their ideal customer profile.

## What Changes

- **City/Region Filtering**: Add functionality to parse the city or region from the raw address string, allowing users to filter leads by specific geographic areas.
- **Lead Quality Score**: Implement an internal scoring algorithm that evaluates a business based on the presence of a website, phone number, high ratings, and adequate reviews. Add a UI toggle to filter by "Top Tier Leads".
- **Review Count Range**: Replace the simple "Most Reviews" sort with a specific range filter (e.g., `Min Reviews` and `Max Reviews`) to help users target Small-to-Medium businesses rather than massive enterprises.
- **Advanced Search Logic**: Upgrade the search bar to support negative keywords (e.g., `-starbucks`) to exclude specific brands from the results.

## Capabilities

### New Capabilities
- `lead-scoring`: A new logic capability for evaluating the quality of a scraped business based on data completeness and reputation metrics.
- `advanced-search`: A new capability handling negative keywords and precise geographic filtering.

### Modified Capabilities
- `results-dashboard`: The dashboard UI needs to accommodate the new filter inputs (Review ranges, Quality Score toggles) in the sidebar.

## Impact

- **src/options.tsx**: Major additions to the filtering logic (`filteredData`) and new state variables for the advanced filter UI components in the sidebar.
- **Data Processing**: Introduction of regex or string parsing utilities to extract cities from Indonesian or International address formats.