# Design Spec: TJHS Venue Dashboard Redesign (Condensed Dashboard)

**Date:** 2026-05-18
**Status:** Approved
**Audience:** Staff (Desktop-First)
**Vibe:** Modern & Sleek

## 1. Overview
Transform the existing venue inquiry system into a high-density, high-performance administrative dashboard optimized for desktop staff use. The focus is on maximum information density without sacrificing visual clarity.

## 2. Architecture & Layout
- **Fluid Layout:** Full-width (100% viewport) container to maximize screen usage.
- **Fixed Navigation:**
  - Slim top bar (`#0f172a`) with title and compact search.
  - Secondary dense tab bar for Venue A-F switching.
- **Responsive Behavior:** While desktop-first, the layout should gracefully handle resizing, switching to scrollable tables on smaller screens.

## 3. Component Details
### 3.1 Data Table (The Core)
- **Density:** Padding 8px-12px, Font size 13px-14px.
- **Sticky Headers:** Table `<thead>` remains fixed while scrolling `<tbody>`.
- **Row Interactions:**
  - Hover: Subtle background highlight (`#f1f5f9`).
  - Active/Select: Distinct highlight (`#e0e7ff`) and left border (`4px solid #6366f1`) to maintain focus.
- **Data Rendering:** Support multi-line text for busy venues; no truncation.

### 3.2 Search & Filtering
- **Global Search:** Immediate filtering across all venues when active.
- **Quick Chips:** Building labels (A-F) and potentially day filters (Tue/Sat).
- **Highlighting:** Use `<mark>` or similar for search matches within the table.

## 4. Visual Design (Modern & Sleek)
- **Color Palette:**
  - **Header/Text:** Deep Slate (`#0f172a`)
  - **Action/Accent:** Indigo (`#6366f1`)
  - **Background:** Slate-50 (`#f8fafc`)
  - **Borders:** Slate-200 (`#e2e8f0`)
- **Typography:** Noto Sans SC (Imported via Google Fonts).
- **Effects:** 
  - Smooth 200ms transitions.
  - Custom thin scrollbars.
  - Borderless table look with subtle row separators.

## 5. Technical Requirements
- **Styling:** Vanilla CSS with CSS Variables.
- **Logic:** Enhance `script.js` to support full-width rendering and sticky header logic.
- **Data Source:** Continue using PapaParse for CSV fetching.

## 6. Success Criteria
- Staff can see 20+ rows of data without scrolling.
- Global search is instantaneous.
- Active row selection helps track focus during administrative tasks.
