# TJHS Venue Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the venue inquiry system into a high-density, modern "Condensed Dashboard" optimized for staff desktop use.

**Architecture:** Transition to a full-width fluid layout with a fixed multi-tier navigation and a high-density data table with sticky headers.

**Tech Stack:** HTML5, Vanilla CSS (CSS Variables), JavaScript (ES6), PapaParse.

---

### Task 1: Foundation & CSS Variables Update

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Update CSS Variables**
Update `:root` with the new professional color palette and layout constants.

```css
:root {
    --primary-color: #6366f1; /* Indigo */
    --primary-hover: #4f46e5;
    --bg-color: #f8fafc;
    --header-bg: #0f172a; /* Deep Slate */
    --card-bg: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border-color: #e2e8f0;
    --accent-color: #10b981;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --table-hover: #f1f5f9;
    --table-alt-row: #f8fafc;
    --table-active: #e0e7ff;
    --nav-height: 64px;
    --tab-height: 48px;
}
```

- [ ] **Step 2: Commit**
```bash
git add style.css
git commit -m "style: update css variables for condensed dashboard"
```

---

### Task 2: Structural Layout Redesign

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Update HTML Structure**
Modify `index.html` to move controls into a fixed header and main into a fluid container.

```html
<header class="main-header">
    <div class="header-content">
        <h1>2026联课活动场地系统</h1>
        <div class="header-actions">
            <div class="search-container">
                <input type="text" id="venue-search" class="search-input" placeholder="全局搜索...">
            </div>
        </div>
    </div>
    <nav id="venue-tabs" class="venue-tabs"></nav>
</header>

<main class="dashboard-main">
    <div id="display-area" class="table-container">
        <!-- Data loaded here -->
    </div>
</main>
```

- [ ] **Step 2: Apply Fluid Layout Styles**
Update `style.css` to handle the fixed header and fluid main area.

```css
body {
    overflow: hidden; /* Prevent body scroll, use container scroll */
}

.main-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--header-bg);
    color: white;
}

.dashboard-main {
    margin-top: calc(var(--nav-height) + var(--tab-height));
    height: calc(100vh - var(--nav-height) - var(--tab-height));
    overflow: auto;
    padding: 0;
}

.table-container {
    width: 100%;
    border-radius: 0;
    box-shadow: none;
}
```

- [ ] **Step 3: Commit**
```bash
git add index.html style.css
git commit -m "feat: implement full-width fluid layout structure"
```

---

### Task 3: High-Density Table & Sticky Header

**Files:**
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Style High-Density Table**
Update `style.css` with condensed padding and sticky header logic.

```css
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

th {
    position: sticky;
    top: 0;
    background: var(--table-alt-row);
    z-index: 20;
    padding: 8px 12px;
    font-size: 13px;
    border-bottom: 2px solid var(--border-color);
}

td {
    padding: 8px 12px;
    font-size: 14px;
    border-bottom: 1px solid var(--border-color);
}

tr:hover td {
    background-color: var(--table-hover);
}

tr.active-row td {
    background-color: var(--table-active);
    border-bottom-color: var(--primary-color);
}
```

- [ ] **Step 2: Update script.js for Interactions**
Modify `renderTable` and `generateTableHTML` to handle row clicking.

```javascript
function generateTableHTML(data, headers, query = "") {
  return `
    <table>
        <thead>
            <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
            ${data.map((row) => `
                <tr onclick="this.classList.toggle('active-row')">
                    ${headers.map((h) => `<td>${row[h] ? highlight(row[h].trim(), query) : "-"}</td>`).join("")}
                </tr>
            `).join("")}
        </tbody>
    </table>
  `;
}
```

- [ ] **Step 3: Commit**
```bash
git add style.css script.js
git commit -m "feat: implement high-density table with sticky headers and row selection"
```

---

### Task 4: Modern Navigation & Search Refinement

**Files:**
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Style Condensed Tabs**
Update `style.css` for a cleaner tab bar.

```css
.venue-tabs {
    background: #1e293b;
    padding: 0 1rem;
    display: flex;
    gap: 2px;
}

.tab-button {
    background: transparent;
    border: none;
    color: #94a3b8;
    padding: 12px 20px;
    border-radius: 0;
    border-bottom: 2px solid transparent;
}

.tab-button:hover {
    color: white;
    background: rgba(255,255,255,0.05);
}

.tab-button.active {
    color: white;
    border-bottom-color: var(--primary-color);
    background: rgba(255,255,255,0.1);
}
```

- [ ] **Step 2: Commit**
```bash
git add style.css
git commit -m "style: refine navigation tabs and header search"
```

---

### Task 5: Final Visual Polish & Cleanup

**Files:**
- Modify: `style.css`
- Modify: `index.html`

- [ ] **Step 1: Add Custom Scrollbar & Fonts**
Ensure Noto Sans SC is correctly applied and add scrollbar styling.

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

body {
    font-family: 'Noto Sans SC', sans-serif;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
```

- [ ] **Step 2: Verification**
Open `index.html` (via live server) and verify:
1. Full width layout.
2. Sticky headers work when scrolling.
3. Row clicking highlights the row.
4. Search works globally.

- [ ] **Step 3: Final Commit**
```bash
git add style.css index.html
git commit -m "style: final visual polish and typography"
```
