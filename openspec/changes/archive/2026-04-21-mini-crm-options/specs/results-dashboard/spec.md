## ADDED Requirements

### Requirement: Inline Status Indicator
The Results Dashboard SHALL display a visual indicator (badge) for a lead's current CRM status directly in the Leads Table.

#### Scenario: Display status
- **WHEN** the dashboard page loads and joins the `scrapedData` array with the `crmData` dictionary
- **THEN** it renders a status badge in the Leads Table next to or on the row for each lead with existing CRM data
