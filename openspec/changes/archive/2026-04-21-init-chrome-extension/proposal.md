## Why

We need a dedicated tool for scraping Google Maps data. A Chrome Extension using Plasmo with Manifest V3 provides an excellent user experience, allowing users to configure scraping settings directly from the Google Maps page via a Side Panel and view the gathered results in a dedicated, full-screen Options Page. Setting this up with Plasmo ensures a modern development experience with React, HMR, and straightforward API bindings.

## What Changes

- Initialize a new Plasmo-based Chrome Extension project in the repository.
- Configure a Side Panel (`sidepanel.tsx`) intended to serve as the control and settings interface for the scraper.
- Configure an Options Page (`options.tsx`) intended to display the scraped results in a comprehensive data table.
- Set up project linting, formatting, and basic structure.

## Capabilities

### New Capabilities
- `extension-shell`: Base setup and initialization of the Plasmo framework, providing the structural foundation for Manifest V3 components.
- `scraper-settings-ui`: The Side Panel interface for configuring scraping parameters while browsing Google Maps.
- `scraper-results-ui`: The Options Page interface designed to display, format, and potentially export the scraped Google Maps data.

### Modified Capabilities
- (None)

## Impact

- Populates the empty `google-maps-scrapping` repository with a React-based extension codebase.
- Introduces Plasmo as the build tool and runtime framework.
