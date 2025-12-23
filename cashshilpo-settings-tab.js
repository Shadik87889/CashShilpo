/**
 * CashShilpo Settings Tab Manager
 * Organizes the monolithic settings page into a clean tabbed interface.
 * Handles dynamic content from external modules (Theme, Visuals, Language).
 */

(function () {
  console.log("CashShilpo Settings Tabs: Module Loaded");

  // Configuration for tabs
  const TABS = [
    { id: "general", label: "General", icon: "settings" },
    { id: "appearance", label: "Appearance", icon: "palette" },
    { id: "automation", label: "Automation", icon: "zap" },
    { id: "permissions", label: "Permissions", icon: "shield" },
  ];

  let currentTab = "general";

  // Helper to create the tab navigation UI
  function createTabsUI() {
    const navContainer = document.createElement("div");
    navContainer.id = "settings-tab-nav";
    navContainer.className =
      "flex border-b border-border-color mb-6 overflow-x-auto";

    TABS.forEach((tab) => {
      const btn = document.createElement("button");
      btn.className = `px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
        currentTab === tab.id
          ? "border-accent text-text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"
      }`;
      btn.dataset.tabId = tab.id;

      // Icon
      const icon = document.createElement("i");
      icon.dataset.lucide = tab.icon;
      icon.className = "w-4 h-4";

      btn.appendChild(icon);
      btn.appendChild(document.createTextNode(tab.label));

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab(tab.id);
      });

      navContainer.appendChild(btn);
    });

    return navContainer;
  }

  // Helper to create content containers for each tab
  function createTabContainers() {
    const wrapper = document.createElement("div");
    wrapper.id = "settings-tab-content-wrapper";

    TABS.forEach((tab) => {
      const container = document.createElement("div");
      container.id = `tab-content-${tab.id}`;
      container.className = `space-y-6 ${
        currentTab === tab.id ? "block" : "hidden"
      } animate-fadeIn`;
      wrapper.appendChild(container);
    });

    return wrapper;
  }

  // Switch logic
  function switchTab(tabId) {
    currentTab = tabId;

    // Update Buttons
    const nav = document.getElementById("settings-tab-nav");
    if (!nav) return;

    Array.from(nav.children).forEach((btn) => {
      if (btn.dataset.tabId === tabId) {
        btn.className =
          "px-6 py-3 text-sm font-medium border-b-2 border-accent text-text-primary flex items-center gap-2 whitespace-nowrap transition-colors";
      } else {
        btn.className =
          "px-6 py-3 text-sm font-medium border-b-2 border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50 flex items-center gap-2 whitespace-nowrap transition-colors";
      }
    });

    // Update Content
    const wrapper = document.getElementById("settings-tab-content-wrapper");
    if (!wrapper) return;

    Array.from(wrapper.children).forEach((container) => {
      if (container.id === `tab-content-${tabId}`) {
        container.classList.remove("hidden");
        container.classList.add("block");
      } else {
        container.classList.add("hidden");
        container.classList.remove("block");
      }
    });
  }

  // Core Logic: Categorize and Move Elements
  function organizeContent(settingsForm) {
    // Prevent re-initialization
    if (settingsForm.querySelector("#settings-tab-nav")) return;

    // 1. Create Layout Structure
    const header = settingsForm.querySelector("h1");
    const containerDiv = settingsForm.querySelector(".space-y-8.max-w-4xl"); // The main content container from initSettings

    if (!header || !containerDiv) return;

    const tabsNav = createTabsUI();
    const tabsContent = createTabContainers();

    // Insert Tabs after header
    header.insertAdjacentElement("afterend", tabsNav);

    // Insert Content Wrapper
    header.parentNode.insertBefore(tabsContent, containerDiv);

    // We will move elements OUT of containerDiv and into our tab containers
    // We need to continuously monitor containerDiv because standard elements are there,
    // but external scripts (themes/visuals) inject elements differently.

    // 2. Define Sorting Rules based on content text or IDs
    const sortElement = (element) => {
      // -- External Module IDs --
      if (element.id === "lang-toggle-card") return "appearance";
      if (element.id === "theme-selector-card") return "appearance";
      if (element.id === "visual-engine-panel") return "appearance";

      // -- Content Based Sorting (looking at H2 text) --
      const title = element.querySelector("h2")?.innerText?.toLowerCase() || "";

      if (
        element.id === "permissions-container" ||
        title.includes("role permissions")
      )
        return "permissions";
      if (
        element.id === "automations-container" ||
        title.includes("automation")
      )
        return "automation";

      // Appearance related titles
      if (title.includes("pos layout")) return "appearance";

      // Default everything else to General
      return "general";
    };

    // 3. Move Existing Elements (Standard Settings)
    // Convert NodeList to Array to avoid live collection issues during iteration
    Array.from(containerDiv.children).forEach((child) => {
      // Preserve the Save button at the bottom of General, or create a global footer
      // For now, we move the save button row to 'general' usually, but let's check
      if (
        child.classList.contains("flex") &&
        child.querySelector('button[data-action="save-settings"]')
      ) {
        // This is the save button row. Let's append it to General for now, or keep it visible?
        // Better UX: Clone it or move it to a fixed footer?
        // Simple approach: Move to General as it contains most inputs.
        document.getElementById("tab-content-general").appendChild(child);
        return;
      }

      const targetTab = sortElement(child);
      document.getElementById(`tab-content-${targetTab}`).appendChild(child);
    });

    // 4. Hide the original container now that it's empty/processed
    containerDiv.style.display = "none";

    // 5. Initial Icon Render
    if (window.lucide) window.lucide.createIcons();

    // 6. Check for empty tabs and hide their buttons
    TABS.forEach((tab) => {
      const content = document.getElementById(`tab-content-${tab.id}`);
      const btn = document.querySelector(`button[data-tab-id="${tab.id}"]`);
      if (content && btn && content.children.length === 0) {
        btn.style.display = "none";
      }
    });
  }

  // --- CONTINUOUS MONITORING ---
  // Because Theme/Visuals/Lang scripts inject elements asynchronously or on mutation,
  // we need to catch them and move them to the correct tab immediately.

  const observer = new MutationObserver((mutations) => {
    const settingsForm = document.getElementById("settings-form");

    // If settings view is not active, do nothing
    if (!settingsForm) return;

    // 1. Initialize Tabs if not present
    if (!document.getElementById("settings-tab-nav")) {
      organizeContent(settingsForm);
    }

    // 2. Watch for stray elements injected by other scripts into the main form
    // These scripts typically append to settingsForm or insert after H1
    const strayElements = [];

    // Check direct children of settings-form that are NOT our tab structure
    Array.from(settingsForm.children).forEach((child) => {
      if (child.tagName === "H1") return; // Header
      if (child.id === "settings-tab-nav") return; // Our Nav
      if (child.id === "settings-tab-content-wrapper") return; // Our Content

      // If it's the original container (now hidden), ignore
      if (
        child.classList.contains("space-y-8") &&
        child.classList.contains("max-w-4xl")
      )
        return;

      // Anything else is likely an injected module (Theme, Lang, Visuals)
      strayElements.push(child);
    });

    strayElements.forEach((el) => {
      // Determine where it goes
      let targetTab = "general"; // Default

      if (
        el.id === "lang-toggle-card" ||
        el.id === "theme-selector-card" ||
        el.id === "visual-engine-panel"
      ) {
        targetTab = "appearance";
      }

      // Move it
      const container = document.getElementById(`tab-content-${targetTab}`);
      if (container) {
        container.prepend(el); // Prepend to show at top of tab
        // Ensure the tab is visible if content is added
        const btn = document.querySelector(
          `button[data-tab-id="${targetTab}"]`
        );
        if (btn) btn.style.display = "flex";
      }
    });
  });

  // Start Observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Handle initial load if settings is already open
  const initialSettings = document.getElementById("settings-form");
  if (initialSettings) {
    organizeContent(initialSettings);
  }
})();
