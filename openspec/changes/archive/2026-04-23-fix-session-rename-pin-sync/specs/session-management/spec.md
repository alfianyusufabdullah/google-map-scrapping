## MODIFIED Requirements

### Requirement: Session Renaming
The system SHALL allow users to rename an existing scraping session. Renaming MUST update the `sessionId` for all data items belonging to that session in the `scrapedData` storage. Additionally, if the session being renamed is currently pinned, the system MUST update the session ID in the `pinnedSessions` storage to ensure the pin is preserved.

#### Scenario: Rename Bali session to Lombok
- **WHEN** user inputs "Lombok" as the new name for the "Bali" session and confirms
- **THEN** all 50 items previously tagged as "Bali" now have `sessionId: "Lombok"`
- **AND** if "Bali" was pinned, "Lombok" replaces it in the `pinnedSessions` list
- **AND** the UI updates to show the new session name and maintains its pinned status.
