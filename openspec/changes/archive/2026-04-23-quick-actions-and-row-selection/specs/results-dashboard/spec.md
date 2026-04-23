## ADDED Requirements

### Requirement: Dashboard Actions
The dashboard table SHALL incorporate an interactive checkbox column on the left-hand side. A floating action bar or contextual toolbar replaces standard operations when `selectedIds.size > 0`.

#### Scenario: User navigates the table
- **WHEN** the dashboard is loaded
- **THEN** every row displays a checkbox aligned on the far left.
- **AND** quick action icons (Maps, WhatsApp) appear inline with their respective data columns.