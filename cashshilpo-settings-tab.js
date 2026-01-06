/**
 * CashShilpo Settings Tab Manager
 * Organizes the monolithic settings page into a clean tabbed interface.
 * Now features the HyperVoice OS tab.
 */

(function () {
  console.log("CashShilpo Settings Tabs: Module Loaded");

  // Configuration for tabs - Permissions REMOVED, Voice OS ADDED
  const TABS = [
    { id: "general", label: "General", icon: "settings" },
    { id: "appearance", label: "Appearance", icon: "palette" },
    { id: "voice", label: "Voice OS", icon: "mic-activity" }, // The new advanced tab
    { id: "automation", label: "Automation", icon: "zap" },
  ];

  let currentTab = "general";

  // Helper to create the tab navigation UI
  function createTabsUI() {
    const navContainer = document.createElement("div");
    navContainer.id = "settings-tab-nav";
    navContainer.className =
      "flex border-b border-border-color mb-6 overflow-x-auto scrollbar-hide";

    TABS.forEach((tab) => {
      const btn = document.createElement("button");
      btn.className = `px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
        currentTab === tab.id
          ? "border-accent text-text-primary bg-accent/5"
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
      const isActive = btn.dataset.tabId === tabId;
      btn.className = `px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
        isActive
          ? "border-accent text-text-primary bg-accent/5"
          : "border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"
      }`;
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
    const containerDiv = settingsForm.querySelector(".space-y-8.max-w-4xl");

    if (!header || !containerDiv) return;

    const tabsNav = createTabsUI();
    const tabsContent = createTabContainers();

    // Insert Tabs after header
    header.insertAdjacentElement("afterend", tabsNav);

    // Insert Content Wrapper
    header.parentNode.insertBefore(tabsContent, containerDiv);

    // 2. Define Sorting Rules based on content text or IDs
    const sortElement = (element) => {
      // -- External Module IDs --
      if (element.id === "lang-toggle-card") return "appearance";
      if (element.id === "theme-selector-card") return "appearance";
      if (element.id === "visual-engine-panel") return "appearance";

      // -- NEW: Route the Voice OS module --
      if (element.id === "hyper-voice-os-panel") return "voice";

      // -- Content Based Sorting --
      const title = element.querySelector("h2")?.innerText?.toLowerCase() || "";

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

    // 3. Move Existing Elements
    Array.from(containerDiv.children).forEach((child) => {
      // Keep save button in General
      if (
        child.classList.contains("flex") &&
        child.querySelector('button[data-action="save-settings"]')
      ) {
        document.getElementById("tab-content-general").appendChild(child);
        return;
      }

      // If it was the old permissions container, we skip it (effectively removing it)
      if (
        child.id === "permissions-container" ||
        child
          .querySelector("h2")
          ?.innerText?.toLowerCase()
          .includes("role permissions")
      ) {
        // Do not append to any tab. This removes it from view.
        return;
      }

      const targetTab = sortElement(child);
      const targetContainer = document.getElementById(
        `tab-content-${targetTab}`
      );
      if (targetContainer) targetContainer.appendChild(child);
    });

    // 4. Hide the original container
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
  const observer = new MutationObserver((mutations) => {
    const settingsForm = document.getElementById("settings-form");

    if (!settingsForm) return;

    if (!document.getElementById("settings-tab-nav")) {
      organizeContent(settingsForm);
    }

    // Watch for injected elements
    Array.from(settingsForm.children).forEach((child) => {
      if (child.tagName === "H1" || child.tagName === "SCRIPT") return;
      if (child.id === "settings-tab-nav") return;
      if (child.id === "settings-tab-content-wrapper") return;

      if (
        child.classList.contains("space-y-8") &&
        child.classList.contains("max-w-4xl")
      )
        return;

      // Determine where it goes
      let targetTab = "general";

      if (
        child.id === "lang-toggle-card" ||
        child.id === "theme-selector-card" ||
        child.id === "visual-engine-panel"
      ) {
        targetTab = "appearance";
      }

      // Route Voice OS
      if (child.id === "hyper-voice-os-panel") {
        targetTab = "voice";
      }

      // Move it
      const container = document.getElementById(`tab-content-${targetTab}`);
      if (container) {
        container.prepend(child);
        const btn = document.querySelector(
          `button[data-tab-id="${targetTab}"]`
        );
        if (btn) btn.style.display = "flex";
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const initialSettings = document.getElementById("settings-form");
  if (initialSettings) {
    organizeContent(initialSettings);
  }
})();
