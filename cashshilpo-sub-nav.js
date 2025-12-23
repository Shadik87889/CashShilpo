/**
 * CashShilpo Sub-Navigation Module
 * Adds premium sub-menu functionality to the existing sidebar.
 * Handles both Collapsed (Flyout) and Expanded (Accordion) states.
 */

(function () {
  console.log("CashShilpo Sub-Nav: Initializing...");

  // --- 1. CONFIGURATION ---
  // Map 'data-view' attributes to sub-menu items.
  // actions: trigger a click on a global element with [data-action="..."]
  // subType: used for reports to switch tabs after navigation
  const subMenuConfig = {
    inventory: [
      {
        label: "All Products",
        icon: "list",
        action: "trigger-view",
        view: "inventory",
      },
      { label: "Add Product", icon: "plus-circle", action: "add-product" },
      {
        label: "Import CSV",
        icon: "upload",
        action: "open-import-modal",
        dataset: { type: "products" },
      },
      {
        label: "Attributes",
        icon: "tags",
        action: "trigger-view",
        view: "attributes",
      },
    ],
    pos: [
      {
        label: "Terminal",
        icon: "monitor",
        action: "trigger-view",
        view: "pos",
      },
      {
        label: "Barcode Gen",
        icon: "scan-barcode",
        action: "trigger-view",
        view: "barcode-generator",
      },
    ],
    invoices: [
      {
        label: "All Invoices",
        icon: "file-text",
        action: "trigger-view",
        view: "invoices",
      },
      {
        label: "Quotations",
        icon: "clipboard-list",
        action: "trigger-view",
        view: "quotations",
      },
      {
        label: "Warranty Claims",
        icon: "shield-alert",
        action: "trigger-view",
        view: "claims",
      },
    ],
    reports: [
      {
        label: "Sales Report",
        icon: "trending-up",
        action: "trigger-report",
        type: "sales",
      },
      {
        label: "Inventory Report",
        icon: "package",
        action: "trigger-report",
        type: "inventory",
      },
      {
        label: "Customer Report",
        icon: "users",
        action: "trigger-report",
        type: "customer",
      },
      {
        label: "Expenses",
        icon: "pie-chart",
        action: "trigger-report",
        type: "expense",
      },
    ],
    customers: [
      {
        label: "Customer List",
        icon: "users",
        action: "trigger-view",
        view: "customers",
      },
      { label: "Add Customer", icon: "user-plus", action: "add-customer" },
      {
        label: "Loyalty Program",
        icon: "award",
        action: "trigger-view",
        view: "loyalty",
      },
    ],
    expenses: [
      {
        label: "Expense List",
        icon: "list",
        action: "trigger-view",
        view: "expenses",
      },
      { label: "Add Expense", icon: "plus", action: "add-expense" },
    ],
    "purchase-orders": [
      {
        label: "All POs",
        icon: "shopping-cart",
        action: "trigger-view",
        view: "purchase-orders",
      },
      { label: "New PO", icon: "plus-circle", action: "add-purchase-order" },
      {
        label: "Suppliers",
        icon: "truck",
        action: "trigger-view",
        view: "suppliers",
      },
    ],
    settings: [
      {
        label: "General",
        icon: "settings",
        action: "trigger-view",
        view: "settings",
      },
      {
        label: "Staff",
        icon: "user-cog",
        action: "trigger-view",
        view: "staff",
      },
      {
        label: "User Roles",
        icon: "shield",
        action: "trigger-view",
        view: "user-roles",
      },
      {
        label: "Subscription",
        icon: "credit-card",
        action: "trigger-view",
        view: "subscription",
      },
    ],
  };

  // --- 2. CSS INJECTION ---
  const styles = `
        /* Sub-Nav Wrapper */
        .nav-item-wrapper {
            position: relative;
            margin-bottom: 0.25rem;
            transition: all 0.3s ease;
        }

        /* Chevron Rotation */
        .sub-nav-toggle {
            margin-left: auto;
            transition: transform 0.3s ease;
            opacity: 0.7;
            cursor: pointer;
            padding: 4px;
        }
        .nav-item-wrapper.expanded .sub-nav-toggle {
            transform: rotate(180deg);
            opacity: 1;
            color: var(--accent);
        }

        /* Expanded Mode (Accordion) */
        .sub-nav-container {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
            opacity: 0;
            margin-left: 1.5rem; /* Indent */
            border-left: 1px solid var(--border-color);
        }
        .nav-item-wrapper.expanded .sub-nav-container {
            max-height: 500px; /* Arbitrary large height */
            opacity: 1;
            margin-top: 0.25rem;
            margin-bottom: 0.5rem;
        }

        /* Sub-Nav Items */
        .sub-nav-link {
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
            border-radius: 0.5rem;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .sub-nav-link:hover {
            color: var(--text-primary);
            background-color: var(--bg-tertiary);
        }
        .sub-nav-link i {
            width: 14px;
            height: 14px;
            margin-right: 0.75rem;
            opacity: 0.7;
        }

        /* COLLAPSED SIDEBAR MODE (Flyout) */
        /* We use the .sidebar-collapsed class from your main app to trigger this */
        #sidebar.sidebar-collapsed .sub-nav-toggle {
            display: none; /* Hide chevron in collapsed mode */
        }
        
        #sidebar.sidebar-collapsed .sub-nav-container {
            /* Reset accordion styles */
            max-height: unset;
            opacity: 0; 
            margin: 0;
            border: none;
            
            /* Flyout Positioning */
            position: absolute;
            left: 100%; /* Right of sidebar */
            top: 0;
            width: 200px;
            background-color: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            padding: 0.5rem;
            z-index: 100;
            pointer-events: none; /* Ignore clicks when hidden */
            transform: translateX(10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            margin-left: 0.5rem; /* Gap */
        }
        
        /* Show flyout on hover of wrapper */
        #sidebar.sidebar-collapsed .nav-item-wrapper:hover .sub-nav-container {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(0);
        }

        /* Flyout Header (Optional title for context) */
        .flyout-header {
            display: none;
            padding: 0.5rem 1rem;
            font-weight: 600;
            color: var(--text-primary);
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 0.25rem;
        }
        #sidebar.sidebar-collapsed .flyout-header {
            display: block;
        }

        /* Fix Main Link in Collapsed Mode */
        #sidebar.sidebar-collapsed .nav-link {
            justify-content: center;
        }
        #sidebar.sidebar-collapsed .nav-link span {
            display: none; /* Hide text, just icon */
        }
    `;

  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // --- 3. DOM MANIPULATION ---

  function initSubNav() {
    const sidebar = document.getElementById("sidebar");
    const nav = document.getElementById("main-nav");
    if (!nav) return; // Wait until DOM is ready

    // Observer to detect when sidebar collapses/expands to adjust behavior if needed
    // (Though our CSS handles most of it, JS listeners might need context)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isCollapsed = sidebar.classList.contains("sidebar-collapsed");
          // Close all accordions when collapsing to clean up UI
          if (isCollapsed) {
            document
              .querySelectorAll(".nav-item-wrapper.expanded")
              .forEach((el) => el.classList.remove("expanded"));
          }
        }
      });
    });
    observer.observe(sidebar, { attributes: true });

    // Iterate over config and inject
    Object.keys(subMenuConfig).forEach((key) => {
      const mainLink = nav.querySelector(`a[data-view="${key}"]`);
      if (!mainLink) return;

      const subItems = subMenuConfig[key];
      if (!subItems || subItems.length === 0) return;

      // 1. Wrap the existing link to keep structure clean
      const wrapper = document.createElement("div");
      wrapper.className = "nav-item-wrapper";
      mainLink.parentNode.insertBefore(wrapper, mainLink);
      wrapper.appendChild(mainLink);

      // 2. Add Chevron to Main Link
      const chevron = document.createElement("i");
      // We use a specific class to identify it for Lucide later, but generic HTML for now
      chevron.setAttribute("data-lucide", "chevron-down");
      chevron.className = "w-4 h-4 sub-nav-toggle";
      mainLink.appendChild(chevron);

      // 3. Create Sub-Menu Container
      const subContainer = document.createElement("div");
      subContainer.className = "sub-nav-container glass-pane"; // inherit glass effect for flyout

      // Add Header for Flyout Mode
      const headerText =
        mainLink.querySelector(".nav-link-text")?.textContent || key;
      const flyoutHeader = document.createElement("div");
      flyoutHeader.className = "flyout-header";
      flyoutHeader.textContent = headerText;
      subContainer.appendChild(flyoutHeader);

      // 4. Create Sub-Items
      subItems.forEach((item) => {
        const subLink = document.createElement("div");
        subLink.className = "sub-nav-link";
        subLink.innerHTML = `<i data-lucide="${item.icon}"></i><span>${item.label}</span>`;

        // Event Handling
        subLink.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent bubbling to main nav
          handleSubItemClick(item);
        });

        subContainer.appendChild(subLink);
      });

      wrapper.appendChild(subContainer);

      // 5. Toggle Logic for Accordion (Expanded Mode)
      mainLink.addEventListener("click", (e) => {
        if (sidebar.classList.contains("sidebar-collapsed")) {
          // In collapsed mode, click behaves normally (navigates to main view)
          // The flyout handles sub-items on hover.
          return;
        }

        // In expanded mode:
        // We want to navigate AND toggle, or just toggle?
        // Default app behavior: navigates.
        // Let's toggle the menu as well.

        // Toggle current
        wrapper.classList.toggle("expanded");

        // Optional: Close others (Accordion style)
        document.querySelectorAll(".nav-item-wrapper.expanded").forEach((w) => {
          if (w !== wrapper) w.classList.remove("expanded");
        });
      });

      // Separate listener for chevron to ONLY toggle menu without navigating
      // (Only works if we stop propagation on chevron click, but chevron is inside `a` tag)
      chevron.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!sidebar.classList.contains("sidebar-collapsed")) {
          wrapper.classList.toggle("expanded");
        }
      });
    });

    // Re-render icons
    if (window.lucide) window.lucide.createIcons();
  }

  // --- 4. ACTION HANDLER ---

  function handleSubItemClick(item) {
    // 1. Simple View Switch
    if (item.action === "trigger-view") {
      const link = document.querySelector(`a[data-view="${item.view}"]`);
      if (link) link.click();
    }

    // 2. Modal Trigger (e.g., Add Product)
    else if (item.action && !item.action.startsWith("trigger-")) {
      // Find a button in the DOM that triggers this action usually
      // OR construct a fake event.
      // Best bet: find a button with this action.
      const btn = document.querySelector(
        `button[data-action="${item.action}"]`
      );
      if (btn) {
        btn.click();
      } else {
        // If button doesn't exist (e.g. view not loaded), we might need to fallback
        // or create a temporary event trigger.
        // For "add-product", it usually exists in the DOM if configured globally,
        // but strictly speaking, it's safer to emit a click on the body with the dataset.
        const fakeTarget = document.createElement("div");
        fakeTarget.dataset.action = item.action;
        if (item.dataset) {
          Object.keys(item.dataset).forEach(
            (k) => (fakeTarget.dataset[k] = item.dataset[k])
          );
        }
        // We need to trick the global delegator
        // The global listener is on document.body.
        // We can dispatch a click event from this fake target,
        // BUT elements not in DOM usually don't bubble up to body.
        // WE MUST append it momentarily.
        document.body.appendChild(fakeTarget);
        fakeTarget.click();
        document.body.removeChild(fakeTarget);
      }
    }

    // 3. Deep Linking: Reports
    else if (item.action === "trigger-report") {
      // First, switch to reports view
      const reportLink = document.querySelector(`a[data-view="reports"]`);
      if (reportLink) {
        reportLink.click();
        // Wait for render, then click the specific report type
        setTimeout(() => {
          const typeBtn = document.querySelector(
            `.report-type-btn[data-type="${item.type}"]`
          );
          if (typeBtn) typeBtn.click();
        }, 100); // 100ms delay to allow view render
      }
    }
  }

  // Initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSubNav);
  } else {
    // Use a slight delay to ensure main app renders sidebar first
    setTimeout(initSubNav, 500);
  }
})();
