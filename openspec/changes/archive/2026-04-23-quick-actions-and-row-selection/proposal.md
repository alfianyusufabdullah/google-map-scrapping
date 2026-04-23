## Why

The current Google Maps scraper dashboard acts as a static data viewer. While users can export data based on filters, they cannot perform actions on individual leads or select specific rows for granular exporting and deletion. Adding "Quick Actions" (like instant WhatsApp messaging or opening directions) and "Row Selection" (checkboxes) transforms the dashboard from a passive viewer into an active mini-CRM and lead management tool.

## What Changes

- **Row Selection**: Add a checkbox column to the dashboard table. Users can select individual rows or "Select All" visible rows.
- **Batch Actions**: Introduce a floating action bar or header buttons that appear when rows are selected, allowing users to "Export Selected" or "Delete Selected".
- **Quick Contact Actions**: Upgrade the Phone Number column. If a valid mobile number is detected, display a "WhatsApp" icon/button that opens a direct chat link (`wa.me`).
- **Quick Location Actions**: Upgrade the Address column. Add a "View in Maps" icon/button that uses the extracted coordinates or address to open a direct Google Maps pin.

## Capabilities

### New Capabilities
- `row-selection`: A new capability allowing users to select, manage, and perform batch actions on specific subsets of data within a session.
- `quick-actions`: A new capability providing direct, actionable outbound links (WhatsApp, Maps) generated from scraped data points.

### Modified Capabilities
- `results-dashboard`: Modifying the dashboard table to include a checkbox column and dynamic action toolbars. Modifying the export and delete logic to handle "selected" states instead of just "filtered" states.

## Impact

- **src/options.tsx**: Significant updates to table rendering, state management (tracking `selectedIds`), and the introduction of new Shadcn components (Checkbox).
- **Dependencies**: May require installing the Shadcn `Checkbox` component.