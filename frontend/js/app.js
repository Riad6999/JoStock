// frontend/js/app.js

let items = [];

function setGlobalMessage(text, type = "error") {
  const box = document.getElementById("global-message");
  if (!box) return;
  if (!text) {
    box.classList.add("hidden");
    return;
  }
  box.textContent = text;
  box.className = `global-message ${type}`;
}

/** Fetch items from backend safely */
async function fetchItems() {
  try {
    setGlobalMessage("Loading items from server...", "info");
    const res = await fetch(`${BASE_URL}/items`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    items = Array.isArray(data) ? data : [];
    setGlobalMessage(""); // clear
  } catch (err) {
    console.error("Failed to load items:", err);
    setGlobalMessage("Could not load items from server. Check API / BASE_URL.", "error");
    items = [];
  }
}

/** Dashboard summary */
function renderDashboard() {
  const container = document.getElementById("dashboard-cards");
  if (!container) return;
  container.innerHTML = "";

  const totalItems = items.length;
  const totalStock = items.reduce((sum, i) => sum + (Number(i.stock) || 0), 0);
  const lowStockCount = items.filter(i => i.stock <= i.lowLimit).length;

  const cards = [
    { title: "Total Items", value: totalItems, sub: "Unique sauces / products" },
    { title: "Total Stock", value: totalStock, sub: "All units combined" },
    { title: "Low Stock Items", value: lowStockCount, sub: "At or below limit" }
  ];

  cards.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="card-title">${c.title}</div>
      <div class="card-value">${c.value}</div>
      <div class="card-sub">${c.sub}</div>
    `;
    container.appendChild(div);
  });
}

/** Stock list */
function renderStock() {
  const grid = document.getElementById("stock-grid");
  const searchInput = document.getElementById("stock-search");
  const filterSelect = document.getElementById("stock-filter");
  if (!grid) return;

  const searchText = (searchInput?.value || "").toLowerCase();
  const filter = filterSelect?.value || "all";

  let filtered = items.filter(i =>
    i.name?.toLowerCase().includes(searchText)
  );

  if (filter === "low") {
    filtered = filtered.filter(i => i.stock <= i.lowLimit);
  } else if (filter === "ok") {
    filtered = filtered.filter(i => i.stock > i.lowLimit);
  }

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="muted">No items found. Add some data in the database.</p>`;
    return;
  }

  filtered.forEach(item => {
    const isLow = item.stock <= item.lowLimit;
    const statusClass = isLow ? "status-low" : "status-ok";
    const statusText = isLow ? "Low" : "OK";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="item-title">${item.name}</div>
      <div class="item-meta">Category: ${item.category || "-"}</div>
      <div class="item-meta">Unit: ${item.unit || "pcs"}</div>
      <div class="item-stock">
        Stock: <b>${item.stock}</b>
        &nbsp;·&nbsp;
        <span class="${statusClass}">${statusText}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

/** Simple analytics from items only */
function renderAnalytics() {
  const list = document.getElementById("analytics-list");
  if (!list) return;

  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = `<li class="muted">No items yet – add items in DB to see analytics.</li>`;
    return;
  }

  const totalStock = items.reduce((sum, i) => sum + (Number(i.stock) || 0), 0);
  const lowStock = items.filter(i => i.stock <= i.lowLimit);
  const okStock = items.filter(i => i.stock > i.lowLimit);

  list.innerHTML = `
    <li>Total items: <b>${items.length}</b></li>
    <li>Total stock units: <b>${totalStock}</b></li>
    <li>Low stock items: <b>${lowStock.length}</b></li>
    <li>OK items: <b>${okStock.length}</b></li>
  `;
}

/** Tabs */
function setupTabs() {
  const buttons = document.querySelectorAll(".nav-btn");
  const tabs = document.querySelectorAll(".tab");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabName = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove("active"));
      tabs.forEach(t => t.classList.remove("active"));

      btn.classList.add("active");
      const active = document.getElementById(`tab-${tabName}`);
      if (active) active.classList.add("active");

      // Re-render per tab if needed
      if (tabName === "stock") renderStock();
      if (tabName === "analytics") renderAnalytics();
      if (tabName === "dashboard") renderDashboard();
    });
  });
}

/** Time in navbar */
function setupTime() {
  const el = document.getElementById("nav-time");
  if (!el) return;
  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleString();
  };
  update();
  setInterval(update, 30000);
}

/** Search/filter events */
function setupStockFilters() {
  const searchInput = document.getElementById("stock-search");
  const filterSelect = document.getElementById("stock-filter");
  if (searchInput) searchInput.addEventListener("input", renderStock);
  if (filterSelect) filterSelect.addEventListener("change", renderStock);
}

/** INIT */
async function init() {
  setupTabs();
  setupTime();
  setupStockFilters();
  await fetchItems();
  renderDashboard();
  renderStock();
  renderAnalytics();
}

window.addEventListener("load", init);
