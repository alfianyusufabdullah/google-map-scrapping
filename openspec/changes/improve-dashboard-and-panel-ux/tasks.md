## 1. Extension UI (Side Panel) Refinements

- [x] 1.1 In `src/sidepanel.tsx`, update `handleStartScraping` to synchronously call `setCurrentSessionCount(0)` and `chrome.storage.local.set({ currentSessionCount: 0 })`.
- [x] 1.2 Refactor the Side Panel UI to hide configuration inputs when `isScraping` is true.
- [x] 1.3 Create a new prominent "Active Scraping" card UI state in the Side Panel to display progress clearly, incorporating the Stop button.

## 2. Results Dashboard (Options) Refinements

- [x] 2.1 In `src/options.tsx`, remove the Shadcn `Accordion` components and imports.
- [x] 2.2 Import and configure the Shadcn `Select` components (`Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`).
- [x] 2.3 Implement the `Select` component in the dashboard header to allow users to choose a specific `sessionId`.
- [x] 2.4 Add state logic (`selectedSession`) to default to the most recent session upon loading data.
- [x] 2.5 Refactor the data table rendering to only show rows for the `selectedSession`.
- [x] 2.6 Remove the Shadcn `ScrollArea` component and wrapper from the table so it scrolls naturally with the window.

## 3. Sidebar Layout Refactoring

- [x] 3.1 In `src/options.tsx`, restructure the main layout into a two-column Grid/Flex system (Sidebar + Content).
- [x] 3.2 Move the `Select` component, `Refresh`, `Export`, and `Clear All` buttons into the sticky Sidebar.
- [x] 3.3 Apply `sticky` positioning and `h-screen` logic to the Sidebar within the global `ScrollArea`.
- [x] 3.4 Adjust the results table container to take up the remaining width and remove any horizontal scroll issues.
- [x] 3.5 Fine-tune styling (backgrounds, borders, padding) for the new Sidebar to ensure a professional look.

## 4. Dashboard Data Polish & Filtering

- [x] 4.1 In `src/options.tsx`, remove the `max-w-6xl` constraint to allow the table to take up full available width.
- [x] 4.2 Add `searchQuery` and `minRating` states to the `OptionsIndex` component.
- [x] 4.3 Implement a search/filter bar above the table in the main content area.
- [x] 4.4 Refactor the table rendering to use `sticky top-0` on the `TableHeader`.
- [x] 4.5 Create a `StarRating` helper component to visualize ratings with icon stars.
- [x] 4.6 Apply the local filtering logic (search + rating) to the `currentData` displayed in the table.

## 5. Advanced Dashboard Controls & Sorting

- [x] 5.1 In `src/options.tsx`, add `sortBy`, `hideNoWebsite`, and `hideNoPhone` states.
- [x] 5.2 Implement a "Sort By" Select dropdown in the sidebar.
- [x] 5.3 Add `Switch` or `Checkbox` components for the "Hide No Website" and "Hide No Phone" filters in the sidebar.
- [x] 5.4 Update the `filteredData` logic to incorporate sorting and contact-based filtering.
- [x] 5.5 Redesign the sidebar action buttons to look more like buttons (better borders, backgrounds, and hover states).