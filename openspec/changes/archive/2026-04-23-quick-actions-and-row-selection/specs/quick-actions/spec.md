## ADDED Requirements

### Requirement: Direct WhatsApp Link
If a scraped business contains a phone number, the UI SHALL provide a quick-action link to initiate a WhatsApp chat with that number.

#### Scenario: Valid phone number
- **WHEN** a business has the phone number `0812-3456-7890`
- **THEN** the system generates an `href` link targeting `https://wa.me/6281234567890`.
- **AND** a visual WhatsApp icon or button appears next to the phone number.

### Requirement: Direct Google Maps Location Link
Every business row SHALL contain a quick-action link to view its exact location in Google Maps.

#### Scenario: Valid Coordinates
- **WHEN** the scraped data contains coordinates (e.g., `-6.2088,106.8456`)
- **THEN** the system generates a Google Maps URL targeting that exact point (`https://www.google.com/maps/place/-6.2088,106.8456`).

#### Scenario: Missing Coordinates Fallback
- **WHEN** the scraped data is missing coordinates
- **THEN** the system generates a Google Maps search URL using the business title and address (`https://www.google.com/maps/search/?api=1&query=Business+Name+Address`).