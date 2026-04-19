# Agent Instructions for Google Maps Scraper

This repository contains a Chrome extension for scraping Google Maps data. It is built with React, Tailwind CSS, Shadcn UI, and the Plasmo framework.

## Project Architecture

- **Framework**: Plasmo (`npm run dev` / `npm run build`)
- **UI Stack**: React 19, Tailwind CSS, Shadcn UI (`src/components/ui/`)
- **Key Directories**:
  - `src/contents/scraper.ts`: The core content script injected into Google Maps (`https://*.google.com/maps/*`). Contains all XPath extraction logic and DOM interaction loops.
  - `src/sidepanel.tsx`: The extension's side panel UI (Chrome Side Panel API) where scraping is configured and initiated.
  - `src/options.tsx`: The full-page dashboard UI (Options Page) for managing, filtering, and exporting scraped data.
  - `src/background.ts`: The background service worker managing state between the side panel and the content script.

## Development Workflow & Quirks

- **OpenSpec Workflow**: This project uses OpenSpec for change management. You should find active specs in `openspec/changes/`. When implementing features, prefer using the `/opsx-apply` flow to update tasks, specs, and designs synchronously.
- **State Management**: 
  - Cross-script communication relies heavily on `chrome.storage.local`. 
  - Critical states: `isScraping` (boolean), `currentSessionCount` (number), `scrapingTabId` (number).
  - The side panel uses `chrome.storage.onChanged` to react to progress updates from the content script.
- **Shadcn UI Conventions**: 
  - Components are located in `src/components/ui/`.
  - **CRITICAL**: Do *not* override Shadcn component logic or default paddings/margins with custom inline `className` Tailwind utility classes unless absolutely necessary for layout. Rely on the standard component properties and parent wrappers.
- **Google Maps DOM Quirks**:
  - Google Maps is highly dynamic and obfuscates its DOM. Do not rely on generic classes. Use specific `XPath` or targeted `querySelector` logic scoped to `div[role="main"]` when extracting details to avoid picking up the first result in the background feed instead of the active pane.
  - The scraper loop uses an explicit `chrome.storage.local.get(["isScraping"])` check inside its `while` loop to cleanly halt extraction when the user presses Stop, rather than relying solely on message passing which can detach.

## Key Commands

- `npm run dev`: Start the Plasmo development server with hot-reloading.
- `npm run build`: Build the production-ready extension package.
- `npx shadcn@latest add <component>`: Install a new Shadcn UI component.
- `npx tsc --noEmit`: Typecheck the codebase. Always run this after making changes to React components or the scraper logic.
