## ADDED Requirements

### Requirement: Row Checkbox Selection
The dashboard table SHALL include a checkbox column allowing users to select individual rows. 

#### Scenario: User selects multiple rows
- **WHEN** the user checks the boxes next to 3 specific businesses
- **THEN** a batch action toolbar appears displaying "3 items selected".

### Requirement: Select All Visible Records
The dashboard table header SHALL include a master checkbox to select or deselect all currently filtered records.

#### Scenario: User clicks Select All
- **WHEN** the user applies a search filter resulting in 45 matches and clicks the master checkbox
- **THEN** all 45 matching records are selected, ignoring the pagination boundaries (it selects across all pages).

### Requirement: Batch Export
Users SHALL be able to export only the selected rows to a CSV file.

#### Scenario: Exporting 3 selected rows
- **WHEN** the user clicks "Export Selected" on the batch toolbar
- **THEN** the system generates and downloads a CSV containing only those 3 businesses.

### Requirement: Batch Delete
Users SHALL be able to delete the selected rows from the database.

#### Scenario: Deleting bad leads
- **WHEN** the user selects 5 bad leads and clicks "Delete Selected"
- **THEN** those 5 specific records are removed from the local storage `scrapedData` and the UI updates accordingly.