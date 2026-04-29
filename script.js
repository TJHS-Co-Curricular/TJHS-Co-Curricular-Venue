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

// Create search clear button
const searchContainer = document.querySelector(".search-container");
const clearBtn = document.createElement("button");
clearBtn.innerHTML = "&times;";
clearBtn.className = "clear-search";
clearBtn.title = "清除搜索";
clearBtn.style.display = "none";
searchContainer.style.position = "relative";
searchContainer.appendChild(clearBtn);

let venueData = {};
let activeVenue = "";
let searchQuery = "";
let searchTimeout = null;

/**
 * Main loading function
 */
async function autoLoad() {
  if (window.location.protocol === "file:") {
    autoLoadStatus.innerHTML =
      "⚠️ <b>Local Access Denied:</b> 浏览器阻挡加载本地文件夹CSV文件 " +
      "请使用 <b>本地服务器</b> (例如：Live Server) 来查看数据";
    displayArea.innerHTML =
      '<div class="empty-state"><span class="empty-state-icon">🚫</span><p>正在等待网络环境响应...</p></div>';
    return;
  }

  autoLoadStatus.textContent = "🔍 正在载入场地资料...";

  const loadTasks = Object.entries(venueConfig).map(
    async ([fileName, label]) => {
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
        console.warn(`加载错误 ${fileName}:`, err);
      }
      return null;
    },
  );

  const results = await Promise.all(loadTasks);
  let loadedCount = 0;

  results.forEach((result) => {
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
    autoLoadStatus.textContent = "❌ 无法找到“场地.csv”文件.";
    displayArea.innerHTML =
      '<div class="empty-state"><span class="empty-state-icon">❓</span><p>请确保“场地.csv”文件在当然目录文件夹下 .</p></div>';
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
        // Don't re-render everything, just update buttons and table
        updateTabButtons();
        renderTable(fileName);
      };
      tabsContainer.appendChild(btn);
    });
}

function updateTabButtons() {
  const buttons = tabsContainer.querySelectorAll(".tab-button");
  const venueFiles = Object.keys(venueData).sort();
  buttons.forEach((btn, index) => {
    const fileName = venueFiles[index];
    if (fileName === activeVenue) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Search input event listener with debounce
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  clearBtn.style.display = searchQuery ? "block" : "none";
  
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    renderContent();
  }, 250);
});

clearBtn.onclick = () => {
  searchInput.value = "";
  searchQuery = "";
  clearBtn.style.display = "none";
  renderContent();
  searchInput.focus();
};

/**
 * Main display coordinator
 */
function renderContent() {
  if (!searchQuery) {
    tabsContainer.style.display = "flex";
    renderAllTabs();
    renderTable(activeVenue);
    return;
  }

  // Global search mode
  tabsContainer.style.display = "none";
  renderGlobalSearch();
}

/**
 * Helper to highlight text
 */
function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return String(text).replace(regex, '<mark class="highlight">$1</mark>');
}

/**
 * Renders matches from all venues
 */
function renderGlobalSearch() {
  let html = "";
  let totalMatches = 0;

  const sortedFiles = Object.keys(venueData).sort();

  sortedFiles.forEach((fileName) => {
    const data = venueData[fileName];
    const label = venueConfig[fileName] || fileName.replace(".csv", "");
    const headers = Object.keys(data[0]);

    const filteredData = data.filter((row) => {
      return headers.some((header) => {
        const val = String(row[header] || "").toLowerCase();
        return val.includes(searchQuery);
      });
    });

    if (filteredData.length > 0) {
      totalMatches += filteredData.length;
      html += `
        <div class="venue-group">
            <div class="venue-header">
                <h3>📍 ${label}</h3>
                <span class="row-count">${filteredData.length} 匹配</span>
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
                                ${headers.map((h) => `<td>${row[h] ? highlight(row[h].trim(), searchQuery) : "-"}</td>`).join("")}
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
      `;
    }
  });

  if (totalMatches > 0) {
    displayArea.innerHTML = `
      <div class="search-summary">
        找到 <b>${totalMatches}</b> 处匹配关键字 "${searchQuery}"
      </div>
      ${html}
    `;
  } else {
    displayArea.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">🔍</span>
        <p>无法找到匹配关键字 "${searchQuery}" </p>
      </div>
    `;
  }
}

/**
 * Renders the data table for a specific venue (Standard View)
 */
function renderTable(fileName) {
  if (!fileName) return;
  const data = venueData[fileName];
  const label = venueConfig[fileName] || fileName.replace(".csv", "");

  if (!data || data.length === 0) {
    displayArea.innerHTML =
      '<div class="empty-state"><span class="empty-state-icon">ℹ️</span><p>没有资料在此文件</p></div>';
    return;
  }

  const headers = Object.keys(data[0]);

  let html = `
        <div class="venue-header">
            <h3>📍 ${label}</h3>
            <span class="row-count">${data.length} 条数据</span>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        ${headers.map((h) => `<th>${h}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${data
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

  displayArea.innerHTML = html;
}

// Initial load
autoLoad();
