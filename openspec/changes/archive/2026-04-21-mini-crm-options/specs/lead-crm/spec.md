## ADDED Requirements

### Requirement: CRM Data Persistence
The system SHALL store mutable user CRM data (status, notes, last updated timestamp) decoupled from the raw scraped data array to prevent data loss upon re-scraping.

#### Scenario: Save CRM data
- **WHEN** a user updates the status or notes of a lead
- **THEN** the system updates the `crmData` dictionary in `chrome.storage.local` keyed by the lead's deterministic `rowId`

### Requirement: Lead Status Tracking
The system SHALL allow users to assign a predefined status to any scraped lead. The statuses MUST include: NEW, CONTACTED, FOLLOW_UP, NOT_INTERESTED, and CLOSED.

#### Scenario: Default status
- **WHEN** a lead is first scraped and has no existing CRM record
- **THEN** its status is treated implicitly as NEW

#### Scenario: Change status
- **WHEN** a user selects a new status from a dropdown for a lead
- **THEN** the new status is immediately saved to storage

### Requirement: Lead Notes
The system SHALL provide a multi-line text area for users to jot down interaction history or custom information about a lead.

#### Scenario: Edit notes
- **WHEN** a user types into the notes text area and saves
- **THEN** the text is saved to the `notes` field of the lead's CRM record

### Requirement: Slide-out CRM Drawer
The system SHALL provide a slide-out drawer (Sheet) interface to view and edit the CRM details of a single lead without losing the context of the larger table.

#### Scenario: Open drawer
- **WHEN** a user clicks on a row in the Leads Table
- **THEN** a slide-out drawer appears from the right side displaying the lead's business details, status dropdown, and notes field
