document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const workspaceContent = document.getElementById("workspace-content");
  const mainTabsContainer = document.getElementById("main-tabs-container");
  const modalsContainer = document.getElementById("modals-container");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggleBtn = document.getElementById("sidebar-toggle");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");

  // --- VIEW CONTENT & INITIALIZERS ---
  const viewInitializers = {
    dashboard: initDashboard,
    pos: initPOS,
    inventory: (pane) =>
      initInventory(pane.querySelector("#inventory-view-container")),
    customers: initCustomers,
    invoices: initInvoices,
    reports: initReports,
    settings: initSettings,
  };

  function getViewContent(viewType) {
    const profile = getCurrentProfile();
    const term = profile.terminology;
    switch (viewType) {
      case "dashboard":
        return `
                <div class="space-y-8">
                    <!-- Dashboard Header -->
                    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-text-primary">Welcome Back, Admin</h1>
                            <p class="text-text-secondary" id="dashboard-date">Your business at a glance.</p>
                        </div>
                        <div class="flex items-center gap-2 bg-bg-secondary p-1 rounded-lg border border-border-color">
                            <button data-action="set-dashboard-period" data-period="today" class="dashboard-period-btn active px-4 py-1.5 text-sm font-semibold rounded-md">Today</button>
                            <button data-action="set-dashboard-period" data-period="week" class="dashboard-period-btn px-4 py-1.5 text-sm font-semibold rounded-md">This Week</button>
                            <button data-action="set-dashboard-period" data-period="month" class="dashboard-period-btn px-4 py-1.5 text-sm font-semibold rounded-md">This Month</button>
                        </div>
                    </div>
                    <!-- Main KPI Cards -->
                    <div id="dashboard-stats-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <!-- KPI Cards will be rendered here -->
                    </div>

                    <!-- Main Charts & Performance -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2 glass-pane p-6 rounded-xl flex flex-col">
                            <h2 class="text-xl font-semibold mb-4 text-text-primary">Revenue Overview</h2>
                            <div class="relative flex-grow min-h-[300px]">
                                <canvas id="sales-chart"></canvas>
                            </div>
                        </div>
                        <div class="glass-pane p-6 rounded-xl flex flex-col">
                             <h2 class="text-xl font-semibold mb-4 text-text-primary">Performance Snapshot</h2>
                             <div class="space-y-4 flex-grow">
                                <div>
                                    <h3 class="text-sm font-semibold text-text-secondary mb-2">Top Selling ${term.product}s</h3>
                                    <ul id="top-products-list" class="space-y-2"></ul>
                                </div>
                                <div class="pt-4 border-t border-border-color">
                                    <h3 class="text-sm font-semibold text-text-secondary mb-2">Sales by ${term.category}</h3>
                                    <div class="relative h-40"><canvas id="category-sales-chart"></canvas></div>
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    <!-- AI Insights & Recent Activity -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="glass-pane p-6 rounded-xl">
                            <h2 class="text-xl font-semibold mb-4 text-text-primary flex items-center gap-2"><i data-lucide="sparkles" class="text-accent"></i>AI Insights & Quick Actions</h2>
                            <div class="space-y-3 text-sm">
                                <div class="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg"><i data-lucide="trending-up" class="w-5 h-5 text-green-400 mt-1 shrink-0"></i><p><strong>Trending:</strong> Sales of <span class="font-medium text-blue-400">Coffee</span> products are up 25% this week. Consider a featured promotion.</p></div>
                                <div class="flex items-start gap-3 p-3 bg-bg-secondary rounded-lg"><i data-lucide="package-alert" class="w-5 h-5 text-yellow-400 mt-1 shrink-0"></i><p><strong>Inventory Alert:</strong> You are low on <span class="font-medium text-blue-400">Organic Apples</span>. Create a purchase order to avoid stockout.</p></div>
                            </div>
                            <div class="grid grid-cols-2 gap-3 mt-4">
                                <button data-action="add-product" class="btn btn-secondary w-full text-sm"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>New ${term.product}</button>
                                <button data-action="create-po" class="btn btn-secondary w-full text-sm"><i data-lucide="file-plus-2" class="w-4 h-4 mr-2"></i>Create PO</button>
                            </div>
                        </div>
                        <div class="glass-pane p-6 rounded-xl">
                             <h2 class="text-xl font-semibold mb-4 text-text-primary">Recent Activity</h2>
                             <div id="recent-activity-feed" class="space-y-0 max-h-52 overflow-y-auto">
                                <!-- Feed items will be injected here -->
                             </div>
                        </div>
                    </div>
                </div>
                <style> .dashboard-period-btn.active { background-color: var(--accent); color: white; } </style>
            `;
      case "pos":
        return `<div class="flex flex-col h-full -mx-4 md:-mx-8 -my-4 md:-my-8"><div class="relative flex-shrink-0 border-b border-border-color"><button id="pos-scroll-left" class="pos-scroll-btn-left hidden absolute left-0 top-0 bottom-0 z-10 flex items-center pl-4 pr-8 text-text-secondary hover:text-text-primary transition-opacity"><i data-lucide="chevron-left" class="w-6 h-6 pointer-events-none"></i></button><div id="pos-tabs-container" class="flex items-center"></div><button id="pos-scroll-right" class="pos-scroll-btn-right hidden absolute right-0 top-0 bottom-0 z-10 flex items-center pr-4 pl-8 text-text-secondary hover:text-text-primary transition-opacity"><i data-lucide="chevron-right" class="w-6 h-6 pointer-events-none"></i></button></div><div class="grid grid-cols-12 gap-6 flex-grow p-4 md:p-6 lg:p-8"><div class="col-span-12 md:col-span-7 glass-pane p-4 rounded-xl flex flex-col"><div class="flex items-center border-b border-border-color pb-4 mb-4"><div class="relative w-full"><i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"></i><input type="text" id="pos-search" placeholder="Scan or search ${term.product}s..." class="w-full form-input pl-12 p-3 focus:ring-0" autocomplete="off"><div id="pos-search-results" class="absolute top-full left-0 right-0 mt-1 border border-border-color rounded-lg shadow-lg z-20 hidden max-h-60 overflow-y-auto"></div></div><button data-action="add-customer-to-sale" class="ml-3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 shrink-0"><i data-lucide="user-plus" class="w-6 h-6"></i></button></div><div class="flex-grow overflow-y-auto pr-2"><table class="w-full text-sm text-left text-text-secondary"><thead class="text-xs text-text-secondary uppercase"><tr><th class="px-6 py-3">${term.product}</th><th class="px-6 py-3 w-32 text-center">Qty</th><th class="px-6 py-3">Price</th><th class="px-6 py-3">Total</th><th class="px-6 py-3 text-right">Actions</th></tr></thead><tbody id="pos-cart-body"></tbody></table></div></div><div class="col-span-12 md:col-span-5 glass-pane p-6 rounded-xl flex flex-col justify-between"><div><h2 class="text-2xl font-bold text-text-primary mb-6">Order Summary</h2><div id="pos-customer-display" class="hidden items-center justify-between mb-4 p-3 bg-blue-900/50 rounded-lg text-blue-200"></div><div class="space-y-3 text-lg"><div class="flex justify-between"><p>Subtotal:</p><p id="pos-subtotal" class="font-mono text-text-primary">$0.00</p></div><div class="flex justify-between"><p>Tax (10%):</p><p id="pos-tax" class="font-mono text-text-primary">$0.00</p></div><div class="flex justify-between border-t border-border-color pt-4 mt-2 font-bold text-2xl"><p class="text-text-primary">Total:</p><p id="pos-total" class="font-mono text-accent">$0.00</p></div></div></div><div class="grid grid-cols-2 gap-3 mt-6"><button data-action="hold-sale" class="btn btn-secondary text-lg">Hold</button><button data-action="cancel-sale" class="btn btn-danger text-lg">Cancel</button><button data-action="process-payment" class="col-span-2 btn btn-primary text-xl tracking-wider py-4">PAY</button></div></div></div></div>`;
      case "inventory":
        return `<div id="inventory-view-container"></div>`;
      case "customers":
        return `<div><div class="flex justify-between items-center mb-6"><h1 class="text-3xl font-bold text-text-primary">Customer Database</h1><button data-action="add-customer" class="btn btn-primary"><i data-lucide="user-plus" class="w-5 h-5 mr-2"></i> Add Customer</button></div><div class="bg-bg-secondary/50 rounded-xl"><table class="table-pro"><thead><tr><th>Customer</th><th>Contact</th><th>Address</th><th>Loyalty ID</th><th>Actions</th></tr></thead><tbody id="customers-table-body"></tbody></table></div></div>`;
      case "invoices":
        return `<div><div class="flex justify-between items-center mb-6"><h1 class="text-3xl font-bold text-text-primary">Invoice History</h1></div><div class="bg-bg-secondary/50 rounded-xl"><table class="table-pro"><thead><tr><th>Invoice ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody id="invoices-table-body"></tbody></table></div></div>`;
      case "reports":
        return `
                <div class="space-y-6">
                    <!-- Reports Header -->
                    <div id="reports-header" class="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-text-primary">Business Reports</h1>
                            <p class="text-text-secondary">Analyze trends and performance metrics.</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-1 bg-bg-secondary p-1 rounded-lg border border-border-color">
                                <button data-action="set-report-type" data-type="sales" class="report-type-btn active px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2"><i data-lucide="trending-up" class="w-4 h-4"></i>Sales</button>
                                <button data-action="set-report-type" data-type="inventory" class="report-type-btn px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2"><i data-lucide="boxes" class="w-4 h-4"></i>${term.inventory}</button>
                                <button data-action="set-report-type" data-type="customer" class="report-type-btn px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2"><i data-lucide="users" class="w-4 h-4"></i>Customer</button>
                            </div>
                            <button data-action="export-report" class="btn btn-secondary"><i data-lucide="download" class="w-4 h-4 mr-2"></i>Export</button>
                        </div>
                    </div>
                    <!-- Reports Content Area -->
                    <div id="reports-container" class="space-y-6">
                        <!-- Dynamic report content will be injected here -->
                    </div>
                </div>
                <style> 
                    .report-type-btn.active { background-color: var(--accent); color: white; }
                    .kpi-card { transition: all 0.3s ease; }
                    .kpi-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2), 0 0 15px var(--accent-glow); }
                </style>
            `;
      case "settings":
        return `<div id="settings-form"><h1 class="text-3xl font-bold text-text-primary mb-6">Settings</h1><div class="space-y-8 max-w-4xl"><div class="glass-pane p-6 rounded-lg"><h2 class="text-xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4">Business Profile</h2><div id="business-type-selector"></div></div><div class="glass-pane p-6 rounded-lg"> <h2 class="text-xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4">Store Information</h2><div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Store Name</label><input type="text" name="storeName" value="${storeInfo.name}" class="form-input w-full"></div><div><label class="block text-sm font-medium mb-1">Contact Email</label><input type="email" value="contact@cashshilpo.com" class="form-input w-full"></div></div><div><label class="block text-sm font-medium mb-1">Store Address</label><input type="text" name="storeAddress" value="${storeInfo.address}" class="form-input w-full"></div></div></div><div class="glass-pane p-6 rounded-lg"> <h2 class="text-xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4">Currency Settings</h2><div class="space-y-4"><div><label class="block text-sm font-medium mb-1">Default Display Currency</label><select id="default-currency-selector" name="defaultCurrency" class="form-select w-full max-w-xs"></select><p class="text-xs text-text-secondary mt-1">This is the currency the POS will default to on launch.</p></div></div></div><div class="glass-pane p-6 rounded-lg"> <h2 class="text-xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4">Tax Settings</h2><div class="space-y-4"><div><label class="block text-sm font-medium mb-1">Default Tax Rate (%)</label><input type="number" name="taxRate" value="10" class="form-input w-full max-w-xs"></div></div></div><div class="glass-pane p-6 rounded-lg"><h2 class="text-xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4 flex items-center gap-2"><i data-lucide="sparkles" class="text-accent"></i> Smart Actions & Automation</h2><p class="text-sm text-text-secondary mb-6">Let AI handle the routine tasks. Enable smart automations to boost efficiency and drive sales.</p><div class="space-y-4"><div class="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"><div class="flex items-center"><i data-lucide="refresh-cw" class="w-5 h-5 text-green-400 mr-4"></i><div><h4 class="font-medium text-text-primary">Automated Reorder Drafts</h4><p class="text-xs text-text-secondary">Automatically create purchase order drafts when stock is low.</p></div></div><div class="flex items-center gap-4"><button class="text-text-secondary hover:text-white p-1"><i data-lucide="settings-2" class="w-4 h-4"></i></button><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" value="" class="sr-only peer" checked><div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div></label></div></div><div class="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"><div class="flex items-center"><i data-lucide="trending-up" class="w-5 h-5 text-blue-400 mr-4"></i><div><h4 class="font-medium text-text-primary">Dynamic Pricing Suggestions</h4><p class="text-xs text-text-secondary">Get AI-powered price suggestions based on sales data and trends.</p></div></div><div class="flex items-center gap-4"><button class="text-text-secondary hover:text-white p-1"><i data-lucide="settings-2" class="w-4 h-4"></i></button><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" value="" class="sr-only peer"><div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div></label></div></div><div class="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"><div class="flex items-center"><i data-lucide="send" class="w-5 h-5 text-yellow-400 mr-4"></i><div><h4 class="font-medium text-text-primary">Personalized Customer Promotions</h4><p class="text-xs text-text-secondary">Auto-send targeted offers to customers based on purchase history.</p></div></div><div class="flex items-center gap-4"><button class="text-text-secondary hover:text-white p-1"><i data-lucide="settings-2" class="w-4 h-4"></i></button><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" value="" class="sr-only peer" checked><div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div></label></div></div><div class="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"><div class="flex items-center"><i data-lucide="shield-alert" class="w-5 h-5 text-red-400 mr-4"></i><div><h4 class="font-medium text-text-primary">AI-Powered Fraud Detection</h4><p class="text-xs text-text-secondary">Monitor transactions for suspicious activity in real-time.</p></div></div><div class="flex items-center gap-4"><button class="text-text-secondary hover:text-white p-1"><i data-lucide="settings-2" class="w-4 h-4"></i></button><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" value="" class="sr-only peer" checked><div class="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div></label></div></div></div></div><div class="glass-pane p-6 rounded-lg"> <h2 class="text-xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4">Receipt & Invoice Customization</h2><div id="receipt-template-selector"></div></div><div class="flex justify-end"><button data-action="save-settings" class="btn btn-primary">Save Changes</button></div></div></div>`;
      default:
        return `<h1 class="text-2xl text-text-primary">Content for ${viewType}</h1>`;
    }
  }

  // --- NAVIGATION & TABBING SYSTEM ---
  const renderApp = () => {
    const profile = getCurrentProfile();
    document.querySelector(
      '[data-view="inventory"] .nav-link-text'
    ).textContent = profile.terminology.inventory;

    // Render Currency Switcher
    const currencyMenu = document.getElementById("currency-menu");
    document.getElementById("current-currency-display").textContent =
      appState.currentCurrency;
    currencyMenu.innerHTML = Object.entries(storeInfo.currencies)
      .map(
        ([code, currency]) => `
             <div class="action-menu-item" data-action="set-currency" data-currency-code="${code}">
                <span class="font-bold text-lg ${
                  code === appState.currentCurrency ? "text-accent" : ""
                }">${currency.symbol}</span>
                <span>${code} - ${currency.name}</span>
            </div>
        `
      )
      .join("");

    const activeTab = appState.tabs.find((t) => t.id === appState.activeTabId);

    mainTabsContainer.innerHTML = appState.tabs
      .map(
        (tab) => `
            <button data-action="switch-tab" data-id="${
              tab.id
            }" class="main-tab flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-bg-tertiary ${
          tab.id === appState.activeTabId ? "active" : ""
        }">
                ${
                  tab.viewType === "inventory"
                    ? profile.terminology.inventory
                    : tab.name
                }
                <i data-lucide="x" data-action="close-tab" data-id="${
                  tab.id
                }" class="w-4 h-4 rounded-full hover:bg-bg-tertiary ml-2"></i>
            </button>
        `
      )
      .join("");

    if (activeTab) {
      workspaceContent.innerHTML = `<div class="view-pane">${getViewContent(
        activeTab.viewType
      )}</div>`;
      viewInitializers[activeTab.viewType]?.(
        workspaceContent.firstElementChild
      );
    } else {
      workspaceContent.innerHTML = `<div class="text-center p-20 flex flex-col items-center"><i data-lucide="layout-template" class="w-20 h-20 text-border-color-strong mb-6"></i><h2 class="text-2xl font-semibold">Workspace is empty</h2><p class="text-text-secondary mt-2">Select an item from the sidebar to open a new tab.</p></div>`;
    }

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle(
        "active-view",
        activeTab && link.dataset.view === activeTab.viewType
      );
    });

    lucide.createIcons();
  };

  const openOrSwitchTab = (viewType) => {
    const existingTab = appState.tabs.find((t) => t.viewType === viewType);
    if (existingTab) {
      appState.activeTabId = existingTab.id;
    } else {
      const newTabId = `tab_${Date.now()}`;
      let name = viewType.charAt(0).toUpperCase() + viewType.slice(1);
      if (viewType === "inventory") {
        name = getCurrentProfile().terminology.inventory;
      }
      appState.tabs.push({ id: newTabId, name: name, viewType: viewType });
      appState.activeTabId = newTabId;
    }
    renderApp();
  };

  function initDashboard(pane) {
    const term = getCurrentProfile().terminology;
    let salesChart, categoryChart; // Hold chart instances

    const formatAndTruncate = (label, valueToFormat, isCurrency = true) => {
      const fullValue = isCurrency
        ? currencyUtils.format(valueToFormat, appState.currentCurrency, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : valueToFormat.toLocaleString();

      // If a formatted number is too long, truncate it and make it clickable to show the full value.
      if (fullValue.length > 10) {
        const truncatedValue = fullValue.substring(0, 7) + "...";
        // The 'data-action="show-full-stat"' attribute will be picked up by the global event listener to trigger the modal.
        return `<span class="cursor-pointer hover:underline" data-action="show-full-stat" data-full-value="${fullValue}" data-label="${label}">${truncatedValue}</span>`;
      }
      return fullValue;
    };

    const updateDashboardData = (period = "today") => {
      const now = new Date();
      let startDate, prevStartDate, periodLabel;

      switch (period) {
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          periodLabel = "vs. last month";
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          prevStartDate = new Date(startDate);
          prevStartDate.setDate(startDate.getDate() - 7);
          periodLabel = "vs. last week";
          break;
        case "today":
        default:
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          prevStartDate = new Date(startDate);
          prevStartDate.setDate(startDate.getDate() - 1);
          periodLabel = "vs. yesterday";
          break;
      }

      document.getElementById(
        "dashboard-date"
      ).textContent = `Showing data for: ${startDate.toLocaleDateString()} - ${now.toLocaleDateString()}`;

      const getMetricsForPeriod = (start, end) => {
        const relevantInvoices = mockDB.invoices.filter((inv) => {
          const invDate = new Date(inv.date);
          return invDate >= start && invDate <= end;
        });

        const totalRevenue = relevantInvoices.reduce(
          (sum, inv) => sum + inv.totalInBaseCurrency,
          0
        );
        const totalSales = relevantInvoices.length;
        const grossProfit = relevantInvoices.reduce((profit, inv) => {
          const invoiceProfit = inv.items.reduce((itemProfit, item) => {
            const product = mockDB.products.find((p) => p.id === item.id);
            const cost = product ? product.costPrice : item.price; // fallback to sale price if no cost found
            return itemProfit + (item.price - cost) * (item.qty || 1);
          }, 0);
          return profit + invoiceProfit;
        }, 0);
        const avgTransactionValue =
          totalSales > 0 ? totalRevenue / totalSales : 0;
        return { totalRevenue, totalSales, grossProfit, avgTransactionValue };
      };

      const currentMetrics = getMetricsForPeriod(startDate, now);
      const previousMetrics = getMetricsForPeriod(prevStartDate, startDate);

      const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const formatChange = (change) => {
        if (change === 0 || !isFinite(change))
          return `<span class="text-text-secondary">–</span>`;
        const color = change > 0 ? "text-green-400" : "text-red-400";
        const icon = change > 0 ? "arrow-up-right" : "arrow-down-right";
        return `<span class="flex items-center text-xs font-semibold ${color}"><i data-lucide="${icon}" class="w-3 h-3 mr-1"></i>${Math.abs(
          change
        ).toFixed(1)}%</span>`;
      };

      // --- Render KPI Cards ---
      const colorClasses = {
        blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
        green: { bg: "bg-green-500/10", text: "text-green-400" },
        yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
        indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
      };

      const stats = [
        {
          icon: "trending-up",
          color: "blue",
          label: "Total Revenue",
          value: formatAndTruncate(
            "Total Revenue",
            currentMetrics.totalRevenue
          ),
          change: calculateChange(
            currentMetrics.totalRevenue,
            previousMetrics.totalRevenue
          ),
        },
        {
          icon: "wallet",
          color: "green",
          label: "Gross Profit",
          value: formatAndTruncate("Gross Profit", currentMetrics.grossProfit),
          change: calculateChange(
            currentMetrics.grossProfit,
            previousMetrics.grossProfit
          ),
        },
        {
          icon: "shopping-cart",
          color: "yellow",
          label: "Total Sales",
          value: formatAndTruncate(
            "Total Sales",
            currentMetrics.totalSales,
            false
          ),
          change: calculateChange(
            currentMetrics.totalSales,
            previousMetrics.totalSales
          ),
        },
        {
          icon: "receipt-text",
          color: "indigo",
          label: "Avg. Sale Value",
          value: formatAndTruncate(
            "Avg. Sale Value",
            currentMetrics.avgTransactionValue
          ),
          change: calculateChange(
            currentMetrics.avgTransactionValue,
            previousMetrics.avgTransactionValue
          ),
        },
      ];

      pane.querySelector("#dashboard-stats-container").innerHTML = stats
        .map(
          (s) => `
                <div class="glass-pane p-5 rounded-xl flex items-start justify-between gap-4">
                    <div class="overflow-hidden">
                        <p class="text-sm font-medium text-text-secondary">${
                          s.label
                        }</p>
                        <p class="text-3xl font-bold text-text-primary">${
                          s.value
                        }</p>
                        <div class="flex items-center text-xs mt-1">
                            ${formatChange(s.change)}
                            <span class="text-text-secondary/70 ml-2">${periodLabel}</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 rounded-full flex items-center justify-center ${
                      colorClasses[s.color].bg
                    } shrink-0">
                        <i data-lucide="${s.icon}" class="w-6 h-6 ${
            colorClasses[s.color].text
          }"></i>
                    </div>
                </div>
            `
        )
        .join("");

      // --- Render Top Products ---
      const salesByProduct = mockDB.invoices
        .filter((inv) => new Date(inv.date) >= startDate)
        .flatMap((inv) => inv.items)
        .reduce((acc, item) => {
          acc[item.id] = (acc[item.id] || 0) + item.price * (item.qty || 1);
          return acc;
        }, {});

      const topProducts = Object.entries(salesByProduct)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id, revenue]) => ({
          product: mockDB.products.find((p) => p.id === id),
          revenue,
        }));

      pane.querySelector("#top-products-list").innerHTML = topProducts
        .map(
          (item) => `
                <li class="flex items-center justify-between text-sm hover:bg-bg-secondary/50 p-1.5 rounded-md">
                    <span class="font-medium text-text-primary truncate pr-4">${
                      item.product.name
                    }</span>
                    <span class="font-mono text-text-secondary">${currencyUtils.format(
                      item.revenue
                    )}</span>
                </li>
            `
        )
        .join("");

      // --- Render Recent Activity ---
      const recentInvoices = [...mockDB.invoices]
        .filter((inv) => new Date(inv.date) >= startDate)
        .reverse()
        .slice(0, 5);
      pane.querySelector("#recent-activity-feed").innerHTML = recentInvoices
        .map(
          (inv) => `
                <div class="flex items-center justify-between py-3 border-b border-border-color/50 last:border-b-0">
                    <div>
                        <p class="font-medium text-text-primary">${
                          inv.customerName
                        }</p>
                        <p class="text-xs text-text-secondary font-mono">${
                          inv.id
                        }</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold font-mono text-text-primary">${currencyUtils.format(
                          inv.totalInBaseCurrency,
                          inv.currency
                        )}</p>
                        <p class="text-xs text-text-secondary">${new Date(
                          inv.date
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</p>
                    </div>
                </div>
            `
        )
        .join("");

      // --- Update Charts ---
      const chartInvoices = mockDB.invoices.filter(
        (inv) => new Date(inv.date) >= startDate
      );
      let salesLabels, salesData;

      if (period === "today") {
        salesLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        salesData = Array(24).fill(0);
        chartInvoices.forEach((inv) => {
          const hour = new Date(inv.date).getHours();
          salesData[hour] += inv.totalInBaseCurrency;
        });
      } else {
        // Week or Month
        const salesByDay = chartInvoices.reduce((acc, inv) => {
          const day = new Date(inv.date).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          });
          acc[day] = (acc[day] || 0) + inv.totalInBaseCurrency;
          return acc;
        }, {});
        salesLabels = Object.keys(salesByDay);
        salesData = Object.values(salesByDay);
      }

      if (salesChart) {
        salesChart.data.labels = salesLabels;
        salesChart.data.datasets[0].data = salesData;
        salesChart.update();
      } else {
        const ctx = pane.querySelector("#sales-chart")?.getContext("2d");
        if (!ctx) return;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(0, 123, 255, 0.4)");
        gradient.addColorStop(1, "rgba(0, 123, 255, 0)");
        salesChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: salesLabels,
            datasets: [
              {
                label: "Sales",
                data: salesData,
                borderColor: "rgb(0, 123, 255)",
                backgroundColor: gradient,
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: "rgba(255,255,255,0.05)" },
                ticks: {
                  color: "var(--text-secondary)",
                  callback: (value) =>
                    currencyUtils.format(value, storeInfo.baseCurrency, {
                      notation: "compact",
                    }),
                },
              },
              x: {
                grid: { display: false },
                ticks: { color: "var(--text-secondary)" },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    currencyUtils.format(context.raw, storeInfo.baseCurrency),
                },
              },
            },
          },
        });
      }

      const categorySales = chartInvoices
        .flatMap((inv) => inv.items)
        .reduce((acc, item) => {
          const product = mockDB.products.find((p) => p.id === item.id);
          if (product) {
            acc[product.category] =
              (acc[product.category] || 0) + item.price * (item.qty || 1);
          }
          return acc;
        }, {});

      if (categoryChart) {
        categoryChart.data.labels = Object.keys(categorySales);
        categoryChart.data.datasets[0].data = Object.values(categorySales);
        categoryChart.update();
      } else {
        const catCtx = pane
          .querySelector("#category-sales-chart")
          ?.getContext("2d");
        if (!catCtx) return;
        categoryChart = new Chart(catCtx, {
          type: "doughnut",
          data: {
            labels: Object.keys(categorySales),
            datasets: [
              {
                label: "Sales",
                data: Object.values(categorySales),
                backgroundColor: [
                  "#007BFF",
                  "#28a745",
                  "#ffc107",
                  "#dc3545",
                  "#17a2b8",
                  "#6f42c1",
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.label}: ${currencyUtils.format(context.raw)}`,
                },
              },
            },
          },
        });
      }

      lucide.createIcons();
    };

    pane.querySelectorAll(".dashboard-period-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        pane
          .querySelectorAll(".dashboard-period-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        updateDashboardData(e.target.dataset.period);
      });
    });

    // Initial Load
    updateDashboardData("today");
  }

  // --- POS TABBING SYSTEM ---
  const posFullRender = (pane) => {
    const tabsContainer = pane.querySelector("#pos-tabs-container");
    const cartBody = pane.querySelector("#pos-cart-body");
    const subtotalEl = pane.querySelector("#pos-subtotal");
    const taxEl = pane.querySelector("#pos-tax");
    const totalEl = pane.querySelector("#pos-total");
    const customerDisplay = pane.querySelector("#pos-customer-display");
    const activeSale = posState.sales.find(
      (s) => s.id === posState.activeSaleId
    );
    const scrollLeftBtn = pane.querySelector("#pos-scroll-left");
    const scrollRightBtn = pane.querySelector("#pos-scroll-right");

    tabsContainer.innerHTML =
      posState.sales
        .map((s) => {
          let statusClass = s.id === posState.activeSaleId ? "active" : "";
          if (s.status === "held") statusClass += " held";
          return `
            <button data-action="switch-sale" data-id="${
              s.id
            }" class="pos-tab flex items-center gap-2 px-4 py-3 text-sm font-medium shrink-0 ${statusClass}">
                ${
                  s.status === "held"
                    ? '<i data-lucide="pause-circle" class="w-4 h-4 text-yellow-400"></i>'
                    : ""
                }
                ${s.name}
                <i data-lucide="x" data-action="close-sale" data-id="${
                  s.id
                }" class="w-4 h-4 rounded-full hover:bg-bg-tertiary"></i>
            </button>
            `;
        })
        .join("") +
      `<button data-action="new-sale" class="px-4 py-3 text-accent hover:text-white shrink-0"><i data-lucide="plus" class="w-5 h-5"></i></button>`;

    const handleOverflow = () => {
      if (!tabsContainer) return;
      const isOverflowing =
        tabsContainer.scrollWidth > tabsContainer.clientWidth;
      const isAtStart = tabsContainer.scrollLeft < 5;
      const isAtEnd =
        tabsContainer.scrollLeft + tabsContainer.clientWidth >=
        tabsContainer.scrollWidth - 5;
      scrollLeftBtn?.classList.toggle("hidden", !isOverflowing || isAtStart);
      scrollRightBtn?.classList.toggle("hidden", !isOverflowing || isAtEnd);
    };

    handleOverflow();
    tabsContainer.removeEventListener("scroll", handleOverflow);
    tabsContainer.addEventListener("scroll", handleOverflow);
    if ("ResizeObserver" in window) {
      new ResizeObserver(handleOverflow).observe(tabsContainer);
    }

    if (!activeSale) {
      cartBody.innerHTML =
        '<tr><td colspan="5" class="text-center py-10"><i data-lucide="shopping-cart" class="w-12 h-12 text-border-color-strong mx-auto mb-4"></i><p>No active sale. Create one with the + button!</p></td></tr>';
      subtotalEl.textContent = currencyUtils.format(0);
      taxEl.textContent = currencyUtils.format(0);
      totalEl.textContent = currencyUtils.format(0);
      customerDisplay.classList.add("hidden");
      lucide.createIcons();
      return;
    }

    if (activeSale.customer) {
      customerDisplay.innerHTML = `<div class="flex items-center gap-2">
                <i data-lucide="user-check" class="inline w-4 h-4"></i> 
                <span class="font-medium">${activeSale.customer.name}</span>
                <span class="text-xs font-mono bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="star" class="w-3 h-3"></i>${activeSale.customer.loyaltyPoints}</span>
                </div>
                <button data-action="remove-customer-from-sale" class="ml-2 text-red-400 hover:text-red-300"><i data-lucide="x" class="w-4 h-4"></i></button>`;
      customerDisplay.classList.remove("hidden");
      customerDisplay.classList.add("flex");
    } else {
      customerDisplay.classList.add("hidden");
    }

    cartBody.innerHTML = activeSale.cart.length
      ? activeSale.cart
          .map((item) => {
            const uom = mockDB.unitsOfMeasurement.find(
              (u) => u.id === item.uomId
            ) || { name: "units", allowsDecimal: false };
            const effectivePriceBase = item.price;
            const originalPriceBase = item.originalPrice || item.price;
            const hasDiscount = item.discount && item.discount.value > 0;

            return `
            <tr class="hover:bg-bg-tertiary/50">
                <td class="px-6 py-4 font-medium text-text-primary">${
                  item.name
                }<p class="text-xs text-text-secondary font-mono">${
              item.isSerialized
                ? `SN: ${item.serialNumber}`
                : `Stock: ${item.stock}`
            }</p>${
              item.notes
                ? `<p class="text-xs text-yellow-300/80 italic mt-1 flex items-center gap-1"><i data-lucide="message-square" class="w-3 h-3"></i> ${item.notes}</p>`
                : ""
            }</td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-3">
                        <div class="flex items-center border border-border-color rounded-md bg-bg-secondary">
                            <button ${
                              item.isSerialized ? "disabled" : ""
                            } data-action="decrement-qty" data-id="${
              item.id
            }" class="px-2 py-1.5 text-text-secondary hover:bg-border-color rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"><i data-lucide="minus" class="w-4 h-4 pointer-events-none"></i></button>
                            <span class="px-4 py-1 text-center font-medium text-text-primary">${
                              item.qty
                            }</span>
                            <button ${
                              item.isSerialized ? "disabled" : ""
                            } data-action="increment-qty" data-id="${
              item.id
            }" class="px-2 py-1.5 text-text-secondary hover:bg-border-color rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"><i data-lucide="plus" class="w-4 h-4 pointer-events-none"></i></button>
                        </div>
                        <span class="text-xs text-text-secondary">${
                          uom.name
                        }</span>
                    </div>
                </td>
                <td class="px-6 py-4 font-mono">
                    ${
                      hasDiscount
                        ? `<span class="line-through text-text-secondary/70">${currencyUtils.format(
                            originalPriceBase
                          )}</span><br>`
                        : ""
                    }
                    ${currencyUtils.format(effectivePriceBase)}
                </td>
                <td class="px-6 py-4 font-mono text-text-primary">${currencyUtils.format(
                  effectivePriceBase * item.qty
                )}</td>
                <td class="px-6 py-4 text-right">
                     <div class="flex items-center justify-end gap-1">
                        <button data-action="edit-cart-item" data-id="${
                          item.id
                        }" class="text-text-secondary/70 hover:text-accent z-10 relative p-2 rounded-md hover:bg-bg-tertiary"><i data-lucide="settings-2" class="w-5 h-5 pointer-events-none"></i></button>
                        <button data-action="remove-from-cart" data-id="${
                          item.id
                        }" class="text-danger/70 hover:text-danger z-10 relative p-2 rounded-md hover:bg-bg-tertiary"><i data-lucide="trash-2" class="w-5 h-5 pointer-events-none"></i></button>
                    </div>
                </td>
            </tr>
            `;
          })
          .join("")
      : '<tr><td colspan="5" class="text-center py-10"><i data-lucide="scan" class="w-12 h-12 text-border-color-strong mx-auto mb-4"></i><p>Scan a product to begin</p></td></tr>';

    const subtotalBase = activeSale.cart.reduce(
      (acc, item) => acc + (item.taxable ? item.price * item.qty : 0),
      0
    );
    const taxBase = subtotalBase * 0.1;
    const totalBase = activeSale.cart.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    subtotalEl.textContent = currencyUtils.format(subtotalBase);
    taxEl.textContent = currencyUtils.format(taxBase);
    totalEl.textContent = currencyUtils.format(totalBase);

    lucide.createIcons();
  };

  const addProductToActiveCart = (product) => {
    const activeSale = posState.sales.find(
      (s) => s.id === posState.activeSaleId
    );
    if (!activeSale) {
      showToast("No active sale selected.", "error");
      return;
    }
    if (product.stock <= 0 && product.productType === "physical") {
      showToast(`${product.name} is out of stock.`, "error");
      return;
    }

    // Handle serialized products
    if (product.isSerialized) {
      const availableSerials = product.serials || [];
      if (availableSerials.length === 0) {
        showToast(`${product.name} has no serial numbers in stock.`, "error");
        return;
      }

      const content = `
                <p class="mb-4">Select a serial number for <strong>${
                  product.name
                }</strong>.</p>
                <select id="serial-selector" class="form-select w-full">
                    ${availableSerials
                      .map((sn) => `<option value="${sn}">${sn}</option>`)
                      .join("")}
                </select>
            `;
      const footer = `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button id="confirm-serial" class="btn btn-primary">Add to Cart</button>`;
      const modal = showModal("Select Serial Number", content, footer);

      modal.querySelector("#confirm-serial").addEventListener("click", () => {
        const selectedSerial = modal.querySelector("#serial-selector").value;
        if (
          activeSale.cart.some((item) => item.serialNumber === selectedSerial)
        ) {
          showToast(
            `Serial number ${selectedSerial} is already in the cart.`,
            "error"
          );
          return;
        }
        activeSale.cart.push({
          ...product,
          qty: 1,
          serialNumber: selectedSerial,
        });
        posFullRender(workspaceContent.querySelector(".view-pane"));
        closeModal(modal);
      });
      return; // Stop execution until serial is selected
    }

    const existingItem = activeSale.cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.qty < product.stock) {
        existingItem.qty++;
      } else {
        showToast(`No more stock available for ${product.name}.`, "warning");
        return;
      }
    } else {
      activeSale.cart.push({ ...product, qty: 1 });
    }
    posFullRender(workspaceContent.querySelector(".view-pane"));
  };

  function initPOS(pane) {
    if (posState.sales.length === 0) {
      const newSaleId = `sale_${Date.now()}`;
      posState.sales.push({
        id: newSaleId,
        name: `Sale ${posState.saleCounter++}`,
        cart: [],
        customer: null,
        status: "active",
      });
      posState.activeSaleId = newSaleId;
    }
    posFullRender(pane);

    const searchInput = pane.querySelector("#pos-search");
    const resultsContainer = pane.querySelector("#pos-search-results");
    let activeSearchIndex = -1;

    const handleSelection = (product) => {
      if (!product) return;
      addProductToActiveCart(product);
      searchInput.value = "";
      resultsContainer.innerHTML = "";
      resultsContainer.classList.add("hidden");
      searchInput.focus();
    };

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 1) {
        resultsContainer.classList.add("hidden");
        return;
      }
      const filtered = mockDB.products
        .filter(
          (p) =>
            !p.hasVariants &&
            (p.name.toLowerCase().includes(query) ||
              p.id.toLowerCase().includes(query))
        )
        .slice(0, 7);

      if (filtered.length > 0) {
        resultsContainer.innerHTML = filtered
          .map(
            (p) => `
                    <div class="search-result-item p-3 cursor-pointer" data-id="${p.id}">
                        <p class="font-medium text-text-primary pointer-events-none">${p.name}</p>
                        <p class="text-xs text-text-secondary font-mono pointer-events-none">ID: ${p.id} / Stock: ${p.stock}</p>
                    </div>
                `
          )
          .join("");
        resultsContainer.classList.remove("hidden");
      } else {
        resultsContainer.innerHTML = `<p class="p-3 text-center text-text-secondary">No products found</p>`;
        resultsContainer.classList.remove("hidden");
      }
      activeSearchIndex = -1;
    });

    resultsContainer.addEventListener("mousedown", (e) => {
      const target = e.target.closest(".search-result-item");
      if (target) {
        const product = mockDB.products.find((p) => p.id === target.dataset.id);
        handleSelection(product);
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      const items = resultsContainer.querySelectorAll(".search-result-item");
      if (resultsContainer.classList.contains("hidden") || items.length === 0) {
        if (e.key === "Enter" && searchInput.value) {
          const product = mockDB.products.find(
            (p) => p.id.toLowerCase() === searchInput.value.toLowerCase()
          );
          if (product) handleSelection(product);
          else showToast(`Product "${searchInput.value}" not found.`, "error");
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeSearchIndex = (activeSearchIndex + 1) % items.length;
        items.forEach((item, i) =>
          item.classList.toggle("active", i === activeSearchIndex)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeSearchIndex =
          (activeSearchIndex - 1 + items.length) % items.length;
        items.forEach((item, i) =>
          item.classList.toggle("active", i === activeSearchIndex)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const activeItem = resultsContainer.querySelector(
          ".search-result-item.active"
        );
        if (activeItem) {
          const product = mockDB.products.find(
            (p) => p.id === activeItem.dataset.id
          );
          handleSelection(product);
        } else if (searchInput.value) {
          // Fallback for direct SKU entry
          const product = mockDB.products.find(
            (p) => p.id.toLowerCase() === searchInput.value.toLowerCase()
          );
          if (product) handleSelection(product);
          else showToast(`Product "${searchInput.value}" not found.`, "error");
        }
      } else if (e.key === "Escape") {
        resultsContainer.classList.add("hidden");
      }
    });

    searchInput.addEventListener("blur", () =>
      setTimeout(() => resultsContainer.classList.add("hidden"), 150)
    );

    const scrollLeftBtn = pane.querySelector("#pos-scroll-left");
    const scrollRightBtn = pane.querySelector("#pos-scroll-right");
    const tabsContainer = pane.querySelector("#pos-tabs-container");

    if (scrollLeftBtn && scrollRightBtn && tabsContainer) {
      scrollLeftBtn.addEventListener("click", () =>
        tabsContainer.scrollBy({ left: -250, behavior: "smooth" })
      );
      scrollRightBtn.addEventListener("click", () =>
        tabsContainer.scrollBy({ left: 250, behavior: "smooth" })
      );
    }
  }

  function initInventory(container) {
    if (!container) return;
    const term = getCurrentProfile().terminology;

    const renderListView = () => {
      container.innerHTML = `
                <div>
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-3xl font-bold text-text-primary">${term.inventory} Management</h1>
                        <button data-action="add-product" class="btn btn-primary"><i data-lucide="plus" class="w-5 h-5 mr-2"></i> Add ${term.product}</button>
                    </div>
                    <div class="bg-bg-secondary/50 rounded-xl">
                        <table class="table-pro">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>${term.product}</th>
                                    <th>${term.category}</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inventory-table-body"></tbody>
                        </table>
                    </div>
                </div>`;

      const tableBody = container.querySelector("#inventory-table-body");
      if (tableBody) {
        tableBody.innerHTML = mockDB.products
          .filter((p) => !p.parentSKU)
          .map(
            (p) => `
                    <tr class="table-row" data-action="view-product-details" data-id="${
                      p.id
                    }">
                        <td class="font-mono text-xs">${p.id}</td>
                        <td class="font-medium text-text-primary">${p.name}</td>
                        <td>${p.category}</td>
                        <td class="font-mono text-left">${currencyUtils.format(
                          p.price
                        )}</td>
                        <td class="text-left"><span class="font-medium ${
                          p.stock <= 0
                            ? "text-red-500 bg-red-500/10 px-2 py-1 rounded-md"
                            : p.stock < 20
                            ? "text-red-400"
                            : p.stock < 50
                            ? "text-yellow-400"
                            : "text-green-400"
                        }">${
              p.productType !== "physical"
                ? "N/A"
                : p.stock > 0
                ? `${p.stock} ${p.uomId}`
                : "Out of Stock"
            }</span></td>
                        <td class="text-right">
                            <div class="relative inline-block text-left">
                                <button data-action="toggle-action-menu" data-id="${
                                  p.id
                                }" class="p-2 rounded-md hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent">
                                    <i data-lucide="more-vertical" class="w-5 h-5 pointer-events-none"></i>
                                </button>
                                <div class="action-menu">
                                    <div class="action-menu-item" data-action="view-product-details" data-id="${
                                      p.id
                                    }"><i data-lucide="eye" class="w-4 h-4"></i><span>View Details</span></div>
                                    <div class="action-menu-item" data-action="edit-product" data-id="${
                                      p.id
                                    }"><i data-lucide="edit" class="w-4 h-4"></i><span>Edit</span></div>
                                    <div class="action-menu-item" data-action="adjust-stock" data-id="${
                                      p.id
                                    }"><i data-lucide="arrow-right-left" class="w-4 h-4"></i><span>Stock Adjustment</span></div>
                                    <div class="action-menu-item" data-action="create-po" data-id="${
                                      p.id
                                    }"><i data-lucide="file-plus-2" class="w-4 h-4"></i><span>Create PO</span></div>
                                    <div class="h-px bg-border-color my-1"></div>
                                    <div class="action-menu-item danger" data-action="delete-product" data-id="${
                                      p.id
                                    }"><i data-lucide="trash-2" class="w-4 h-4"></i><span>Delete ${
              term.product
            }</span></div>
                                </div>
                            </div>
                        </td>
                    </tr>`
          )
          .join("");
      }
      lucide.createIcons();
    };

    renderListView();
  }

  function initCustomers(pane) {
    const tableBody = pane.querySelector("#customers-table-body");
    const renderTable = () => {
      tableBody.innerHTML = mockDB.customers
        .map(
          (c) => `
                <tr class="table-row">
                    <td class="font-medium text-text-primary">${c.name}</td>
                    <td><div>${c.email}</div><div class="text-xs">${
            c.phone
          }</div></td>
                    <td>${c.address || "N/A"}</td>
                    <td class="font-mono text-xs">${c.loyaltyId || "N/A"}</td>
                    <td class="text-right">
                        <div class="relative inline-block text-left">
                            <button data-action="toggle-action-menu" data-id="${
                              c.id
                            }" class="p-2 rounded-md hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent">
                                <i data-lucide="more-vertical" class="w-5 h-5 pointer-events-none"></i>
                            </button>
                            <div class="action-menu">
                                <div class="action-menu-item" data-action="edit-customer" data-id="${
                                  c.id
                                }"><i data-lucide="edit" class="w-4 h-4"></i><span>Edit</span></div>
                                <div class="action-menu-item" data-action="view-customer-invoices" data-id="${
                                  c.id
                                }"><i data-lucide="file-text" class="w-4 h-4"></i><span>View Invoices</span></div>
                                <div class="h-px bg-border-color my-1"></div>
                                <div class="action-menu-item danger" data-action="delete-customer" data-id="${
                                  c.id
                                }"><i data-lucide="trash-2" class="w-4 h-4"></i><span>Delete Customer</span></div>
                            </div>
                        </div>
                    </td>
                </tr>`
        )
        .join("");
      lucide.createIcons();
    };
    renderTable();
    pane.rerender = renderTable;
  }

  function initInvoices(pane) {
    const tableBody = pane.querySelector("#invoices-table-body");
    const getStatusBadge = (status) => {
      const base = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
      if (status === "Paid") return `${base} bg-green-500/20 text-green-300`;
      if (status === "Pending")
        return `${base} bg-yellow-500/20 text-yellow-300`;
      return `${base} bg-gray-500/20 text-gray-300`;
    };
    const renderTable = () => {
      tableBody.innerHTML = [...mockDB.invoices]
        .reverse()
        .map(
          (i) => `
                 <tr class="table-row">
                    <td class="font-mono text-xs">${i.id}</td>
                    <td class="font-medium text-text-primary">${
                      i.customerName
                    }</td>
                    <td>${new Date(i.date).toLocaleDateString()}</td>
                    <td class="font-mono">${currencyUtils.format(
                      i.totalInBaseCurrency,
                      i.currency
                    )}</td>
                    <td><span class="${getStatusBadge(i.status)}">${
            i.status
          }</span></td>
                    <td class="text-right">
                        <div class="relative inline-block text-left">
                            <button data-action="toggle-action-menu" data-id="${
                              i.id
                            }" class="p-2 rounded-md hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent">
                                <i data-lucide="more-vertical" class="w-5 h-5 pointer-events-none"></i>
                            </button>
                            <div class="action-menu">
                                <div class="action-menu-item" data-action="view-invoice" data-id="${
                                  i.id
                                }"><i data-lucide="eye" class="w-4 h-4"></i><span>View Details</span></div>
                                <div class="action-menu-item" data-action="print-invoice" data-id="${
                                  i.id
                                }"><i data-lucide="printer" class="w-4 h-4"></i><span>Print</span></div>
                                <div class="action-menu-item" data-action="email-invoice" data-id="${
                                  i.id
                                }"><i data-lucide="send" class="w-4 h-4"></i><span>Send via Email</span></div>
                                <div class="h-px bg-border-color my-1"></div>
                                <div class="action-menu-item danger" data-action="delete-invoice" data-id="${
                                  i.id
                                }"><i data-lucide="trash-2" class="w-4 h-4"></i><span>Delete Invoice</span></div>
                            </div>
                        </div>
                    </td>
                </tr>`
        )
        .join("");
      lucide.createIcons();
    };
    renderTable();
    pane.rerender = renderTable;
  }

  function initReports(pane) {
    const term = getCurrentProfile().terminology;
    const reportsContainer = pane.querySelector("#reports-container");
    let chartInstances = {};

    const colorClasses = {
      blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
      green: { bg: "bg-green-500/10", text: "text-green-400" },
      yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
      indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
      red: { bg: "bg-red-500/10", text: "text-red-400" },
    };

    const formatAndTruncate = (label, valueToFormat, isCurrency = true) => {
      const fullValue = isCurrency
        ? currencyUtils.format(valueToFormat, appState.currentCurrency, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : valueToFormat.toLocaleString();

      if (fullValue.length > 10) {
        const truncatedValue = fullValue.substring(0, 7) + "...";
        return `<span class="cursor-pointer hover:underline" data-action="show-full-stat" data-full-value="${fullValue}" data-label="${label}">${truncatedValue}</span>`;
      }
      return fullValue;
    };

    const destroyCharts = () => {
      Object.values(chartInstances).forEach((chart) => chart.destroy());
      chartInstances = {};
    };

    const commonChartOptions = (isCurrency = true, customOptions = {}) => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: {
            color: "var(--text-secondary)",
            callback: isCurrency
              ? (value) =>
                  currencyUtils.format(value, storeInfo.baseCurrency, {
                    notation: "compact",
                  })
              : (value) => value.toLocaleString(),
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: "var(--text-secondary)" },
        },
      },
      plugins: {
        legend: { labels: { color: "var(--text-secondary)" } },
        tooltip: {
          callbacks: {
            label: (context) =>
              isCurrency
                ? currencyUtils.format(context.raw, storeInfo.baseCurrency)
                : context.raw.toLocaleString(),
          },
        },
      },
      ...customOptions,
    });

    const renderSalesReport = () => {
      destroyCharts();
      const kpis = [
        {
          icon: "trending-up",
          label: "Gross Revenue",
          value: 9250.75,
          change: "+12.5%",
          isCurrency: true,
          color: "blue",
        },
        {
          icon: "wallet",
          label: "Gross Profit",
          value: 4150.25,
          change: "+9.8%",
          isCurrency: true,
          color: "green",
        },
        {
          icon: "receipt",
          label: "Avg. Sale Value",
          value: 88.1,
          change: "-2.1%",
          isCurrency: true,
          color: "yellow",
        },
        {
          icon: "users",
          label: "New Customers",
          value: 42,
          change: "+5.0%",
          isCurrency: false,
          color: "indigo",
        },
      ];

      reportsContainer.innerHTML = `
                <!-- KPIs -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${kpis
                      .map(
                        (kpi) => `
                        <div class="kpi-card glass-pane p-5 rounded-xl flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center ${
                              colorClasses[kpi.color].bg
                            } shrink-0">
                                <i data-lucide="${kpi.icon}" class="w-6 h-6 ${
                          colorClasses[kpi.color].text
                        }"></i>
                            </div>
                            <div class="overflow-hidden">
                                <p class="text-sm font-medium text-text-secondary">${
                                  kpi.label
                                }</p>
                                <div class="flex items-baseline gap-2">
                                    <p class="text-2xl font-bold text-text-primary">${formatAndTruncate(
                                      kpi.label,
                                      kpi.value,
                                      kpi.isCurrency
                                    )}</p>
                                    <p class="text-xs font-semibold ${
                                      kpi.change.startsWith("+")
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }">${kpi.change}</p>
                                </div>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <!-- Charts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="glass-pane p-6 rounded-xl h-96 flex flex-col"><h3 class="text-xl font-semibold text-text-primary mb-4">Profit & Loss</h3><div class="flex-grow"><canvas id="pnl-chart"></canvas></div></div>
                    <div class="glass-pane p-6 rounded-xl h-96 flex flex-col"><h3 class="text-xl font-semibold text-text-primary mb-4">Sales by Hour</h3><div class="flex-grow"><canvas id="sales-hour-chart"></canvas></div></div>
                </div>
                <!-- Data Table -->
                <div class="glass-pane p-6 rounded-xl">
                    <h3 class="text-xl font-semibold text-text-primary mb-4">Sales Breakdown</h3>
                     <div class="overflow-x-auto">
                        <table class="table-pro">
                            <thead><tr><th>Invoice ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Profit</th><th>Status</th></tr></thead>
                            <tbody>
                            ${mockDB.invoices
                              .slice(0, 5)
                              .map(
                                (inv) => `
                                <tr class="table-row">
                                    <td class="font-mono text-xs">${inv.id}</td>
                                    <td class="text-text-primary font-medium">${
                                      inv.customerName
                                    }</td>
                                    <td>${new Date(
                                      inv.date
                                    ).toLocaleDateString()}</td>
                                    <td class="text-center">${inv.items.reduce(
                                      (sum, i) => sum + (i.qty || 1),
                                      0
                                    )}</td>
                                    <td class="font-mono">${currencyUtils.format(
                                      inv.totalInBaseCurrency
                                    )}</td>
                                    <td class="font-mono text-green-400">${currencyUtils.format(
                                      inv.totalInBaseCurrency * 0.45
                                    )}</td>
                                    <td><span class="px-2 py-1 text-xs font-semibold rounded-full ${
                                      inv.status === "Paid"
                                        ? "bg-green-500/20 text-green-300"
                                        : "bg-yellow-500/20 text-yellow-300"
                                    }">${inv.status}</span></td>
                                </tr>`
                              )
                              .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

      // P&L Chart
      const pnlCtx = document.getElementById("pnl-chart").getContext("2d");
      chartInstances.pnl = new Chart(pnlCtx, {
        type: "line",
        data: {
          labels: ["June", "July", "August", "September"],
          datasets: [
            {
              label: "Revenue",
              data: [5200, 7800, 6900, 9250],
              borderColor: "rgb(0, 123, 255)",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Profit",
              data: [2300, 3500, 3100, 4150],
              borderColor: "rgb(40, 167, 69)",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: commonChartOptions(true),
      });

      // Sales by Hour Chart
      const salesHourCtx = document
        .getElementById("sales-hour-chart")
        .getContext("2d");
      chartInstances.salesHour = new Chart(salesHourCtx, {
        type: "bar",
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `${i + 9} AM/PM`),
          datasets: [
            {
              label: "Sales",
              data: [12, 19, 25, 35, 40, 33, 28, 50, 65, 55, 30, 15],
              backgroundColor: "rgba(0, 123, 255, 0.6)",
            },
          ],
        },
        options: commonChartOptions(true, {
          scales: { x: { grid: { display: false } } },
        }),
      });
      lucide.createIcons();
    };

    const renderInventoryReport = () => {
      destroyCharts();
      const physicalProducts = mockDB.products.filter(
        (p) => p.productType === "physical" && !p.parentSKU
      );
      const totalValue = physicalProducts.reduce(
        (sum, p) => sum + (p.stock || 0) * (p.costPrice || 0),
        0
      );
      const totalSKUs = physicalProducts.length;
      const lowStockCount = physicalProducts.filter(
        (p) => p.stock > 0 && p.stock < 20
      ).length;
      const outOfStockCount = physicalProducts.filter((p) => p.stock === 0)
        .length;

      const kpis = [
        {
          icon: "dollar-sign",
          label: `Total ${term.inventory} Value`,
          value: totalValue,
          isCurrency: true,
          color: "blue",
        },
        {
          icon: "boxes",
          label: `Total SKUs`,
          value: totalSKUs,
          isCurrency: false,
          color: "indigo",
        },
        {
          icon: "package-alert",
          label: "Low Stock",
          value: lowStockCount,
          isCurrency: false,
          color: "yellow",
        },
        {
          icon: "package-x",
          label: "Out of Stock",
          value: outOfStockCount,
          isCurrency: false,
          color: "red",
        },
      ];

      const stockValueByCategory = physicalProducts.reduce((acc, p) => {
        const value = (p.stock || 0) * (p.costPrice || 0);
        acc[p.category] = (acc[p.category] || 0) + value;
        return acc;
      }, {});

      reportsContainer.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${kpis
                      .map(
                        (kpi) => `
                        <div class="kpi-card glass-pane p-5 rounded-xl flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center ${
                              colorClasses[kpi.color].bg
                            } shrink-0">
                                <i data-lucide="${kpi.icon}" class="w-6 h-6 ${
                          colorClasses[kpi.color].text
                        }"></i>
                            </div>
                            <div class="overflow-hidden">
                                <p class="text-sm font-medium text-text-secondary">${
                                  kpi.label
                                }</p>
                                <p class="text-2xl font-bold text-text-primary">${formatAndTruncate(
                                  kpi.label,
                                  kpi.value,
                                  kpi.isCurrency
                                )}</p>
                            </div>
                        </div>`
                      )
                      .join("")}
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div class="glass-pane p-6 rounded-xl h-96 flex flex-col"><h3 class="text-xl font-semibold text-text-primary mb-4">Stock Value by ${
                     term.category
                   }</h3><div class="flex-grow"><canvas id="stock-value-chart"></canvas></div></div>
                   <div class="glass-pane p-6 rounded-xl h-96 flex flex-col"><h3 class="text-xl font-semibold text-text-primary mb-4">Top 5 Most Stocked ${
                     term.product
                   }s</h3><div class="flex-grow"><canvas id="top-stocked-chart"></canvas></div></div>
                </div>
                <div class="glass-pane p-6 rounded-xl">
                    <h3 class="text-xl font-semibold text-text-primary mb-4">${
                      term.inventory
                    } List</h3>
                    <div class="overflow-x-auto">
                        <table class="table-pro">
                            <thead><tr><th>SKU</th><th>${
                              term.product
                            }</th><th>${
        term.category
      }</th><th>Stock</th><th>Cost Price</th><th>Stock Value</th></tr></thead>
                            <tbody>
                            ${physicalProducts
                              .sort((a, b) => a.stock - b.stock)
                              .map((p) => {
                                const stockValue =
                                  (p.stock || 0) * (p.costPrice || 0);
                                let stockClass = "";
                                if (p.stock === 0) stockClass = "bg-red-900/30";
                                else if (p.stock < 20)
                                  stockClass = "bg-yellow-900/30";
                                return `<tr class="table-row ${stockClass}">
                                    <td class="font-mono text-xs">${p.id}</td>
                                    <td class="text-text-primary font-medium">${
                                      p.name
                                    }</td>
                                    <td>${p.category}</td>
                                    <td class="font-mono ${
                                      p.stock < 20 && p.stock > 0
                                        ? "text-yellow-300"
                                        : p.stock === 0
                                        ? "text-red-400"
                                        : ""
                                    }">${p.stock} ${p.uomId}</td>
                                    <td class="font-mono">${currencyUtils.format(
                                      p.costPrice || 0
                                    )}</td>
                                    <td class="font-mono">${currencyUtils.format(
                                      stockValue
                                    )}</td>
                                </tr>`;
                              })
                              .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

      // Stock Value Chart
      const stockValueCtx = document
        .getElementById("stock-value-chart")
        .getContext("2d");
      chartInstances.stockValue = new Chart(stockValueCtx, {
        type: "bar",
        data: {
          labels: Object.keys(stockValueByCategory),
          datasets: [
            {
              label: "Stock Value",
              data: Object.values(stockValueByCategory),
              backgroundColor: "#007BFF",
            },
          ],
        },
        options: commonChartOptions(true),
      });

      // Top Stocked Chart
      const topStocked = [...physicalProducts]
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 5);
      const topStockedCtx = document
        .getElementById("top-stocked-chart")
        .getContext("2d");
      chartInstances.topStocked = new Chart(topStockedCtx, {
        type: "doughnut",
        data: {
          labels: topStocked.map((p) => p.name),
          datasets: [
            {
              label: "Stock Quantity",
              data: topStocked.map((p) => p.stock),
              backgroundColor: [
                "#007BFF",
                "#28a745",
                "#ffc107",
                "#17a2b8",
                "#6f42c1",
              ],
            },
          ],
        },
        options: commonChartOptions(false, {
          plugins: { legend: { position: "right" } },
        }),
      });

      lucide.createIcons();
    };

    const renderCustomerReport = () => {
      destroyCharts();

      const customerData = mockDB.customers.map((customer) => {
        const customerInvoices = mockDB.invoices.filter(
          (inv) => inv.customerId === customer.id
        );
        const totalSpent = customerInvoices.reduce(
          (sum, inv) => sum + inv.totalInBaseCurrency,
          0
        );
        return {
          ...customer,
          invoiceCount: customerInvoices.length,
          totalSpent,
        };
      });

      const totalCustomers = customerData.length;
      const totalSpentAll = customerData.reduce(
        (sum, c) => sum + c.totalSpent,
        0
      );
      const avgSpend = totalCustomers > 0 ? totalSpentAll / totalCustomers : 0;
      const newCustomers = customerData.filter(
        (c) => new Date(c.joinDate) >= new Date("2025-08-01")
      ).length;

      const kpis = [
        {
          icon: "users",
          label: "Total Customers",
          value: totalCustomers,
          isCurrency: false,
          color: "green",
        },
        {
          icon: "user-plus",
          label: "New Customers (Since Aug)",
          value: newCustomers,
          isCurrency: false,
          color: "blue",
        },
        {
          icon: "wallet",
          label: "Total Customer Spend",
          value: totalSpentAll,
          isCurrency: true,
          color: "indigo",
        },
        {
          icon: "receipt",
          label: "Avg. Spend / Customer",
          value: avgSpend,
          isCurrency: true,
          color: "yellow",
        },
      ];

      const topCustomers = [...customerData]
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      reportsContainer.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     ${kpis
                       .map(
                         (kpi) => `
                        <div class="kpi-card glass-pane p-5 rounded-xl flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center ${
                              colorClasses[kpi.color].bg
                            } shrink-0">
                                <i data-lucide="${kpi.icon}" class="w-6 h-6 ${
                           colorClasses[kpi.color].text
                         }"></i>
                            </div>
                            <div class="overflow-hidden">
                                <p class="text-sm font-medium text-text-secondary">${
                                  kpi.label
                                }</p>
                                <p class="text-2xl font-bold text-text-primary">${formatAndTruncate(
                                  kpi.label,
                                  kpi.value,
                                  kpi.isCurrency
                                )}</p>
                            </div>
                        </div>`
                       )
                       .join("")}
                </div>
                <div class="grid grid-cols-1 gap-6">
                    <div class="glass-pane p-6 rounded-xl h-96 flex flex-col"><h3 class="text-xl font-semibold text-text-primary mb-4">Top 5 Customers by Spend</h3><div class="flex-grow"><canvas id="top-customers-chart"></canvas></div></div>
                </div>
                <div class="glass-pane p-6 rounded-xl">
                    <h3 class="text-xl font-semibold text-text-primary mb-4">Customer List</h3>
                    <div class="overflow-x-auto">
                        <table class="table-pro">
                            <thead><tr><th>Customer Name</th><th>Join Date</th><th>Total Invoices</th><th>Total Spent</th><th>Loyalty Points</th></tr></thead>
                            <tbody>
                            ${customerData
                              .map(
                                (c) => `
                                <tr class="table-row">
                                    <td class="text-text-primary font-medium">${
                                      c.name
                                    }</td>
                                    <td>${new Date(
                                      c.joinDate
                                    ).toLocaleDateString()}</td>
                                    <td class="text-center">${
                                      c.invoiceCount
                                    }</td>
                                    <td class="font-mono">${currencyUtils.format(
                                      c.totalSpent
                                    )}</td>
                                    <td class="font-mono">${c.loyaltyPoints.toLocaleString()}</td>
                                </tr>`
                              )
                              .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
             `;

      const topCustomersCtx = document
        .getElementById("top-customers-chart")
        .getContext("2d");
      chartInstances.topCustomers = new Chart(topCustomersCtx, {
        type: "bar",
        data: {
          labels: topCustomers.map((c) => c.name),
          datasets: [
            {
              label: "Total Spend",
              data: topCustomers.map((c) => c.totalSpent),
              backgroundColor: "#28a745",
            },
          ],
        },
        options: commonChartOptions(true),
      });
      lucide.createIcons();
    };

    // Event Listeners for report type switching
    pane.querySelectorAll(".report-type-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        pane
          .querySelectorAll(".report-type-btn")
          .forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const reportType = e.currentTarget.dataset.type;
        switch (reportType) {
          case "inventory":
            renderInventoryReport();
            break;
          case "customer":
            renderCustomerReport();
            break;
          case "sales":
          default:
            renderSalesReport();
            break;
        }
      });
    });

    // Initial Load
    renderSalesReport();
  }

  function initSettings(pane) {
    const businessTypeSelectorContainer = pane.querySelector(
      "#business-type-selector"
    );
    const receiptSelectorContainer = pane.querySelector(
      "#receipt-template-selector"
    );
    const defaultCurrencySelector = pane.querySelector(
      "#default-currency-selector"
    );

    // Populate Currency Selector
    if (defaultCurrencySelector) {
      defaultCurrencySelector.innerHTML = Object.entries(storeInfo.currencies)
        .map(
          ([code, currency]) =>
            `<option value="${code}" ${
              appState.settings.defaultCurrency === code ? "selected" : ""
            }>${code} - ${currency.name}</option>`
        )
        .join("");
    }

    const renderBusinessTypeSelector = () => {
      let profilesHTML = Object.entries(businessProfiles)
        .map(
          ([id, type]) => `
                <div data-action="select-business-type" data-type-id="${id}" class="relative group template-selector rounded-lg p-4 bg-bg-secondary flex flex-col items-center justify-center text-center h-28 ${
            appState.settings.businessType === id ? "active" : ""
          }">
                     <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button data-action="edit-predefined-profile" data-id="${id}" class="p-1.5 bg-bg-tertiary rounded-md hover:text-accent"><i data-lucide="edit" class="w-3 h-3 pointer-events-none"></i></button>
                    </div>
                    <i data-lucide="${
                      type.icon
                    }" class="w-8 h-8 mb-2 text-accent"></i>
                    <h4 class="font-semibold text-text-primary text-sm">${
                      type.name
                    }</h4>
                </div>
            `
        )
        .join("");

      profilesHTML += Object.entries(appState.customProfiles)
        .map(
          ([id, type]) => `
                 <div data-action="select-business-type" data-type-id="${id}" class="relative group template-selector rounded-lg p-4 bg-bg-secondary flex flex-col items-center justify-center text-center h-28 ${
            appState.settings.businessType === id ? "active" : ""
          }">
                    <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button data-action="edit-custom-profile" data-id="${id}" class="p-1.5 bg-bg-tertiary rounded-md hover:text-accent"><i data-lucide="edit" class="w-3 h-3 pointer-events-none"></i></button>
                        <button data-action="delete-custom-profile" data-id="${id}" class="p-1.5 bg-bg-tertiary rounded-md hover:text-danger"><i data-lucide="trash-2" class="w-3 h-3 pointer-events-none"></i></button>
                    </div>
                    <i data-lucide="${
                      type.icon
                    }" class="w-8 h-8 mb-2 text-accent"></i>
                    <h4 class="font-semibold text-text-primary text-sm">${
                      type.name
                    }</h4>
                </div>
            `
        )
        .join("");

      profilesHTML += `
                 <div data-action="create-custom-profile" class="template-selector rounded-lg p-4 bg-bg-secondary flex flex-col items-center justify-center text-center h-28 border-dashed border-border-color-strong hover:border-accent">
                    <i data-lucide="plus" class="w-8 h-8 mb-2 text-text-secondary"></i>
                    <h4 class="font-semibold text-text-primary text-sm">Create Your Own</h4>
                </div>
            `;

      businessTypeSelectorContainer.innerHTML = `
                <p class="text-sm text-text-secondary mb-4">Select your primary business type to tailor the system experience.</p>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                   ${profilesHTML}
                </div>
            `;
      lucide.createIcons();
    };

    businessTypeSelectorContainer.addEventListener("click", (e) => {
      const selectTarget = e.target.closest(
        '[data-action="select-business-type"]'
      );
      const createTarget = e.target.closest(
        '[data-action="create-custom-profile"]'
      );
      const editPredefinedTarget = e.target.closest(
        '[data-action="edit-predefined-profile"]'
      );
      const editCustomTarget = e.target.closest(
        '[data-action="edit-custom-profile"]'
      );
      const deleteTarget = e.target.closest(
        '[data-action="delete-custom-profile"]'
      );

      if (createTarget) {
        openCustomProfileModal();
      } else if (editPredefinedTarget) {
        e.stopPropagation();
        openCustomProfileModal(editPredefinedTarget.dataset.id, true);
      } else if (editCustomTarget) {
        e.stopPropagation();
        openCustomProfileModal(editCustomTarget.dataset.id, false);
      } else if (deleteTarget) {
        e.stopPropagation();
        const profileId = deleteTarget.dataset.id;
        const profileName = appState.customProfiles[profileId].name;
        const modal = showModal(
          "Delete Profile",
          `<p>Are you sure you want to delete the "${profileName}" profile? This action cannot be undone.</p>`,
          `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button id="confirm-delete" class="btn btn-danger">Delete</button>`
        );
        modal.querySelector("#confirm-delete").addEventListener("click", () => {
          delete appState.customProfiles[profileId];
          if (appState.settings.businessType === profileId) {
            appState.settings.businessType = "general";
          }
          closeModal(modal);
          renderApp();
          showToast(`Profile "${profileName}" deleted.`);
        });
      } else if (selectTarget) {
        const typeId = selectTarget.dataset.typeId;
        if (appState.settings.businessType !== typeId) {
          appState.settings.businessType = typeId;
          // We don't need to call renderApp() here, the save button will handle it.
          // Just update the UI state.
          businessTypeSelectorContainer
            .querySelectorAll('[data-action="select-business-type"]')
            .forEach((el) => el.classList.remove("active"));
          selectTarget.classList.add("active");
        }
      }
    });

    const renderReceiptSelector = () => {
      receiptSelectorContainer.innerHTML = `
                <p class="text-sm text-text-secondary mb-4">Choose the default design for printed and digital receipts.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${Object.entries(receiptTemplates)
                      .map(
                        ([key, template]) => `
                        <div data-action="select-template" data-template-id="${key}" class="template-selector rounded-lg p-4 bg-bg-secondary ${
                          appState.settings.selectedReceiptTemplate === key
                            ? "active"
                            : ""
                        }">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-semibold text-text-primary capitalize pr-2">${
                                  template.name
                                }</h4>
                                <button data-action="preview-template" data-template-id="${key}" class="btn btn-secondary p-1 h-auto text-xs shrink-0"><i data-lucide="eye" class="w-4 h-4"></i></button>
                            </div>
                            <div class="h-40 bg-bg-tertiary rounded overflow-hidden pointer-events-none scale-[30%] origin-top-left -mb-28">
                                ${template.preview}
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
      lucide.createIcons();
    };

    receiptSelectorContainer.addEventListener("click", (e) => {
      const previewTarget = e.target.closest(
        '[data-action="preview-template"]'
      );
      const selectTarget = e.target.closest('[data-action="select-template"]');

      if (previewTarget) {
        e.stopPropagation();
        const templateId = previewTarget.dataset.templateId;
        showLargeReceiptPreview(templateId);
      } else if (selectTarget) {
        const templateId = selectTarget.dataset.templateId;
        if (appState.settings.selectedReceiptTemplate !== templateId) {
          appState.settings.selectedReceiptTemplate = templateId;
          receiptSelectorContainer
            .querySelectorAll('[data-action="select-template"]')
            .forEach((el) => el.classList.remove("active"));
          selectTarget.classList.add("active");
        }
      }
    });

    renderBusinessTypeSelector();
    renderReceiptSelector();
  }

  function openCustomerModal(customerId = null, callback = null) {
    const customer = customerId
      ? mockDB.customers.find((c) => c.id === customerId)
      : {};
    const isEditing = !!customerId;
    const content = `<form id="customer-form" class="space-y-4"><div><label class="block text-sm font-medium text-text-secondary mb-1">Full Name</label><input type="text" name="name" value="${
      customer.name || ""
    }" class="w-full form-input" required></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-text-secondary mb-1">Email</label><input type="email" name="email" value="${
      customer.email || ""
    }" class="w-full form-input"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Phone</label><input type="tel" name="phone" value="${
      customer.phone || ""
    }" class="w-full form-input"></div></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Address</label><input type="text" name="address" value="${
      customer.address || ""
    }" class="w-full form-input"></div><div><label class="block text-sm font-medium text-text-secondary mb-1">Loyalty ID</label><input type="text" name="loyaltyId" value="${
      customer.loyaltyId ||
      `CS-${(customer.name || "CUST")
        .substring(0, 2)
        .toUpperCase()}-${Date.now().toString().slice(-3)}`
    }" class="w-full form-input"></div></form>`;
    const footer = `<button type="button" data-action="close-modal" class="btn btn-secondary">Cancel</button><button type="submit" form="customer-form" class="btn btn-primary">${
      isEditing ? "Save Changes" : "Create Customer"
    }</button>`;
    const modal = showModal(
      isEditing ? "Edit Customer" : "Add New Customer",
      content,
      footer,
      { size: "max-w-2xl" }
    );
    modal.querySelector("#customer-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      const newCustomerData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        loyaltyId: formData.get("loyaltyId"),
      };
      const activeTab = appState.tabs.find(
        (t) => t.id === appState.activeTabId
      );

      if (isEditing) {
        const index = mockDB.customers.findIndex((c) => c.id === customerId);
        mockDB.customers[index] = {
          ...mockDB.customers[index],
          ...newCustomerData,
        };
      } else {
        const newCustomer = {
          id: `CUST${Date.now().toString().slice(-4)}`,
          loyaltyPoints: 0,
          joinDate: new Date().toISOString().slice(0, 10),
          ...newCustomerData,
        };
        mockDB.customers.push(newCustomer);
        if (callback) callback(newCustomer);
      }
      if (activeTab?.viewType === "customers" || activeTab?.viewType === "pos")
        renderApp();
      showToast(`Customer ${isEditing ? "updated" : "added"} successfully!`);
      closeModal(modal);
    });
  }

  function openEditCartItemModal(itemId) {
    const activeSale = posState.sales.find(
      (s) => s.id === posState.activeSaleId
    );
    if (!activeSale) return;
    const itemIndex = activeSale.cart.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return;

    const item = activeSale.cart[itemIndex];
    // Set originalPrice if it doesn't exist yet
    if (item.originalPrice === undefined) {
      item.originalPrice = item.price;
    }

    const uom = mockDB.unitsOfMeasurement.find((u) => u.id === item.uomId) || {
      name: "units",
      allowsDecimal: false,
    };
    const qtyStep = uom.allowsDecimal ? "0.01" : "1";

    const content = `
        <form id="edit-cart-item-form" class="space-y-4">
            <p class="text-lg font-medium text-text-primary">${item.name}</p>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-text-secondary mb-1">Quantity</label>
                    <input type="number" step="${qtyStep}" name="qty" value="${
      item.qty
    }" class="w-full form-input" ${item.isSerialized ? "readonly" : ""}>
                </div>
                <div>
                    <label class="block text-sm font-medium text-text-secondary mb-1">Unit Price (${
                      storeInfo.baseCurrency
                    })</label>
                    <input type="number" step="0.01" name="price" value="${item.price.toFixed(
                      2
                    )}" class="w-full form-input">
                    <p class="text-xs text-text-secondary mt-1">Original: ${currencyUtils.format(
                      item.originalPrice,
                      storeInfo.baseCurrency
                    )}</p>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Line Item Discount (Overrides Price)</label>
                <div class="flex">
                    <select name="discountType" class="form-select rounded-r-none w-20">
                        <option value="fixed" ${
                          item.discount?.type === "fixed" ? "selected" : ""
                        }>${
      currencyUtils.get(storeInfo.baseCurrency).symbol
    }</option>
                        <option value="percent" ${
                          item.discount?.type === "percent" ? "selected" : ""
                        }>%</option>
                    </select>
                    <input type="number" step="0.01" name="discountValue" value="${
                      item.discount?.value || ""
                    }" placeholder="e.g., 5 or 10.50" class="w-full form-input rounded-l-none">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Notes</label>
                <textarea name="notes" class="form-textarea w-full h-20" placeholder="e.g., Customer requested gift wrap">${
                  item.notes || ""
                }</textarea>
            </div>
        </form>
        `;
    const footer = `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button type="submit" form="edit-cart-item-form" class="btn btn-primary">Apply Changes</button>`;
    const modal = showModal("Edit Item Details", content, footer);

    modal
      .querySelector("#edit-cart-item-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newQty = parseFloat(formData.get("qty"));
        const manualPrice = parseFloat(formData.get("price"));
        const discountType = formData.get("discountType");
        const discountValue = parseFloat(formData.get("discountValue"));
        const notes = formData.get("notes");

        // Update item in cart
        const editedItem = activeSale.cart[itemIndex];
        editedItem.qty = newQty;
        editedItem.notes = notes;

        if (!isNaN(discountValue) && discountValue > 0) {
          editedItem.discount = { type: discountType, value: discountValue };
          // If discount is applied, it takes precedence and recalculates the effective price
          if (discountType === "percent") {
            editedItem.price =
              editedItem.originalPrice * (1 - discountValue / 100);
          } else {
            // fixed
            editedItem.price = Math.max(
              0,
              editedItem.originalPrice - discountValue
            );
          }
        } else {
          // No discount or discount removed, so use the manually entered price
          delete editedItem.discount;
          editedItem.price = manualPrice;
        }

        posFullRender(workspaceContent.querySelector(".view-pane"));
        closeModal(modal);
        showToast(`${editedItem.name} updated in cart.`, "info");
      });
  }

  // --- RESPONSIVE SIDEBAR LOGIC ---
  const toggleMobileSidebar = (forceClose = false) => {
    const isOpen = sidebar.classList.contains("mobile-open");
    if (forceClose || isOpen) {
      sidebar.classList.remove("mobile-open");
      sidebarBackdrop.classList.add("hidden");
    } else {
      sidebar.classList.add("mobile-open");
      sidebarBackdrop.classList.remove("hidden");
    }
  };

  const checkScreenSize = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      toggleMobileSidebar(true); // Ensure it's closed on resize
      sidebar.classList.remove("sidebar-collapsed", "w-20");
      sidebar.classList.add("w-64");
      sidebarToggleBtn.innerHTML = `<i data-lucide="menu" class="w-6 h-6"></i>`;
    } else {
      sidebarToggleBtn.innerHTML = `<i data-lucide="${
        appState.isSidebarCollapsed ? "panel-right-close" : "panel-left-close"
      }" class="w-6 h-6"></i>`;
    }
    lucide.createIcons();
  };

  function showShortcutsModal() {
    const term = getCurrentProfile().terminology;
    const shortcuts = [
      { scope: "Global", key: "⌘ / Ctrl + K", desc: "Open universal search" },
      { scope: "Global", key: "Alt + Q", desc: "Open AI Assistant" },
      { scope: "Global", key: "?", desc: "Show this shortcuts guide" },
      { scope: "Global", key: "Escape", desc: "Close modals & menus" },
      { scope: "Navigation", key: "Alt + D", desc: "Go to Dashboard" },
      { scope: "Navigation", key: "Alt + P", desc: "Go to POS Terminal" },
      { scope: "Navigation", key: "Alt + I", desc: "Go to Invoices" },
      { scope: "Navigation", key: "Alt + N", desc: `Go to ${term.inventory}` },
      { scope: "Navigation", key: "Alt + C", desc: "Go to Customers" },
      { scope: "Navigation", key: "Alt + R", desc: "Go to Reports" },
      { scope: "Navigation", key: "Alt + S", desc: "Go to Settings" },
      {
        scope: "POS Terminal",
        key: "F2 / Ctrl + I",
        desc: `Focus ${term.product} search`,
      },
      {
        scope: "POS Terminal",
        key: "F4 / Ctrl + P",
        desc: "Open Payment screen",
      },
      { scope: "POS Terminal", key: "Alt + A", desc: "Add Customer to sale" },
      { scope: "POS Terminal", key: "Alt + N", desc: "Create a new sale tab" },
      { scope: "Forms", key: "⌘ / Ctrl + S", desc: "Save changes in forms" },
    ];

    const groupedShortcuts = shortcuts.reduce((acc, s) => {
      (acc[s.scope] = acc[s.scope] || []).push(s);
      return acc;
    }, {});

    let content = Object.entries(groupedShortcuts)
      .map(
        ([scope, list]) => `
            <h4 class="font-semibold text-text-primary mt-4 mb-2 text-lg">${scope}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                ${list
                  .map(
                    (s) => `
                    <div class="flex justify-between items-center py-1">
                        <span class="text-text-secondary">${s.desc}</span>
                        <kbd class="font-sans text-xs border border-border-color-strong rounded px-2 py-1 bg-bg-tertiary text-text-primary">${s.key}</kbd>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `
      )
      .join("");

    showModal(
      "Keyboard Shortcuts",
      content,
      `<button data-action="close-modal" class="btn btn-secondary">Close</button>`,
      { size: "max-w-3xl" }
    );
  }

  // --- GLOBAL EVENT LISTENERS ---
  sidebarToggleBtn.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      toggleMobileSidebar();
    } else {
      appState.isSidebarCollapsed = !appState.isSidebarCollapsed;
      sidebar.classList.toggle("w-64", !appState.isSidebarCollapsed);
      sidebar.classList.toggle("w-20", appState.isSidebarCollapsed);
      sidebar.classList.toggle(
        "sidebar-collapsed",
        appState.isSidebarCollapsed
      );
      sidebarToggleBtn.innerHTML = `<i data-lucide="${
        appState.isSidebarCollapsed ? "panel-right-close" : "panel-left-close"
      }" class="w-6 h-6"></i>`;
      lucide.createIcons();
    }
  });

  sidebarBackdrop.addEventListener("click", () => toggleMobileSidebar(true));

  document.getElementById("main-nav").addEventListener("click", (e) => {
    const viewTarget = e.target.closest("[data-view]");
    if (viewTarget) {
      e.preventDefault();
      openOrSwitchTab(viewTarget.dataset.view);
      if (window.innerWidth < 1024) {
        toggleMobileSidebar(true);
      }
    }
  });

  document.body.addEventListener("click", (e) => {
    // Close any open action menus if the click is outside of its parent container
    document.querySelectorAll(".action-menu.open").forEach((openMenu) => {
      if (!openMenu.parentElement.contains(e.target)) {
        openMenu.classList.remove("open");
      }
    });

    const actionTarget = e.target.closest("[data-action]");
    if (!actionTarget) return;

    // If an action is triggered from within a menu, stop it from bubbling to the parent row
    if (actionTarget.closest(".action-menu")) {
      e.stopPropagation();
    }

    const action = actionTarget.dataset.action;
    const targetId = actionTarget.dataset.id;
    const currentViewPane = workspaceContent.querySelector(".view-pane");

    if (action === "show-shortcuts") {
      showShortcutsModal();
    }

    // --- Main Tab Actions ---
    if (action === "switch-tab") {
      appState.activeTabId = targetId;
      renderApp();
    }
    if (action === "close-tab") {
      e.stopPropagation();
      const tabIdToClose = targetId;
      const tabIndex = appState.tabs.findIndex((t) => t.id === tabIdToClose);
      appState.tabs.splice(tabIndex, 1);
      if (appState.activeTabId === tabIdToClose) {
        const newActiveTab =
          appState.tabs[tabIndex] || appState.tabs[tabIndex - 1];
        appState.activeTabId = newActiveTab ? newActiveTab.id : null;
      }
      renderApp();
    }

    // --- POS Actions ---
    const activeTab = appState.tabs.find((t) => t.id === appState.activeTabId);
    if (activeTab?.viewType === "pos") {
      const activeSale = posState.sales.find(
        (s) => s.id === posState.activeSaleId
      );
      switch (action) {
        case "new-sale": {
          const newSaleId = `sale_${Date.now()}`;
          posState.sales.push({
            id: newSaleId,
            name: `Sale ${posState.saleCounter++}`,
            cart: [],
            customer: null,
            status: "active",
          });
          posState.activeSaleId = newSaleId;
          posFullRender(currentViewPane);
          currentViewPane
            .querySelector("#pos-tabs-container")
            .scrollTo({ left: 9999, behavior: "smooth" });
          break;
        }
        case "switch-sale": {
          posState.activeSaleId = targetId;
          const switchedToSale = posState.sales.find((s) => s.id === targetId);
          if (switchedToSale && switchedToSale.status === "held") {
            switchedToSale.status = "active";
          }
          posFullRender(currentViewPane);
          break;
        }
        case "close-sale": {
          e.stopPropagation();
          const saleIdToClose = targetId;
          const sale = posState.sales.find((s) => s.id === saleIdToClose);
          if (sale?.cart.length > 0 && sale.status !== "held") {
            const confirmModal = showModal(
              "Unsaved Sale",
              "This sale has items in it. Are you sure you want to close and discard it?",
              `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button id="confirm-close-sale" class="btn btn-danger">Discard Sale</button>`
            );
            confirmModal
              .querySelector("#confirm-close-sale")
              .addEventListener("click", () => {
                posState.sales = posState.sales.filter(
                  (s) => s.id !== saleIdToClose
                );
                if (posState.activeSaleId === saleIdToClose)
                  posState.activeSaleId =
                    posState.sales.length > 0 ? posState.sales[0].id : null;
                posFullRender(currentViewPane);
                closeModal(confirmModal);
              });
          } else {
            posState.sales = posState.sales.filter(
              (s) => s.id !== saleIdToClose
            );
            if (posState.activeSaleId === saleIdToClose)
              posState.activeSaleId =
                posState.sales.length > 0 ? posState.sales[0].id : null;
            posFullRender(currentViewPane);
          }
          break;
        }
        case "hold-sale": {
          if (!activeSale || activeSale.cart.length === 0) {
            showToast("Cannot hold an empty sale.", "warning");
            return;
          }
          const heldSaleName = activeSale.name;
          activeSale.status = "held";
          let nextActiveSale = posState.sales.find(
            (s) => s.status !== "held" && s.id !== activeSale.id
          );
          if (nextActiveSale) {
            posState.activeSaleId = nextActiveSale.id;
          } else {
            const newSaleId = `sale_${Date.now()}`;
            posState.sales.push({
              id: newSaleId,
              name: `Sale ${posState.saleCounter++}`,
              cart: [],
              customer: null,
              status: "active",
            });
            posState.activeSaleId = newSaleId;
          }
          posFullRender(currentViewPane);
          showToast(`Sale "${heldSaleName}" is on hold.`, "info");
          break;
        }
        case "cancel-sale": {
          if (!activeSale || activeSale.cart.length === 0) {
            showToast("Cart is already empty.", "info");
            return;
          }
          const modal = showModal(
            "Cancel Sale",
            "<p>Are you sure you want to clear all items from this sale? This action cannot be undone.</p>",
            `<button data-action="close-modal" class="btn btn-secondary">Keep Sale</button><button id="confirm-cancel" class="btn btn-danger">Yes, Cancel It</button>`
          );
          modal
            .querySelector("#confirm-cancel")
            .addEventListener("click", () => {
              activeSale.cart = [];
              activeSale.customer = null;
              posFullRender(currentViewPane);
              showToast("Sale has been cancelled.", "success");
              closeModal(modal);
            });
          break;
        }
        case "increment-qty": {
          e.stopPropagation();
          if (activeSale) {
            const item = activeSale.cart.find((i) => i.id === targetId);
            if (item) {
              if (item.stock === Infinity || item.qty < item.stock) {
                item.qty++;
              } else {
                showToast(`No more stock for ${item.name}.`, "warning");
              }
              posFullRender(currentViewPane);
            }
          }
          break;
        }
        case "decrement-qty": {
          e.stopPropagation();
          if (activeSale) {
            const item = activeSale.cart.find((i) => i.id === targetId);
            if (item && item.qty > 1) {
              item.qty--;
              posFullRender(currentViewPane);
            }
          }
          break;
        }
        case "remove-from-cart": {
          if (activeSale) {
            e.stopPropagation();
            activeSale.cart = activeSale.cart.filter(
              (item) => item.id !== targetId
            );
            posFullRender(currentViewPane);
          }
          break;
        }
        case "edit-cart-item": {
          e.stopPropagation();
          if (activeSale) {
            openEditCartItemModal(targetId);
          }
          break;
        }
        case "process-payment": {
          if (!activeSale || activeSale.cart.length === 0) {
            showToast("Cart is empty!", "error");
            return;
          }

          const totalBase = activeSale.cart.reduce(
            (acc, item) => acc + item.price * item.qty,
            0
          );
          const totalCurrent = currencyUtils.convert(totalBase);

          const getSmartSuggestions = (totalDue) => {
            const suggestions = new Set();
            if (totalDue > 1 && totalDue % 1 !== 0)
              suggestions.add(Math.ceil(totalDue));
            const denominations = [10, 20, 50, 100, 500, 1000, 5000, 10000];
            denominations.forEach((d) => {
              if (totalDue < d * 4 && totalDue > d / 10) {
                const rounded = Math.ceil(totalDue / d) * d;
                if (rounded > totalDue) suggestions.add(rounded);
              }
            });
            let finalSuggestions = [...suggestions].sort((a, b) => a - b);
            if (finalSuggestions.length < 3) {
              let lastNum = Math.max(totalDue, ...finalSuggestions);
              while (finalSuggestions.length < 3 && lastNum < totalDue * 5) {
                const magnitude = Math.pow(10, Math.floor(Math.log10(lastNum)));
                lastNum =
                  Math.ceil((lastNum + 1) / (magnitude / 2)) * (magnitude / 2);
                if (!finalSuggestions.includes(lastNum))
                  finalSuggestions.push(lastNum);
              }
            }
            return [...new Set(finalSuggestions)].slice(0, 3);
          };

          const quickCashButtons = [
            ...getSmartSuggestions(totalCurrent),
            "Exact",
          ];

          // --- Advanced Payment Modal Logic ---
          const paymentState = {
            total: totalCurrent,
            payments: [],
            activePaymentMethod: "Cash",
            userInputStarted: false,
            get totalPaid() {
              return this.payments.reduce((sum, p) => sum + p.amount, 0);
            },
            get remaining() {
              return this.total - this.totalPaid;
            },
          };

          const getPaymentIcons = (method) =>
            ({ Cash: "dollar-sign", Card: "credit-card", "QR Code": "qr-code" }[
              method
            ]);

          const content = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 -m-6 p-0">
                        <!-- Left Side: Keypad & Info -->
                        <div class="bg-[var(--bg-secondary)]/50 p-6 rounded-l-xl flex flex-col">
                            <div class="flex-1 space-y-4">
                                <p class="text-text-secondary">Total Due</p>
                                <p class="text-6xl font-bold text-text-primary font-mono tracking-tighter">${currencyUtils.format(
                                  totalBase,
                                  appState.currentCurrency,
                                  { currencyDisplay: "symbol" }
                                )}</p>
                                <div id="payment-status-display" class="h-16"></div>
                                <div class="space-y-2 pt-2" id="payment-splits-container"></div>
                            </div>
                            <div class="grid grid-cols-4 gap-2">
                                ${quickCashButtons
                                  .map((val) => {
                                    const amount =
                                      val === "Exact"
                                        ? totalCurrent.toFixed(2)
                                        : val.toFixed(2);
                                    // To format the display, convert the suggested amount (in current currency) back to base currency
                                    const amountInBase =
                                      val === "Exact"
                                        ? totalCurrent /
                                          currencyUtils.get().rate
                                        : val / currencyUtils.get().rate;
                                    const display =
                                      val === "Exact"
                                        ? "Exact"
                                        : currencyUtils.format(
                                            amountInBase,
                                            appState.currentCurrency,
                                            {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 0,
                                            }
                                          );
                                    return `<button data-payment-action="quick-cash" data-amount="${amount}" class="keypad-btn rounded-md h-14 text-lg font-semibold">${display}</button>`;
                                  })
                                  .join("")}
                            </div>
                        </div>
                        <!-- Right Side: Actions -->
                        <div class="p-6 flex flex-col">
                            <div class="grid grid-cols-3 gap-3 mb-4">
                                <button data-payment-action="set-method" data-method="Cash" class="payment-method-btn btn btn-secondary h-16 flex-col gap-1 active"><i data-lucide="dollar-sign" class="w-6 h-6"></i>Cash</button>
                                <button data-payment-action="set-method" data-method="Card" class="payment-method-btn btn btn-secondary h-16 flex-col gap-1"><i data-lucide="credit-card" class="w-6 h-6"></i>Card</button>
                                <button data-payment-action="set-method" data-method="QR Code" class="payment-method-btn btn btn-secondary h-16 flex-col gap-1"><i data-lucide="qr-code" class="w-6 h-6"></i>QR</button>
                            </div>
                            <div class="relative mb-4">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono text-text-secondary">${
                                  currencyUtils.get().symbol
                                }</span>
                                <input type="text" id="payment-input" class="form-input w-full text-right text-4xl font-mono p-4 pr-6 bg-transparent" value="${paymentState.remaining.toFixed(
                                  2
                                )}" readonly>
                            </div>
                            <div class="grid grid-cols-3 gap-2 flex-1">
                                ${[
                                  "1",
                                  "2",
                                  "3",
                                  "4",
                                  "5",
                                  "6",
                                  "7",
                                  "8",
                                  "9",
                                  "00",
                                  "0",
                                  ".",
                                ]
                                  .map(
                                    (key) =>
                                      `<button data-payment-action="keypad" data-key="${key}" class="keypad-btn rounded-md text-2xl font-mono h-full">${key}</button>`
                                  )
                                  .join("")}
                                <button data-payment-action="keypad" data-key="del" class="keypad-btn rounded-md text-2xl font-mono h-full flex items-center justify-center"><i data-lucide="delete" class="w-6 h-6 pointer-events-none"></i></button>
                            </div>
                            <button id="add-payment-btn" data-payment-action="add-payment" class="btn btn-primary w-full mt-4 text-lg py-4">Add Payment</button>
                        </div>
                    </div>`;

          const footer = `<button data-action="close-modal" class="btn btn-secondary">Cancel Transaction</button><button id="finalize-payment" class="btn btn-success text-white" disabled><i data-lucide="check-circle" class="w-5 h-5 mr-2"></i>Finalize Payment</button>`;
          const modal = showModal("Process Payment", content, footer, {
            size: "max-w-4xl",
            customClasses: "p-0",
          });
          lucide.createIcons();

          const inputEl = modal.querySelector("#payment-input");
          const statusDisplay = modal.querySelector("#payment-status-display");
          const splitsContainer = modal.querySelector(
            "#payment-splits-container"
          );
          const addPaymentBtn = modal.querySelector("#add-payment-btn");
          const finalizeBtn = modal.querySelector("#finalize-payment");

          const renderPaymentState = () => {
            // Update input, rounding to avoid floating point issues
            const remainingValue = parseFloat(
              paymentState.remaining.toPrecision(15)
            );
            inputEl.value =
              remainingValue > 0 ? remainingValue.toFixed(2) : "0.00";
            const formattedRemaining = currencyUtils.format(
              remainingValue / currencyUtils.get().rate
            );
            const formattedChange = currencyUtils.format(
              Math.abs(remainingValue) / currencyUtils.get().rate
            );

            // Update status display
            if (remainingValue > 0.001) {
              statusDisplay.innerHTML = `<p class="text-text-secondary">Amount Remaining</p><p class="text-4xl font-bold text-danger font-mono tracking-tight">- ${formattedRemaining}</p>`;
              const inputValue = parseFloat(inputEl.value) || 0;
              addPaymentBtn.textContent = `Add ${
                currencyUtils.get().symbol
              }${inputValue.toFixed(2)} Payment`;
              addPaymentBtn.disabled = inputValue <= 0;
              finalizeBtn.disabled = true;
            } else {
              const change = Math.abs(remainingValue);
              statusDisplay.innerHTML = `<p class="text-text-secondary">Change Due</p><p class="text-4xl font-bold text-success font-mono tracking-tight">${formattedChange}</p>`;
              addPaymentBtn.textContent = "Add Payment";
              addPaymentBtn.disabled = true;
              finalizeBtn.disabled = false;
            }

            // Update splits
            splitsContainer.innerHTML = paymentState.payments
              .map(
                (p, i) => `
                            <div class="payment-split-item flex items-center justify-between p-2 bg-bg-tertiary rounded-md text-sm">
                                <div class="flex items-center gap-2"><i data-lucide="${getPaymentIcons(
                                  p.method
                                )}" class="w-4 h-4 text-accent"></i><span>${
                  p.method
                } Payment</span></div>
                                <div class="flex items-center gap-2"><span class="font-mono text-text-primary font-medium">${
                                  currencyUtils.get().symbol
                                }${p.amount.toFixed(
                  2
                )}</span><button data-payment-action="remove-split" data-index="${i}" class="text-danger/70 hover:text-danger"><i data-lucide="x" class="w-4 h-4"></i></button></div>
                            </div>
                        `
              )
              .join("");
            lucide.createIcons();
            // After rendering, reset the input flag so the next keypad press clears the default value.
            paymentState.userInputStarted = false;
          };

          modal.addEventListener("click", (e) => {
            const target = e.target.closest("[data-payment-action]");
            if (!target) return;
            const {
              paymentAction,
              method,
              amount,
              key,
              index,
            } = target.dataset;

            switch (paymentAction) {
              case "set-method":
                paymentState.activePaymentMethod = method;
                modal
                  .querySelectorAll(".payment-method-btn")
                  .forEach((btn) => btn.classList.remove("active"));
                target.classList.add("active");
                break;
              case "quick-cash":
                inputEl.value = parseFloat(amount).toFixed(2);
                paymentState.userInputStarted = true; // Set flag as this is an input
                paymentState.activePaymentMethod = "Cash";
                modal
                  .querySelectorAll(".payment-method-btn")
                  .forEach((btn) =>
                    btn.classList.toggle(
                      "active",
                      btn.dataset.method === "Cash"
                    )
                  );
                document.getElementById("add-payment-btn").click();
                break;
              case "keypad": {
                let currentVal = inputEl.value;
                // On first key press, clear the existing amount and start fresh
                if (!paymentState.userInputStarted) {
                  currentVal = "0";
                  paymentState.userInputStarted = true;
                }

                if (key === "del") {
                  currentVal = currentVal.slice(0, -1) || "0";
                } else if (key === "." && !currentVal.includes(".")) {
                  currentVal += ".";
                } else if (key === "00" && currentVal !== "0") {
                  currentVal += "00";
                } else if (!isNaN(parseInt(key))) {
                  // handles '1' through '9' and '0'
                  if (currentVal === "0" && key !== ".") {
                    currentVal = key;
                  } else {
                    // Prevent excessive length
                    if (currentVal.length < 12) currentVal += key;
                  }
                }
                inputEl.value = currentVal;
                break;
              }
              case "add-payment": {
                const paymentAmount = parseFloat(inputEl.value);
                if (paymentAmount > 0) {
                  paymentState.payments.push({
                    method: paymentState.activePaymentMethod,
                    amount: paymentAmount,
                    ref:
                      paymentState.activePaymentMethod !== "Cash"
                        ? `TRX_${Date.now()}`
                        : null,
                  });
                  renderPaymentState();
                }
                break;
              }
              case "remove-split":
                paymentState.payments.splice(parseInt(index), 1);
                renderPaymentState();
                break;
            }
            // Update button state after keypad press or method change
            if (paymentAction === "keypad" || paymentAction === "set-method") {
              const inputValue = parseFloat(inputEl.value) || 0;
              if (paymentState.remaining > 0.001) {
                addPaymentBtn.textContent = `Add ${
                  currencyUtils.get().symbol
                }${inputValue.toFixed(2)} Payment`;
                addPaymentBtn.disabled = inputValue <= 0;
              }
            }
          });

          inputEl.addEventListener("input", () => {
            // This is a fallback for manual input if readonly is removed, but mainly to keep state consistent.
            const inputValue = parseFloat(inputEl.value) || 0;
            if (paymentState.remaining > 0.001) {
              addPaymentBtn.textContent = `Add ${
                currencyUtils.get().symbol
              }${inputValue.toFixed(2)} Payment`;
              addPaymentBtn.disabled = inputValue <= 0;
            }
          });

          finalizeBtn.addEventListener("click", () => {
            // 1. Update stock and sales figures
            activeSale.cart.forEach((cartItem) => {
              const product = mockDB.products.find((p) => p.id === cartItem.id);
              if (product && product.productType === "physical") {
                if (product.isSerialized) {
                  product.serials = product.serials.filter(
                    (sn) => sn !== cartItem.serialNumber
                  );
                  product.stock = product.serials.length;
                } else {
                  product.stock -= cartItem.qty;
                }
                product.sales += cartItem.qty;
              } else if (product && product.productType === "service") {
                product.sales += 1;
              }
            });

            // 2. Award loyalty points
            const customer = activeSale.customer
              ? mockDB.customers.find((c) => c.id === activeSale.customer.id)
              : null;
            const pointsEarned = Math.floor(totalBase);
            if (customer) customer.loyaltyPoints += pointsEarned;

            // 3. Create invoice
            const newInvoice = {
              id: `INV${Date.now().toString().slice(-4)}`,
              customerId: customer?.id,
              customerName: customer?.name || "Walk-in Customer",
              customer,
              total: totalCurrent, // Total in the transaction currency
              totalInBaseCurrency: totalBase, // Total in base currency
              currency: appState.currentCurrency,
              exchangeRate: currencyUtils.get().rate,
              status: "Paid",
              date: new Date().toISOString(),
              items: activeSale.cart,
              paymentDetails: paymentState.payments,
              cashier: appState.session.cashier,
              storeId: appState.session.storeId,
              pointsEarned,
            };
            mockDB.invoices.push(newInvoice);

            closeModal(modal);
            showReceipt(newInvoice, paymentState);

            posState.sales = posState.sales.filter(
              (s) => s.id !== activeSale.id
            );
            if (posState.activeSaleId === activeSale.id) {
              const nextSale =
                posState.sales.find((s) => s.status !== "held") ||
                posState.sales[0] ||
                null;
              posState.activeSaleId = nextSale ? nextSale.id : null;
              if (!posState.activeSaleId && posState.sales.length === 0) {
                const newSaleId = `sale_${Date.now()}`;
                posState.sales.push({
                  id: newSaleId,
                  name: `Sale ${posState.saleCounter++}`,
                  cart: [],
                  customer: null,
                  status: "active",
                });
                posState.activeSaleId = newSaleId;
              }
            }
            posFullRender(currentViewPane);
          });

          renderPaymentState();
          break;
        }
        case "add-customer-to-sale": {
          if (!activeSale) {
            showToast("No active sale", "error");
            return;
          }
          let content = `
                        <input type="text" id="customer-search" placeholder="Search by name, phone, or email..." class="form-input w-full mb-4">
                        <div id="customer-list" class="space-y-2 max-h-60 overflow-y-auto"></div>
                        <div class="text-center pt-4 border-t border-border-color mt-4">
                            <button id="create-new-customer-btn" class="btn btn-secondary w-full">
                                <i data-lucide="user-plus" class="w-4 h-4 mr-2"></i>Create New Customer
                            </button>
                        </div>
                    `;
          const modal = showModal("Select Customer", content, "");
          lucide.createIcons();
          const customerListEl = modal.querySelector("#customer-list");

          const renderCustomerList = (filter = "") => {
            const query = filter.toLowerCase();
            const filteredCustomers = mockDB.customers.filter(
              (c) =>
                c.name.toLowerCase().includes(query) ||
                c.phone.includes(query) ||
                c.email.toLowerCase().includes(query)
            );
            customerListEl.innerHTML =
              filteredCustomers.length > 0
                ? filteredCustomers
                    .map(
                      (c) =>
                        `<div data-action="select-customer" data-id="${c.id}" class="p-3 rounded-lg hover:bg-bg-tertiary cursor-pointer"><p class="font-medium text-text-primary">${c.name}</p><p class="text-sm">${c.phone}</p></div>`
                    )
                    .join("")
                : '<p class="text-center text-sm p-4">No customers found.</p>';
          };

          modal
            .querySelector("#customer-search")
            .addEventListener("input", (e) =>
              renderCustomerList(e.target.value)
            );

          customerListEl.addEventListener("click", (e) => {
            const customerTarget = e.target.closest(
              '[data-action="select-customer"]'
            );
            if (customerTarget) {
              const customer = mockDB.customers.find(
                (c) => c.id === customerTarget.dataset.id
              );
              activeSale.customer = customer;
              activeSale.status = "active"; // Reactivate if held
              posFullRender(currentViewPane);
              closeModal(modal);
            }
          });

          modal
            .querySelector("#create-new-customer-btn")
            .addEventListener("click", () => {
              closeModal(modal);
              openCustomerModal(null, (newCustomer) => {
                if (activeSale && newCustomer) {
                  activeSale.customer = newCustomer;
                  posFullRender(currentViewPane);
                }
              });
            });

          renderCustomerList();
          break;
        }
        case "remove-customer-from-sale": {
          if (activeSale) activeSale.customer = null;
          posFullRender(currentViewPane);
          break;
        }
      }
    }

    // --- Universal Actions ---
    if (action === "close-modal") {
      closeModal(actionTarget.closest(".modal-overlay"));
    }
    if (action === "set-currency") {
      appState.currentCurrency = actionTarget.dataset.currencyCode;
      renderApp();
    }

    if (action === "toggle-action-menu") {
      e.stopPropagation(); // Prevent body listener from closing it immediately
      const menu = actionTarget.nextElementSibling;
      if (!menu || !menu.classList.contains("action-menu")) return;

      const isCurrentlyOpen = menu.classList.contains("open");

      // Close all other menus before opening a new one
      document.querySelectorAll(".action-menu.open").forEach((m) => {
        if (m !== menu) m.classList.remove("open", "open-up");
      });

      if (!isCurrentlyOpen) {
        // Position menu before opening it
        const rect = actionTarget.getBoundingClientRect();
        const menuHeight = menu.offsetHeight > 0 ? menu.offsetHeight : 220; // Estimate height if needed
        if (rect.bottom + menuHeight > window.innerHeight) {
          menu.classList.add("open-up");
        } else {
          menu.classList.remove("open-up");
        }
        menu.classList.add("open");
      } else {
        menu.classList.remove("open", "open-up");
      }
    }

    if (action === "show-full-stat") {
      const label = actionTarget.dataset.label;
      const fullValue = actionTarget.dataset.fullValue;
      const content = `<p class="text-center text-5xl font-bold font-mono text-text-primary tracking-tight">${fullValue}</p>`;
      showModal(
        label,
        content,
        `<button data-action="close-modal" class="btn btn-secondary">Close</button>`,
        { size: "max-w-md" }
      );
    }

    if (action === "set-dashboard-period") {
      // This is handled inside initDashboard to avoid re-initializing everything
    }

    if (action === "delete-product") {
      const productIdToDelete = targetId;
      const productToDelete = mockDB.products.find(
        (p) => p.id === productIdToDelete
      );
      if (!productToDelete) return;

      const modal = showModal(
        "Confirm Deletion",
        `<p>Are you sure you want to permanently delete <strong>${productToDelete.name}</strong>? This action cannot be undone.</p>`,
        `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button id="confirm-delete-product" class="btn btn-danger">Delete</button>`
      );

      modal
        .querySelector("#confirm-delete-product")
        .addEventListener("click", () => {
          mockDB.products = mockDB.products.filter(
            (p) => p.id !== productIdToDelete
          );
          if (
            appState.tabs.find((t) => t.id === appState.activeTabId)
              ?.viewType === "inventory"
          ) {
            initInventory(
              workspaceContent.querySelector("#inventory-view-container")
            );
          }
          showToast(
            `Product "${productToDelete.name}" has been deleted.`,
            "success"
          );
          closeModal(modal);
        });
    }

    if (action === "adjust-stock") {
      showToast("Stock adjustment feature coming soon!", "info");
    }
    if (action === "create-po") {
      showToast("Purchase order creation coming soon!", "info");
    }

    if (action === "add-product" || action === "edit-product") {
      // Prevent detail view from opening when clicking edit button
      e.stopPropagation();
      const productId = targetId;
      const product = productId
        ? mockDB.products.find((p) => p.id === productId)
        : {};
      const isEditing = !!productId;
      openProductFormModal(isEditing, product);
    }

    if (action === "view-product-details") {
      const container = currentViewPane.querySelector(
        "#inventory-view-container"
      );
      if (container) renderProductDetailView(targetId, container);
    }

    if (
      action === "add-customer" ||
      (action === "edit-customer" && e.target.closest("button"))
    ) {
      e.stopPropagation();
      const customerId = targetId;
      openCustomerModal(customerId);
    }

    if (action === "view-invoice") {
      const invoiceId = targetId;
      const invoice = mockDB.invoices.find((i) => i.id === invoiceId);
      if (!invoice) return;
      // Enrich invoice with full customer details if they exist
      if (invoice.customerId) {
        invoice.customer = mockDB.customers.find(
          (c) => c.id === invoice.customerId
        );
      }
      showReceipt(invoice);
    }

    if (action === "open-search") {
      const term = getCurrentProfile().terminology;
      const content = `<div class="relative"><i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary"></i><input type="text" id="global-search-input" placeholder="Search ${term.product}s, customers, invoices..." class="w-full form-input pl-12 p-3 text-lg" autocomplete="off"></div><div id="global-search-results" class="mt-2 -mx-6 -mb-6 px-4 pb-4 text-sm max-h-[60vh] overflow-y-auto bg-[var(--bg-secondary)] rounded-b-xl"></div>`;
      const modal = showModal("Search", content, "", {
        size: "max-w-2xl",
        customClasses: "p-0",
      });
      const input = modal.querySelector("#global-search-input");
      const resultsEl = modal.querySelector("#global-search-results");
      let activeIndex = -1;

      const executeNavigation = (item) => {
        if (!item) return;
        const { type, id } = item.dataset;
        openOrSwitchTab(type);

        setTimeout(() => {
          if (type === "inventory")
            document
              .querySelector(
                `button[data-action="edit-product"][data-id="${id}"]`
              )
              .click();
          else if (type === "customers")
            document
              .querySelector(
                `button[data-action="edit-customer"][data-id="${id}"]`
              )
              .click();
          else if (type === "invoices")
            document
              .querySelector(
                `button[data-action="view-invoice"][data-id="${id}"]`
              )
              .click();
        }, 100);

        closeModal(modal);
      };

      const updateActive = (newIndex) => {
        const items = resultsEl.querySelectorAll(".search-result-item");
        if (activeIndex > -1 && items[activeIndex])
          items[activeIndex].classList.remove("active");
        if (newIndex > -1 && items[newIndex]) {
          items[newIndex].classList.add("active");
          items[newIndex].scrollIntoView({ block: "nearest" });
        }
        activeIndex = newIndex;
      };

      input.focus();
      input.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        activeIndex = -1;
        if (query.length < 1) {
          resultsEl.innerHTML =
            '<p class="text-center text-text-secondary py-8">Start typing to see results.</p>';
          return;
        }

        const productResults = mockDB.products.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.id.toLowerCase().includes(query)
        );
        const customerResults = mockDB.customers.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.email.toLowerCase().includes(query)
        );
        const invoiceResults = mockDB.invoices.filter(
          (i) =>
            i.id.toLowerCase().includes(query) ||
            i.customerName.toLowerCase().includes(query)
        );

        let html = "";
        if (productResults.length > 0)
          html +=
            `<h4 class="font-semibold text-text-primary mb-1 mt-2 px-4">${term.product}s</h4>` +
            productResults
              .map(
                (p) =>
                  `<a href="#" class="search-result-item flex items-center gap-4 p-3 mx-2 rounded-lg" data-type="inventory" data-id="${p.id}"><i data-lucide="box" class="w-5 h-5 text-text-secondary"></i><div><strong>${p.name}</strong> <span class="text-xs font-mono text-text-secondary">${p.id}</span></div></a>`
              )
              .join("");
        if (customerResults.length > 0)
          html +=
            `<h4 class="font-semibold text-text-primary mb-1 mt-2 px-4">Customers</h4>` +
            customerResults
              .map(
                (c) =>
                  `<a href="#" class="search-result-item flex items-center gap-4 p-3 mx-2 rounded-lg" data-type="customers" data-id="${c.id}"><i data-lucide="user" class="w-5 h-5 text-text-secondary"></i><div><strong>${c.name}</strong> <span class="text-xs text-text-secondary">${c.phone}</span></div></a>`
              )
              .join("");
        if (invoiceResults.length > 0)
          html +=
            `<h4 class="font-semibold text-text-primary mb-1 mt-2 px-4">Invoices</h4>` +
            invoiceResults
              .map(
                (i) =>
                  `<a href="#" class="search-result-item flex items-center gap-4 p-3 mx-2 rounded-lg" data-type="invoices" data-id="${i.id}"><i data-lucide="file-text" class="w-5 h-5 text-text-secondary"></i><div><strong>${i.id}</strong> <span class="text-xs text-text-secondary">for ${i.customerName}</span></div></a>`
              )
              .join("");
        resultsEl.innerHTML =
          html ||
          '<p class="text-center text-text-secondary py-8">No results found.</p>';
        lucide.createIcons();
      });

      resultsEl.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target.closest(".search-result-item");
        if (target) executeNavigation(target);
      });

      input.addEventListener("keydown", (e) => {
        const items = resultsEl.querySelectorAll(".search-result-item");
        if (items.length === 0) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          updateActive(activeIndex < items.length - 1 ? activeIndex + 1 : 0);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          updateActive(activeIndex > 0 ? activeIndex - 1 : items.length - 1);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const activeItem = resultsEl.querySelector(
            ".search-result-item.active"
          );
          if (activeItem) executeNavigation(activeItem);
        }
      });
    }

    if (action === "open-notifications") {
      const icons = { stock: "box", info: "info", sale: "dollar-sign" };
      const content = mockDB.notifications
        .map(
          (n) => `
                <div class="flex gap-4 items-start p-3 border-b border-border-color last:border-b-0 ${
                  n.read ? "opacity-60" : ""
                }">
                    <i data-lucide="${
                      icons[n.type]
                    }" class="w-5 h-5 mt-1 text-text-secondary"></i>
                    <div class="flex-1">
                        <p class="text-text-primary text-sm">${n.message}</p>
                        <p class="text-xs text-text-secondary mt-1">${
                          n.date
                        }</p>
                    </div>
                    ${
                      !n.read
                        ? '<div class="w-2 h-2 bg-accent rounded-full mt-2 shrink-0"></div>'
                        : ""
                    }
                </div>`
        )
        .join("");
      const footer = `<button id="mark-all-read" class="btn btn-secondary text-sm py-2 px-3">Mark all as read</button>`;
      const modal = showModal(
        "Notifications",
        `<div class="max-h-96 overflow-y-auto -mx-6">${content}</div>`,
        footer,
        { customClasses: "p-0" }
      );
      modal.querySelector("#mark-all-read").addEventListener("click", () => {
        mockDB.notifications.forEach((n) => (n.read = true));
        closeModal(modal);
        showToast("All notifications marked as read.");
      });
    }

    if (action === "delete-customer") {
      const customerId = targetId;
      const customer = mockDB.customers.find((c) => c.id === customerId);
      if (!customer) return;
      const modal = showModal(
        "Delete Customer",
        `<p>Are you sure you want to delete <strong>${customer.name}</strong>? This will not affect past invoices, but the customer will be removed from the database.</p>`,
        `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button id="confirm-delete" class="btn btn-danger">Delete</button>`
      );
      modal.querySelector("#confirm-delete").addEventListener("click", () => {
        mockDB.customers = mockDB.customers.filter((c) => c.id !== customerId);
        if (activeTab?.viewType === "customers") renderApp();
        showToast(`Customer "${customer.name}" deleted.`, "success");
        closeModal(modal);
      });
    }

    if (action === "view-customer-invoices") {
      const customerId = targetId;
      const customer = mockDB.customers.find((c) => c.id === customerId);
      if (!customer) return;
      const customerInvoices = mockDB.invoices
        .filter((inv) => inv.customerId === customerId)
        .reverse();
      let content = `<div class="space-y-2 max-h-96 overflow-y-auto">`;
      if (customerInvoices.length > 0) {
        content += customerInvoices
          .map(
            (inv) => `
                <div class="flex justify-between items-center p-3 bg-bg-tertiary rounded-lg">
                    <div>
                        <p class="font-medium text-text-primary font-mono">${
                          inv.id
                        }</p>
                        <p class="text-xs text-text-secondary">${new Date(
                          inv.date
                        ).toLocaleDateString()}</p>
                    </div>
                    <div class="text-right">
                         <p class="font-medium text-text-primary font-mono">${currencyUtils.format(
                           inv.totalInBaseCurrency,
                           inv.currency
                         )}</p>
                         <p class="text-xs text-text-secondary">${
                           inv.status
                         }</p>
                    </div>
                </div>`
          )
          .join("");
      } else {
        content += `<p class="text-center p-4">No invoices found for this customer.</p>`;
      }
      content += `</div>`;
      showModal(
        `Invoices for ${customer.name}`,
        content,
        `<button data-action="close-modal" class="btn btn-secondary">Close</button>`
      );
    }

    if (
      action === "print-invoice" ||
      action === "email-invoice" ||
      action === "delete-invoice"
    ) {
      const invoiceId = targetId;
      const invoice = mockDB.invoices.find((i) => i.id === invoiceId);
      if (!invoice) return;

      if (action === "print-invoice") {
        // Enrich invoice with full customer details if they exist for the receipt
        if (invoice.customerId) {
          invoice.customer = mockDB.customers.find(
            (c) => c.id === invoice.customerId
          );
        }
        showReceipt(invoice);
      }
      if (action === "email-invoice") {
        showToast(
          `Emailing invoice ${invoice.id} to ${invoice.customerName}.`,
          "info"
        );
      }
      if (action === "delete-invoice") {
        const modal = showModal(
          "Delete Invoice",
          `<p>Are you sure you want to delete invoice <strong>${invoice.id}</strong>? This action cannot be undone.</p>`,
          `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button id="confirm-delete" class="btn btn-danger">Delete</button>`
        );
        modal.querySelector("#confirm-delete").addEventListener("click", () => {
          mockDB.invoices = mockDB.invoices.filter((i) => i.id !== invoiceId);
          if (activeTab?.viewType === "invoices") renderApp();
          showToast(`Invoice ${invoice.id} deleted.`, "success");
          closeModal(modal);
        });
      }
    }

    if (action === "save-settings") {
      const settingsForm = document.getElementById("settings-form");
      const newDefaultCurrency = settingsForm.querySelector(
        '[name="defaultCurrency"]'
      ).value;
      const newStoreName = settingsForm.querySelector('[name="storeName"]')
        .value;
      const newStoreAddress = settingsForm.querySelector(
        '[name="storeAddress"]'
      ).value;

      appState.settings.defaultCurrency = newDefaultCurrency;
      storeInfo.defaultDisplayCurrency = newDefaultCurrency;
      storeInfo.name = newStoreName;
      storeInfo.address = newStoreAddress;

      // If user is not currently overriding, update the display
      appState.currentCurrency = newDefaultCurrency;

      renderApp();
      showToast("Settings saved successfully!", "success");
    }
  });

  const openCustomProfileModal = (profileId = null, isTemplate = false) => {
    const isEditing = profileId !== null && !isTemplate;

    const baseProfile = isTemplate
      ? businessProfiles[profileId]
      : isEditing
      ? appState.customProfiles[profileId]
      : {
          name: "New Custom Profile",
          icon: "box",
          terminology: {
            product: "Item",
            inventory: "Stock",
            category: "Type",
          },
          features: { serials: false, expiry: false, service: false },
          customFields: [],
        };

    // Deep copy to prevent mutation of original objects
    const currentProfile = JSON.parse(JSON.stringify(baseProfile));

    if (isTemplate) {
      currentProfile.name = `${currentProfile.name} (Custom)`;
    }

    let fieldsHTML = currentProfile.customFields
      .map(
        (field) => `
            <div class="custom-field-row flex items-center gap-2 p-2 bg-bg-tertiary rounded">
                <input type="text" value="${
                  field.label
                }" placeholder="Field Label" class="form-input p-2 flex-1 custom-field-label">
                <select class="form-select p-2 custom-field-type">
                    <option value="text" ${
                      field.type === "text" ? "selected" : ""
                    }>Text</option>
                    <option value="textarea" ${
                      field.type === "textarea" ? "selected" : ""
                    }>Text Area</option>
                    <option value="select" ${
                      field.type === "select" ? "selected" : ""
                    }>Select</option>
                    <option value="checkbox" ${
                      field.type === "checkbox" ? "selected" : ""
                    }>Checkbox</option>
                </select>
                 <input type="text" value="${
                   field.options?.join(",") || ""
                 }" placeholder="Options (comma-sep)" class="form-input p-2 flex-1 custom-field-options ${
          field.type !== "select" ? "hidden" : ""
        }">
                <button type="button" data-action="remove-custom-field" class="btn btn-danger p-2 h-auto"><i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i></button>
            </div>
        `
      )
      .join("");

    const content = `
            <form id="custom-profile-form" class="space-y-4">
                <div><label class="block text-sm font-medium mb-1">Profile Name</label><input type="text" name="name" value="${
                  currentProfile.name
                }" class="form-input w-full"></div>
                <h4 class="font-semibold text-text-primary pt-2 border-t border-border-color">Terminology</h4>
                <div class="grid grid-cols-3 gap-2">
                     <div><label class="block text-xs font-medium mb-1">Product</label><input type="text" name="term_product" value="${
                       currentProfile.terminology.product
                     }" class="form-input w-full p-2 text-sm"></div>
                     <div><label class="block text-xs font-medium mb-1">Inventory</label><input type="text" name="term_inventory" value="${
                       currentProfile.terminology.inventory
                     }" class="form-input w-full p-2 text-sm"></div>
                     <div><label class="block text-xs font-medium mb-1">Category</label><input type="text" name="term_category" value="${
                       currentProfile.terminology.category
                     }" class="form-input w-full p-2 text-sm"></div>
                </div>
                 <h4 class="font-semibold text-text-primary pt-2 border-t border-border-color">Features</h4>
                 <div class="grid grid-cols-3 gap-2 text-sm">
                    <div class="flex items-center"><input type="checkbox" id="feature_serials" name="feature_serials" class="h-4 w-4 rounded" ${
                      currentProfile.features.serials ? "checked" : ""
                    }><label for="feature_serials" class="ml-2">Serial Tracking</label></div>
                    <div class="flex items-center"><input type="checkbox" id="feature_expiry" name="feature_expiry" class="h-4 w-4 rounded" ${
                      currentProfile.features.expiry ? "checked" : ""
                    }><label for="feature_expiry" class="ml-2">Expiry Tracking</label></div>
                    <div class="flex items-center"><input type="checkbox" id="feature_service" name="feature_service" class="h-4 w-4 rounded" ${
                      currentProfile.features.service ? "checked" : ""
                    }><label for="feature_service" class="ml-2">Service Items</label></div>
                 </div>
                 <h4 class="font-semibold text-text-primary pt-2 border-t border-border-color">Custom Fields</h4>
                 <div id="custom-fields-container" class="space-y-2">${fieldsHTML}</div>
                 <button type="button" data-action="add-custom-field" class="btn btn-secondary text-sm w-full"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>Add Field</button>
            </form>
        `;
    const footer = `<button data-action="close-modal" class="btn btn-secondary">Cancel</button><button type="submit" form="custom-profile-form" class="btn btn-primary">Save Custom Profile</button>`;
    const modal = showModal("Customize Business Profile", content, footer, {
      size: "max-w-3xl",
    });
    lucide.createIcons();

    const fieldsContainer = modal.querySelector("#custom-fields-container");

    modal.addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;

      if (target.dataset.action === "add-custom-field") {
        const newField = document.createElement("div");
        newField.className =
          "custom-field-row flex items-center gap-2 p-2 bg-bg-tertiary rounded";
        newField.innerHTML = `
                    <input type="text" placeholder="Field Label" class="form-input p-2 flex-1 custom-field-label">
                    <select class="form-select p-2 custom-field-type">
                        <option value="text">Text</option>
                        <option value="textarea">Text Area</option>
                        <option value="select">Select</option>
                        <option value="checkbox">Checkbox</option>
                    </select>
                    <input type="text" placeholder="Options (comma-sep)" class="form-input p-2 flex-1 custom-field-options hidden">
                    <button type="button" data-action="remove-custom-field" class="btn btn-danger p-2 h-auto"><i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i></button>
                `;
        fieldsContainer.appendChild(newField);
        lucide.createIcons();
      }
      if (target.dataset.action === "remove-custom-field") {
        target.closest(".custom-field-row").remove();
      }
    });

    modal.addEventListener("change", (e) => {
      if (e.target.classList.contains("custom-field-type")) {
        const optionsInput = e.target.parentElement.querySelector(
          ".custom-field-options"
        );
        optionsInput.classList.toggle("hidden", e.target.value !== "select");
      }
    });

    modal
      .querySelector("#custom-profile-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProfile = {
          name: formData.get("name"),
          icon: "settings-2",
          terminology: {
            product: formData.get("term_product"),
            inventory: formData.get("term_inventory"),
            category: formData.get("term_category"),
          },
          features: {
            serials: formData.has("feature_serials"),
            expiry: formData.has("feature_expiry"),
            service: formData.has("feature_service"),
          },
          customFields: [],
        };

        fieldsContainer.querySelectorAll(".custom-field-row").forEach((row) => {
          const label = row.querySelector(".custom-field-label").value;
          const type = row.querySelector(".custom-field-type").value;
          if (label) {
            const field = {
              name: label.toLowerCase().replace(/\s+/g, ""),
              label,
              type,
            };
            if (type === "select") {
              field.options = row
                .querySelector(".custom-field-options")
                .value.split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
            newProfile.customFields.push(field);
          }
        });

        const newId = isEditing ? profileId : `custom_${Date.now()}`;
        appState.customProfiles[newId] = newProfile;
        appState.settings.businessType = newId;
        showToast("Custom profile saved and applied!", "success");
        closeModal(modal);
        renderApp();
      });
  };

  const openProductFormModal = (isEditing, product) => {
    const profile = getCurrentProfile();
    const term = profile.terminology;
    const features = profile.features;

    const uomOptions = mockDB.unitsOfMeasurement
      .map(
        (uom) =>
          `<option value="${uom.id}" ${
            product.uomId === uom.id ? "selected" : ""
          }>${uom.name}</option>`
      )
      .join("");

    let customFieldsHTML = "";
    if (profile.customFields && profile.customFields.length > 0) {
      customFieldsHTML +=
        '<div class="border-t border-border-color pt-4 mt-4 space-y-4">';
      profile.customFields.forEach((field) => {
        const value = product.customData
          ? product.customData[field.label] || ""
          : "";
        customFieldsHTML += "<div>";
        switch (field.type) {
          case "textarea":
            customFieldsHTML += `<label class="block text-sm font-medium text-text-secondary mb-1">${field.label}</label><textarea name="customData_${field.name}" class="form-textarea w-full">${value}</textarea>`;
            break;
          case "select":
            const options = field.options
              .map(
                (opt) =>
                  `<option value="${opt}" ${
                    value === opt ? "selected" : ""
                  }>${opt}</option>`
              )
              .join("");
            customFieldsHTML += `<label class="block text-sm font-medium text-text-secondary mb-1">${field.label}</label><select name="customData_${field.name}" class="form-select w-full">${options}</select>`;
            break;
          case "checkbox":
            customFieldsHTML += `<div class="flex items-center"><input type="checkbox" id="customData_${
              field.name
            }" name="customData_${field.name}" class="h-4 w-4 rounded" ${
              value ? "checked" : ""
            }><label for="customData_${field.name}" class="ml-2">${
              field.label
            }</label></div>`;
            break;
          default:
            // text
            customFieldsHTML += `<label class="block text-sm font-medium text-text-secondary mb-1">${
              field.label
            }</label><input type="text" name="customData_${
              field.name
            }" value="${value}" class="form-input w-full" placeholder="${
              field.placeholder || ""
            }">`;
        }
        customFieldsHTML += "</div>";
      });
      customFieldsHTML += "</div>";
    }

    const content = `
            <form id="product-form" class="space-y-4">
                <input type="hidden" name="id" value="${product.id || ""}">
                <div class="border-b border-border-color flex space-x-4">
                    <button type="button" data-tab="general" class="form-tab active px-1 py-3 text-sm font-medium">General</button>
                    <button type="button" data-tab="inventory" class="form-tab px-1 py-3 text-sm font-medium">${
                      term.inventory
                    }</button>
                    <button type="button" data-tab="pricing" class="form-tab px-1 py-3 text-sm font-medium">Pricing & Tax</button>
                </div>
                <div id="form-content" class="pt-4">
                    <!-- General Pane -->
                    <div class="form-pane active" data-pane="general">
                        <div class="space-y-4">
                            <div><label class="block text-sm font-medium text-text-secondary mb-1">${
                              term.product
                            } Name</label><input type="text" name="name" value="${
      product.name || ""
    }" class="w-full form-input" required></div>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="block text-sm font-medium text-text-secondary mb-1">SKU</label><input type="text" name="sku" value="${
                                  product.id ||
                                  `SKU${Date.now().toString().slice(-4)}`
                                }" class="w-full form-input bg-bg-tertiary" ${
      isEditing ? "readonly" : ""
    }></div>
                                <div><label class="block text-sm font-medium text-text-secondary mb-1">${
                                  term.category
                                }</label><input type="text" name="category" value="${
      product.category || ""
    }" class="w-full form-input"></div>
                            </div>
                            ${customFieldsHTML}
                        </div>
                    </div>
                    <!-- Inventory Pane -->
                    <div class="form-pane" data-pane="inventory">
                        <div class="space-y-4">
                             <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-text-secondary mb-1">${
                                      term.product
                                    } Type</label>
                                    <select name="productType" class="form-select w-full">
                                        <option value="physical" ${
                                          product.productType === "physical"
                                            ? "selected"
                                            : ""
                                        }>Physical</option>
                                        ${
                                          features.service
                                            ? `<option value="service" ${
                                                product.productType ===
                                                "service"
                                                  ? "selected"
                                                  : ""
                                              }>Service</option>`
                                            : ""
                                        }
                                    </select>
                                </div>
                                <div><label class="block text-sm font-medium text-text-secondary mb-1">Unit of Measure</label><select name="uomId" class="form-select w-full">${uomOptions}</select></div>
                            </div>
                            <div><label class="block text-sm font-medium text-text-secondary mb-1">Initial Stock</label><input type="number" name="stock" value="${
                              product.stock || ""
                            }" class="w-full form-input" required></div>
                            <div class="border-t border-border-color pt-4 mt-4 space-y-3">
                                ${
                                  features.serials
                                    ? `<div class="flex items-center"><input type="checkbox" id="isSerialized" name="isSerialized" class="h-4 w-4 rounded" ${
                                        product.isSerialized ? "checked" : ""
                                      }><label for="isSerialized" class="ml-2">Track by Serial Number</label></div>`
                                    : ""
                                }
                                <div id="serial-number-section" class="${
                                  product.isSerialized && features.serials
                                    ? ""
                                    : "hidden"
                                }"><label class="block text-sm font-medium text-text-secondary mb-1">Serial Numbers (one per line)</label><textarea name="serials" class="form-textarea w-full h-24 font-mono text-xs">${
      product.serials?.join("\\n") || ""
    }</textarea></div>
                                ${
                                  features.expiry
                                    ? `<div class="flex items-center"><input type="checkbox" id="hasExpiry" name="hasExpiry" class="h-4 w-4 rounded" ${
                                        product.hasExpiry ? "checked" : ""
                                      }><label for="hasExpiry" class="ml-2">Track by Expiry Date</label></div>`
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                    <!-- Pricing Pane -->
                    <div class="form-pane" data-pane="pricing">
                         <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-sm font-medium text-text-secondary mb-1">Cost Price (in ${
                              storeInfo.baseCurrency
                            })</label><input type="number" name="costPrice" step="0.01" value="${
      product.costPrice || ""
    }" class="w-full form-input"></div>
                            <div><label class="block text-sm font-medium text-text-secondary mb-1">Selling Price (in ${
                              storeInfo.baseCurrency
                            })</label><input type="number" name="price" step="0.01" value="${
      product.price || ""
    }" class="w-full form-input" required></div>
                         </div>
                         <div class="flex items-center mt-4"><input type="checkbox" id="taxable" name="taxable" class="h-4 w-4 rounded" ${
                           product.taxable !== false ? "checked" : ""
                         }><label for="taxable" class="ml-2">This item is taxable</label></div>
                    </div>
                </div>
            </form>`;
    const footer = `<button type="button" data-action="close-modal" class="btn btn-secondary">Cancel</button><button type="submit" form="product-form" class="btn btn-primary">${
      isEditing ? "Save Changes" : `Create ${term.product}`
    }</button>`;
    const modal = showModal(
      isEditing ? `Edit ${term.product}` : `Add New ${term.product}`,
      content,
      footer,
      { size: "max-w-3xl" }
    );

    // Tab switching logic for product modal
    const tabs = modal.querySelectorAll(".form-tab");
    const panes = modal.querySelectorAll(".form-pane");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        modal
          .querySelector(`.form-pane[data-pane="${tab.dataset.tab}"]`)
          .classList.add("active");
      });
    });

    // Conditional form fields logic
    const isSerializedCheckbox = modal.querySelector("#isSerialized");
    if (isSerializedCheckbox) {
      isSerializedCheckbox.addEventListener("change", (e) => {
        modal
          .querySelector("#serial-number-section")
          .classList.toggle("hidden", !e.target.checked);
      });
    }

    modal.querySelector("#product-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      const serialsText = formData.get("serials");
      const serialsArray = serialsText
        ? serialsText.split(/\\r?\\n/).filter(Boolean)
        : [];
      const newStock =
        serialsArray.length > 0
          ? serialsArray.length
          : parseInt(formData.get("stock"));

      const customData = {};
      profile.customFields.forEach((field) => {
        const formName = `customData_${field.name}`;
        customData[field.label] =
          field.type === "checkbox"
            ? formData.has(formName)
            : formData.get(formName);
      });

      const newProductData = {
        id: formData.get("sku"),
        name: formData.get("name"),
        category: formData.get("category"),
        price: parseFloat(formData.get("price")),
        costPrice: parseFloat(formData.get("costPrice")),
        stock: newStock,
        productType: formData.get("productType"),
        uomId: formData.get("uomId"),
        isSerialized: formData.has("isSerialized"),
        serials: serialsArray,
        hasExpiry: formData.has("hasExpiry"),
        taxable: formData.has("taxable"),
        customData,
      };

      if (isEditing) {
        const index = mockDB.products.findIndex((p) => p.id === product.id);
        mockDB.products[index] = {
          ...mockDB.products[index],
          ...newProductData,
        };
      } else {
        mockDB.products.push({ ...newProductData, sales: 0 });
      }

      if (
        appState.tabs.find((t) => t.id === appState.activeTabId)?.viewType ===
        "inventory"
      )
        renderApp();
      showToast(
        `${term.product} ${isEditing ? "updated" : "added"} successfully!`
      );
      closeModal(modal);
    });
  };

  const renderProductDetailView = (productId, container) => {
    const product = mockDB.products.find((p) => p.id === productId);
    if (!product) {
      container.innerHTML = `<p>Product not found.</p>`;
      return;
    }

    const profile = getCurrentProfile();
    const term = profile.terminology;

    let customDataHTML = "";
    if (product.customData && Object.keys(product.customData).length > 0) {
      customDataHTML = Object.entries(product.customData)
        .map(([key, value]) => {
          if (value === true) value = "Yes";
          if (value === false) value = "No";
          if (!value) return "";
          return `
                <div class="flex justify-between py-3 border-b border-border-color/50">
                    <span class="text-text-secondary">${key}</span>
                    <span class="text-text-primary font-medium text-right">${value}</span>
                </div>
            `;
        })
        .join("");
    } else {
      customDataHTML =
        '<p class="text-sm text-text-secondary py-3">No additional details available.</p>';
    }

    let advancedInventoryHTML = "";
    if (product.isSerialized && product.serials && product.serials.length > 0) {
      advancedInventoryHTML = `
            <h4 class="font-semibold text-text-primary mt-6 mb-2">Serial Numbers in Stock</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                ${product.serials
                  .map(
                    (sn) =>
                      `<span class="bg-bg-tertiary px-2 py-1 rounded text-text-secondary">${sn}</span>`
                  )
                  .join("")}
            </div>`;
    }
    if (product.hasExpiry && product.batches && product.batches.length > 0) {
      advancedInventoryHTML = `
            <h4 class="font-semibold text-text-primary mt-6 mb-2">Batches</h4>
            <table class="w-full text-left text-sm">
                <thead class="text-xs text-text-secondary uppercase"><tr><th class="py-1 font-normal">Batch ID</th><th class="py-1 font-normal">Expiry</th><th class="py-1 text-right font-normal">Stock</th></tr></thead>
                <tbody>${product.batches
                  .map(
                    (b) =>
                      `<tr class="border-b border-border-color/50"><td class="py-2">${b.batchId}</td><td class="py-2">${b.expiryDate}</td><td class="py-2 text-right">${b.stock}</td></tr>`
                  )
                  .join("")}</tbody>
            </table>`;
    }

    const content = `
        <div class="view-pane">
            <div class="flex justify-between items-center mb-6">
                 <button data-action="back-to-inventory" class="btn btn-secondary"><i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i> Back to ${
                   term.inventory
                 }</button>
                 <button data-action="edit-product" data-id="${productId}" class="btn btn-primary"><i data-lucide="edit" class="w-4 h-4 mr-2"></i>Edit ${
      term.product
    }</button>
            </div>
            <div class="glass-pane p-8 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="md:col-span-1">
                    <img src="https://placehold.co/400x400/121212/444444?text=${encodeURIComponent(
                      product.name
                    )}" class="rounded-lg w-full aspect-square object-cover" alt="${
      product.name
    }">
                </div>
                <div class="md:col-span-2">
                    <h2 class="text-3xl font-bold text-text-primary">${
                      product.name
                    }</h2>
                    <p class="font-mono text-xs text-text-secondary mb-4">${
                      product.id
                    }</p>
                    
                    <div class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm my-6">
                        <div class="flex flex-col"><span class="text-xs text-text-secondary uppercase">Price</span><span class="text-2xl font-mono text-accent font-bold">${currencyUtils.format(
                          product.price
                        )}</span></div>
                        <div class="flex flex-col"><span class="text-xs text-text-secondary uppercase">Stock</span><span class="text-2xl font-mono text-text-primary font-bold">${
                          product.stock
                        }</span></div>
                        <div class="flex flex-col"><span class="text-xs text-text-secondary uppercase">${
                          term.category
                        }</span><span class="text-text-primary font-medium">${
      product.category
    }</span></div>
                        <div class="flex flex-col"><span class="text-xs text-text-secondary uppercase">${
                          term.product
                        } Type</span><span class="text-text-primary font-medium capitalize">${
      product.productType
    }</span></div>
                    </div>

                    <div class="border-t border-border-color pt-2 text-sm">
                        ${customDataHTML}
                    </div>
                    
                    ${advancedInventoryHTML}
                </div>
            </div>
        </div>`;

    container.innerHTML = content;
    lucide.createIcons();

    container
      .querySelector('[data-action="back-to-inventory"]')
      .addEventListener("click", () => {
        initInventory(container);
      });
    container
      .querySelector(`[data-action="edit-product"]`)
      .addEventListener("click", () => {
        openProductFormModal(true, product);
      });
  };

  document.getElementById("ai-assistant-btn").addEventListener("click", () => {
    const content = `<div class="flex flex-col h-96"><div class="flex-1 overflow-y-auto p-4 space-y-4 text-sm" id="ai-chat-history"><div class="flex gap-3"><div class="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0"><i data-lucide="sparkles" class="w-5 h-5"></i></div><p class="bg-bg-tertiary rounded-lg p-3">Hello! I'm your AI assistant. How can I help you today? Ask me about sales trends, low-stock products, or customer insights.</p></div></div><div class="p-4 border-t border-border-color"><form id="ai-input-form" class="relative"><input type="text" id="ai-input" placeholder="Ask a question..." class="w-full form-input pr-12"><button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-md hover:bg-accent-hover"><i data-lucide="send" class="w-5 h-5"></i></button></form></div></div>`;
    const modal = showModal("AI Assistant", content, "", {
      size: "max-w-2xl",
      customClasses: "p-0",
    });
    modal.querySelector("#ai-input-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = modal.querySelector("#ai-input");
      const history = modal.querySelector("#ai-chat-history");
      if (!input.value) return;
      history.innerHTML += `<div class="flex justify-end gap-3"><p class="bg-blue-600/50 text-blue-100 rounded-lg p-3 max-w-md">${input.value}</p></div>`;
      // AI response logic would go here. For now, a mock response.
      setTimeout(() => {
        history.innerHTML += `<div class="flex gap-3"><div class="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0"><i data-lucide="sparkles" class="w-5 h-5"></i></div><p class="bg-bg-tertiary rounded-lg p-3">Based on current trends, sales for "Produce" items are expected to increase by 20% over the weekend.</p></div>`;
        history.scrollTop = history.scrollHeight;
      }, 1000);
      input.value = "";
    });
  });

  document.body.addEventListener("input", (e) => {
    const actionTarget = e.target.closest("[data-action]");
    if (!actionTarget || actionTarget.dataset.action !== "update-qty") return;

    // DEPRECATED: Quantity is now handled in the edit modal to simplify the main UI.
    // This event listener can be repurposed if inline editing is desired later.
    e.preventDefault();
  });

  const showLargeReceiptPreview = (templateId) => {
    const template = receiptTemplates[templateId];
    if (!template) return;

    // Create a mock invoice for a realistic preview
    const mockInvoice = {
      id: "PREVIEW-001",
      customerName: "Amelia Chen",
      customer: mockDB.customers[1], // Use Jane Smith for detailed preview
      total: 0, // Will be calculated
      date: new Date().toISOString(),
      items: [
        mockDB.products[0],
        { ...mockDB.products[4], serialNumber: "SN-HX1-PREVIEW" },
        { ...mockDB.products[1], qty: 2.5 },
      ],
      cashier: "Preview Mode",
      storeId: "STR-PV",
      pointsEarned: 0,
      currency: appState.currentCurrency,
      exchangeRate: currencyUtils.get().rate,
    };

    const subtotalBase = mockInvoice.items.reduce(
      (acc, item) => acc + item.price * (item.qty || 1),
      0
    );
    mockInvoice.totalInBaseCurrency = subtotalBase * 1.1;
    mockInvoice.total = currencyUtils.convert(mockInvoice.totalInBaseCurrency);
    mockInvoice.pointsEarned = Math.floor(mockInvoice.totalInBaseCurrency);

    const mockPaymentState = {
      payments: [
        { method: "Card", amount: currencyUtils.convert(80.0) },
        { method: "Cash", amount: currencyUtils.convert(10.0) },
      ],
      total: mockInvoice.total,
    };

    const content = template.getBody(mockInvoice, mockPaymentState);
    const modal = showModal(
      `Preview: ${template.name}`,
      content,
      `<button data-action="close-modal" class="btn btn-secondary">Close</button>`,
      { size: "max-w-2xl", customClasses: "p-0" }
    );
    lucide.createIcons();
  };

  const receiptTemplates = {
    modern: {
      name: "Futuristic",
      preview: `<div class="bg-blue-900/50 p-4 font-sans text-[8px] leading-tight text-white"><div class="flex justify-between items-center"><div class="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center"><i data-lucide="gem" class="w-4 h-4 text-white"></i></div><p class="font-bold text-blue-300 text-[10px]">INVOICE</p></div><div class="mt-4 space-y-1"><div class="h-2 w-full bg-blue-500/50 rounded-full"></div><div class="h-2 w-3/4 bg-blue-500/50 rounded-full"></div></div><div class="mt-4 h-px bg-blue-400/50"></div><p class="text-right text-blue-300 font-bold text-[10px] mt-2">TOTAL: ${currencyUtils.format(
        25
      )}</p></div>`,
      getBody: (invoice, paymentState) => {
        const subtotalBase = invoice.items.reduce(
          (sum, item) => sum + (item.qty || 1) * item.price,
          0
        );
        const totalBase = invoice.totalInBaseCurrency || subtotalBase * 1.1;
        const taxBase = totalBase - subtotalBase;
        const totalPaid =
          paymentState?.payments.reduce((sum, p) => sum + p.amount, 0) || 0;
        const changeDue = totalPaid - invoice.total;
        const currency = invoice.currency || appState.currentCurrency;

        // AI Recommendation Logic
        let recommendations = "";
        const hasCoffee = invoice.items.some((i) => i.id === "SKU001");
        const hasElectronics = invoice.items.some(
          (i) => i.category === "Electronics"
        );
        if (hasCoffee) {
          recommendations += `<p class="mt-1">You may also love our <span class="text-blue-300 font-semibold">Organic Green Tea</span>.</p>`;
        }
        if (!hasElectronics) {
          recommendations += `<p class="mt-1">Check out our new <span class="text-blue-300 font-semibold">Hyperion X1 Smartphones</span> in store!</p>`;
        }

        let warrantyInfo = "";
        const electronicItems = invoice.items.filter(
          (p) => p.category === "Electronics"
        );
        if (electronicItems.length > 0) {
          warrantyInfo = `<div class="mt-4 p-3 bg-blue-900/50 rounded-lg text-xs"><h4 class="font-bold text-blue-300 mb-1">Warranty Information</h4>${electronicItems
            .map(
              (p) =>
                `<p><span class="font-medium">${p.name}:</span> 2-Year Limited Warranty</p>`
            )
            .join("")}</div>`;
        }

        return `<div class="bg-gray-900 text-gray-200 font-sans p-8" id="receipt-content" style="font-family: 'Inter', sans-serif; background: linear-gradient(145deg, #101827, #0b111e);">
                    <!-- 1. Header -->
                    <div class="flex justify-between items-start pb-4 border-b border-blue-800">
                        <div>
                            <h1 class="text-2xl font-bold text-white flex items-center gap-3"><img src="${
                              storeInfo.logoUrl
                            }" class="w-8 h-8 rounded-full bg-blue-600/50" alt="logo"/> ${
          storeInfo.name
        }</h1>
                            <p class="text-xs text-blue-300 mt-2">${
                              storeInfo.address
                            }<br>Ph: ${storeInfo.contact} | Web: ${
          storeInfo.website
        }<br>BIN: ${storeInfo.taxId}</p>
                        </div>
                        <div class="text-right">
                            <h2 class="text-xl font-semibold text-white uppercase tracking-widest">Receipt</h2>
                            <p class="text-sm font-mono text-blue-400">${
                              invoice.id
                            }</p>
                        </div>
                    </div>
                    <!-- 2. Transaction Info -->
                    <div class="flex justify-between text-xs mt-4 text-blue-300">
                        <p>Date: ${new Date(invoice.date).toLocaleString()}</p>
                        <p>Cashier: ${invoice.cashier} / Store: ${
          invoice.storeId
        }</p>
                    </div>
                    <!-- 3. Bill To -->
                     ${
                       invoice.customer
                         ? `<div class="mt-6 border-t border-blue-800 pt-4"><h3 class="text-sm font-semibold text-blue-300">Billed To:</h3><p class="text-white font-medium">${invoice.customer.name}</p><p class="text-xs text-blue-300">Loyalty ID: ${invoice.customer.loyaltyId}</p></div>`
                         : ""
                     }
                    <!-- 4. Itemized List -->
                    <div class="mt-6"><table class="w-full text-sm text-gray-300">
                        <thead><tr class="text-left text-blue-300 uppercase text-xs border-b-2 border-blue-800"><th class="py-2 font-semibold tracking-wider">Item / SKU</th><th class="py-2 text-center">Qty×Price</th><th class="py-2 text-right font-semibold tracking-wider">Total</th></tr></thead>
                        <tbody>${invoice.items
                          .map(
                            (item) =>
                              `<tr><td class="py-2 pr-2">${
                                item.name
                              }<br><span class="text-blue-400 text-xs font-mono">${
                                item.id
                              } ${
                                item.serialNumber
                                  ? `(${item.serialNumber})`
                                  : ""
                              }</span></td><td class="py-2 text-center font-mono">${
                                item.qty || 1
                              } × ${currencyUtils.format(
                                item.price,
                                currency
                              )}</td><td class="py-2 text-right font-mono">${currencyUtils.format(
                                (item.qty || 1) * item.price,
                                currency
                              )}</td></tr>`
                          )
                          .join("")}</tbody>
                    </table></div>
                    <!-- 5. Totals -->
                    <div class="mt-6 flex justify-end"><div class="w-full max-w-xs text-sm">
                        <div class="flex justify-between text-blue-300"><span>Subtotal:</span><span class="font-mono">${currencyUtils.format(
                          subtotalBase,
                          currency
                        )}</span></div>
                        <div class="flex justify-between mt-1 text-blue-300"><span>Tax (10%):</span><span class="font-mono">${currencyUtils.format(
                          taxBase,
                          currency
                        )}</span></div>
                        <div class="h-px bg-blue-800 my-2"></div>
                        <div class="flex justify-between font-bold text-2xl text-white"><span>Grand Total:</span><span class="font-mono">${currencyUtils.format(
                          totalBase,
                          currency
                        )}</span></div>
                    </div></div>
                     <!-- 6. Payment Info -->
                     ${
                       paymentState
                         ? `<div class="mt-4 pt-4 border-t border-blue-800"><div class="w-full max-w-xs text-sm ml-auto">
                        ${paymentState.payments
                          .map(
                            (p) =>
                              `<div class="flex justify-between mt-1 text-blue-300"><span>Paid (${
                                p.method
                              }):</span><span class="font-mono">${
                                currencyUtils.get(currency).symbol
                              }${p.amount.toFixed(2)}</span></div>`
                          )
                          .join("")}
                        ${
                          changeDue > 0.001
                            ? `<div class="flex justify-between mt-1 font-semibold text-white"><span>Change Due:</span><span class="font-mono">${
                                currencyUtils.get(currency).symbol
                              }${changeDue.toFixed(2)}</span></div>`
                            : ""
                        }
                     </div></div>`
                         : ""
                     }
                    <!-- 7. Customer Value -->
                    <div class="mt-6 text-center text-xs text-blue-300 p-3 bg-blue-500/10 rounded-lg">
                        <p>You earned <span class="font-bold text-white">${
                          invoice.pointsEarned
                        }</span> points on this purchase!</p>
                        <p class="mt-1">Get 15% OFF your next purchase with code: <span class="font-bold text-white font-mono bg-blue-500/20 px-1 py-0.5 rounded">WELCOME15</span></p>
                        <p class="mt-2 opacity-70">30-day return/exchange policy on most items.</p>
                    </div>
                    <!-- AI Add-ons -->
                    ${
                      recommendations || warrantyInfo
                        ? `<div class="mt-4 text-xs text-blue-200"><h4 class="font-bold text-blue-300">Just For You:</h4>${recommendations}${warrantyInfo}</div>`
                        : ""
                    }
                    <!-- 8. Footer -->
                    <div class="mt-8 text-center text-xs text-blue-400">
                        <p class="text-base font-semibold text-white">Thank you, ${
                          invoice.customerName.split(" ")[0]
                        }!</p>
                        <p>Rate your experience | Follow us ${
                          storeInfo.socials
                        }</p>
                        <p class="mt-2 opacity-70">🌱 Request an e-receipt next time to save paper.</p>
                    </div>
                </div>`;
      },
    },
  };

  const showReceipt = (invoice, paymentState = null) => {
    const template =
      receiptTemplates[appState.settings.selectedReceiptTemplate] ||
      receiptTemplates.modern;
    const content = template.getBody(invoice, paymentState);

    const footer = `<button data-action="close-modal" class="btn btn-secondary">Close</button><button id="print-receipt" class="btn btn-primary"><i data-lucide="printer" class="w-4 h-4 mr-2"></i>Print</button>`;
    const modal = showModal(`Receipt / Invoice`, content, footer, {
      size: "max-w-2xl",
      customClasses: "p-0",
    });
    lucide.createIcons();
    modal.querySelector("#print-receipt").addEventListener("click", () => {
      showToast("Printing not available in this demo.", "info");
    });
  };

  window.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    const activeModal = document.querySelector(".modal-overlay");
    const activeTab = appState.tabs.find((t) => t.id === appState.activeTabId);

    // --- Global Shortcuts that work everywhere ---

    // Open search with Ctrl/Cmd+K (also handled by the specific handler below, but this is a fallback)
    if (modifier && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.querySelector('[data-action="open-search"]').click();
      return;
    }

    // Show shortcuts with '?'
    if (e.key === "?" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
      e.preventDefault();
      showShortcutsModal();
      return;
    }

    // Close modals or menus with Escape
    if (e.key === "Escape") {
      const openMenu = document.querySelector(".action-menu.open");
      if (activeModal) {
        e.preventDefault();
        closeModal(activeModal);
      } else if (openMenu) {
        e.preventDefault();
        openMenu.classList.remove("open");
      }
      return;
    }

    // --- Form saving in modals ---
    if (modifier && e.key.toLowerCase() === "s" && activeModal) {
      e.preventDefault();
      const saveButton = activeModal.querySelector('button[type="submit"]');
      if (saveButton) saveButton.click();
    }

    // --- Shortcuts that should NOT work when a modal is open or when typing ---
    if (activeModal || ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

    // AI Assistant with Alt+Q
    if (e.altKey && e.key.toLowerCase() === "q") {
      e.preventDefault();
      document.getElementById("ai-assistant-btn").click();
    }

    // --- View Navigation with Alt key ---
    const keyViewMap = {
      d: "dashboard",
      p: "pos",
      i: "invoices",
      n: "inventory",
      r: "reports",
      c: "customers",
      s: "settings",
    };
    if (e.altKey && keyViewMap[e.key.toLowerCase()]) {
      e.preventDefault();
      openOrSwitchTab(keyViewMap[e.key.toLowerCase()]);
    }

    // --- Context-Aware Shortcuts (e.g., for POS) ---
    if (activeTab?.viewType === "pos") {
      // Focus search with F2 or Ctrl+I
      if (e.key === "F2" || (modifier && e.key.toLowerCase() === "i")) {
        e.preventDefault();
        workspaceContent.querySelector("#pos-search")?.focus();
      }
      // Open payment with F4 or Ctrl+P
      if (e.key === "F4" || (modifier && e.key.toLowerCase() === "p")) {
        e.preventDefault();
        workspaceContent
          .querySelector('[data-action="process-payment"]')
          ?.click();
      }
      // Add customer with Alt+A
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        workspaceContent
          .querySelector('[data-action="add-customer-to-sale"]')
          ?.click();
      }
      // New sale with Alt+N
      if (e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        workspaceContent.querySelector('[data-action="new-sale"]')?.click();
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      document.querySelector('[data-action="open-search"]').click();
    }
  });

  // --- INITIAL LOAD ---
  window.addEventListener("resize", checkScreenSize);
  checkScreenSize();
  openOrSwitchTab("dashboard");
});
