/* === CONFIGURATION: ADD NEW FILES AND LABELS HERE === */
const venueConfig = {
  "VenueA.csv": "综合活动空间",
  "VenueB.csv": "B楼",
  "VenueC.csv": "C楼",
  "VenueD.csv": "D楼",
  "VenueE.csv": "E楼（英文楼）",
  "VenueF.csv": "F楼（双子楼）",
};
/* ========================================= */

const tabsContainer = document.getElementById("venue-tabs");
const displayArea = document.getElementById("display-area");
const autoLoadStatus = document.getElementById("auto-load-status");
const searchInput = document.getElementById("venue-search");

let venueData = {};
let activeVenue = "";
let searchQuery = "";

/**
 * Main loading function
 */
async function autoLoad() {
  if (window.location.protocol === "file:") {
    autoLoadStatus.innerHTML =
      "⚠️ <b>Local Access Denied:</b> Browsers block auto-loading CSVs when opened directly from a folder. " +
      "Please use a <b>Local Server</b> (like Live Server) to see the data.";
    displayArea.innerHTML =
      '<div class="empty-state"><span class="empty-state-icon">🚫</span><p>Waiting for web environment...</p></div>';
    return;
  }

  autoLoadStatus.textContent = "🔍 Loading venue data...";
  
  const loadTasks = Object.entries(venueConfig).map(async ([fileName, label]) => {
    try {
      const response = await fetch(fileName, { cache: "no-cache" });
      if (!response.ok) return null;

      const csvText = await response.text();
      const results = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });

      if (results.data && results.data.length > 0) {
        return { fileName, data: results.data };
      }
    } catch (err) {
      console.warn(`Error loading ${fileName}:`, err);
    }
    return null;
  });

  const results = await Promise.all(loadTasks);
  let loadedCount = 0;

  results.forEach(result => {
    if (result) {
      venueData[result.fileName] = result.data;
      loadedCount++;
      if (!activeVenue) {
        activeVenue = result.fileName;
      }
    }
  });

  if (loadedCount > 0) {
    autoLoadStatus.style.display = "none";
    renderAllTabs();
    renderTable(activeVenue);
  } else {
    autoLoadStatus.textContent = "❌ No venue files found.";
    displayArea.innerHTML =
      '<div class="empty-state"><span class="empty-state-icon">❓</span><p>Please ensure your CSV files are in the same folder.</p></div>';
  }
}

/**
 * Creates the navigation tabs
 */
function renderAllTabs() {
  tabsContainer.innerHTML = "";
  Object.keys(venueData)
    .sort()
    .forEach((fileName) => {
      const btn = document.createElement("button");
      btn.className = `tab-button ${fileName === activeVenue ? "active" : ""}`;
      btn.textContent = venueConfig[fileName] || fileName.replace(".csv", "");
      btn.onclick = () => {
        activeVenue = fileName;
        renderAllTabs();
        renderTable(fileName);
      };
      tabsContainer.appendChild(btn);
    });
}

/**
 * Renders the data table for a specific venue
 */
function renderTable(fileName) {
  if (!fileName) return;
  const data = venueData[fileName];
  const label = venueConfig[fileName] || fileName.replace(".csv", "");

  if (!data || data.length === 0) {
    displayArea.innerHTML =
      '<div class="empty-state"><span class="empty-state-icon">ℹ️</span><p>No data found in this file.</p></div>';
    return;
  }

  const headers = Object.keys(data[0]);

  // Filter data based on search query
  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    return headers.some((header) => {
      const val = String(row[header] || "").toLowerCase();
      return val.includes(searchQuery.toLowerCase());
    });
  });

  let html = `
        <div class="venue-header">
            <h3>📍 ${label}</h3>
            <span class="row-count">${filteredData.length} entries shown</span>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        ${headers.map((h) => `<th>${h}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${filteredData
                      .map(
                        (row) => `
                        <tr>
                            ${headers.map((h) => `<td>${row[h] ? row[h].trim() : "-"}</td>`).join("")}
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `;

  if (filteredData.length === 0) {
    html = `
            <div class="venue-header">
                <h3>📍 ${label}</h3>
                <span class="row-count">0 entries shown</span>
            </div>
            <div class="empty-state">
                <span class="empty-state-icon">🔍</span>
                <p>No matches found for "${searchQuery}" in this venue.</p>
            </div>
        `;
  }

  displayArea.innerHTML = html;
}

// Search input event listener
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderTable(activeVenue);
});

// Initial load
autoLoad();
