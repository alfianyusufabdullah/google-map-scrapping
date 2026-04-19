## ADDED Requirements

### Requirement: Search Exclusion
The search bar SHALL support negative keywords prefixed with a minus sign (`-`) to exclude results containing that term in their title or address.

#### Scenario: Searching with a negative keyword
- **WHEN** the user enters `kopi -starbucks` in the search bar
- **THEN** the system filters results to those containing "kopi" but NOT containing "starbucks".
- **AND** the case-insensitive logic is maintained for both inclusions and exclusions.

### Requirement: Review Range Filtering
The sidebar SHALL provide input fields or sliders to define a minimum and maximum number of reviews to filter the dataset.

#### Scenario: User inputs a review range
- **WHEN** the user sets Min Reviews to `50` and Max Reviews to `500`
- **THEN** businesses with fewer than 50 or more than 500 reviews are hidden from the table.
