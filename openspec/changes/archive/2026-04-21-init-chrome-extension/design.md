## Context

The repository is currently empty and designated for a Google Maps scraping tool. Building a robust Chrome Extension requires managing complex configurations (like manifest generation, service worker build chains, and React integration). To ensure rapid development and reliable performance with Manifest V3, we are adopting the Plasmo framework. This allows us to focus on the extension logic and UI components, specifically utilizing a Side Panel for scraper settings and an Options Page for displaying comprehensive results.

## Goals / Non-Goals

**Goals:**
- Provide a clear, zero-config build foundation using Plasmo.
- Scaffold the required React components for the Side Panel and Options Page.
- Establish the communication bridge structure between the Side Panel, Background script, and Options Page.

**Non-Goals:**
- Implementing the actual DOM scraping logic (this will be handled in subsequent features).
- Implementing data persistence mechanics (although Plasmo storage will be used, deep integration is out of scope for this initial setup phase).

## Decisions

- **Framework**: Use Plasmo over raw Vite/Webpack.
  *Rationale*: Plasmo significantly simplifies Manifest V3 configuration, offers built-in hot reloading, and handles React setup seamlessly for background, content, side panel, and options scripts.
- **UI Structure**:
  - `sidepanel.tsx`: Will handle configuration (parameters like keywords, depth, category).
  - `options.tsx`: Will handle the result data rendering (large tables, export tools).
  *Rationale*: The Side Panel offers continuous context alongside Google Maps, whereas the Options Page provides the necessary real estate for complex data visualization.

## Risks / Trade-offs

- **Risk**: Plasmo's abstraction might obscure underlying Chrome Extension APIs.
  *Mitigation*: Familiarize the team with Plasmo's specialized hooks (e.g., `@plasmohq/storage` and `@plasmohq/messaging`) while maintaining awareness of standard `chrome.*` APIs.
