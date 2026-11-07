# Accessibility audit - Championship Day

The audit below describes the accessibility issues addressed in each component. The audit was carried out according to a11y and WCAG 2.1 guidelines.

## SessionFilters.tsx

**Issue:** Only the first filter could be reached with Tab, and the clickable `div` elements did not support keyboard activation. Screen readers also could not identify the selected filter (WCAG 2.1.1, 4.1.2).

**Fix:** Replaced the divs with native buttons, allowing all filters to be reached with Tab and activated with Enter or Space. Added `aria-pressed` to expose the selected filter and `type="button"` to prevent accidental form submission, and underlined the selected filter so its state remains visible, while preserving the layout and mouse behaviour.

## SiteHeader.tsx

**Issue:** The star button lacked an accessible name and selected state, and the share button was incorrectly named “Menu” (WCAG 4.1.2, 2.4.6). The course image hid its information from screen readers and prevented text customisation (WCAG 1.1.1, 1.4.5). The copy confirmation's status region was created only after activation, which could prevent its announcement (WCAG 4.1.3).

**Fix:** Named the icon buttons and added `aria-pressed` to expose the favourite state. Kept the copy confirmation in a permanently mounted polite status region, allowing feedback without moving focus. Rendered the same course artwork as inline SVG with one accessible name containing the course facts, preserving its appearance while allowing text customisation.

## ViewSwitcher.tsx

**Issue:** The controls announced themselves as tabs but lacked arrow-key navigation and a single Tab entry point. They also had no links to their content panels, and their announced orientation did not follow the mobile layout (WCAG 1.3.1, 4.1.2).

**Fix:** Used native buttons with only the active tab in the Tab order, activating the focused tab directly. Added wrapping arrow navigation and Home/End, with every arrow key moving to the next or previous tab regardless of the responsive layout's orientation, while preserving mouse interaction and appearance.

## App.tsx

**Issue:** View sections were not identified as tab panels or associated with their controlling tabs. Views beginning with non-interactive content also lacked a panel focus target for keyboard navigation (WCAG 1.3.1, 4.1.2).

**Fix:** Added stable tab/panel IDs, accessible panel names, and hidden inactive panels with no focusable content. Results and Medals panels can receive keyboard focus, while Schedule leads directly to its filters; existing content and view-reset behaviour are preserved.

## AlertsModal.tsx

**Issue:** The alert dialog had no accessible name, and keyboard focus could move into the page behind it. Closing the dialog did not reliably return focus to Manage alerts, and its transparent background allowed page content to interfere with its labels (WCAG 4.1.2, 2.4.3, 1.4.3).

**Fix:** Used a named native modal dialog, whose built-in modality blocks background interaction and keeps keyboard navigation within its controls. Focus starts on Heat changes and returns to Manage alerts after Close or Escape, preserving the existing layout. Added an opaque white panel and a dimmed backdrop so the dialog stays readable over every view.

## ResultsTable.tsx

**Issue:** Result standings were represented only by a dash and colour, making them unclear without colour vision (WCAG 1.3.1, 4.1.1). Bib had the wrong accessible name, sort direction was not exposed, and the athlete column had no heading (WCAG 2.5.3, 4.1.2, 1.3.1). A redundant hidden table also added confusing content.

**Fix:** Displayed the existing Qualified/Eliminated values as visible text that stays associated with each athlete after sorting. Corrected the sort-button names, added `aria-sort` to the active heading, and introduced visible ▲/▼/↕ indicators to make sorting and its direction easier to recognise. Added a visually hidden Athlete heading and column scopes, and removed the redundant table while preserving the visible layout and sorting behaviour.

## ScheduleList.tsx

**Issue:** All Details buttons had the same accessible name, making it difficult to identify their heat in a screen-reader button list. The expanded state was already exposed, but each button lacked an explicit relationship to its detail content (WCAG 2.4.6, 1.3.1).

**Fix:** Added the heat name to each accessible label while keeping the visible text as Details. Linked each button to a stable detail element that is hidden when collapsed, preserving independent expansion, filtering behaviour, and appearance.

## panda.config.ts

**Issue:** Colour tokens had values only for optional theme classes, leaving the default interface without defined surface and text colours. The page also referenced a missing background token, making contrast and readability unreliable.

**Fix:** Defined default monochrome colours for backgrounds, text, controls, hover, and focus, including the missing page-background token. Kept the existing layout and overall appearance; no theme switcher or dark mode was introduced.
