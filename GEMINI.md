# TJHS Co-Curricular Venue System

A static web-based inquiry system for 2026 co-curricular activity venues, designed for the TJHS Co-Curricular Administrative Assistant.

## Project Overview

This project provides a searchable interface for students and staff to find activity locations for various co-curricular groups. It's built as a lightweight, client-side web application that fetches venue data from CSV files.

- **Primary Technologies:** HTML5, CSS3 (Vanilla), JavaScript (ES6+), [PapaParse](https://www.papaparse.com/) (CSV parsing).
- **Data Source:** CSV files located in the `Venue/` directory.
- **Key Features:**
  - Real-time search across all venues and groups.
  - Tabbed navigation by building/area.
  - Dark mode support (system-preferred).
  - Responsive design for mobile/desktop.

## Project Structure

- `index.html`: The main entry point and UI structure.
- `script.js`: Core logic for data fetching, searching, and DOM manipulation.
- `style.css`: Modern, responsive styling with theme support.
- `Venue/`: Directory containing CSV data files (`VenueA.csv` to `VenueF.csv`).
- `GEMINI.md`: Project-specific instructions and context (this file).

## Development Guide

### Configuration

To add new venues or modify labels, update the `venueConfig` object in `script.js`:

```javascript
const venueConfig = {
  "/Venue/VenueA.csv": "综合活动空间",
  "/Venue/VenueB.csv": "B楼",
  // ... add new entries here
};
```

### Building and Running

Since this project uses `fetch()` to load local CSV files, it cannot be run by simply opening `index.html` in a browser due to CORS restrictions.

- **Development:** Use a local development server.
  - **VS Code:** Use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
  - **Python:** Run `python -m http.server` in the root directory.
  - **Node.js:** Use `npx serve` or `http-server`.
- **Production:** Host on any static web hosting service (GitHub Pages, Vercel, Netlify).

### Data Format

The CSV files in the `Venue/` directory should have a header row. The system dynamically generates table headers based on the first row of each CSV.

## Conventions

- **Styling:** Use Vanilla CSS with CSS Variables for theme management.
- **Dependencies:** Avoid adding heavy libraries. Currently only depends on PapaParse via CDN.
- **Language:** UI text is primarily in Simplified Chinese (`zh-CN`).
