(function () {
  console.log("CashShilpo Settings Tabs: Module Loaded");

  // 1. INJECT SCOPED CSS (Guarantees padding, gaps & tabs work without relying on JIT compilation)
  function injectSettingsStyles() {
    const styleId = "cashshilpo-settings-scoped-styles";
    if (document.getElementById(styleId)) return;

    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = `
      /* --- STRICTLY SCOPED TO SETTINGS VIEW (Zero impact on other sections) --- */
      #settings-form {
        padding: 0.5rem 0.25rem 6rem 0.25rem !important;
        box-sizing: border-box !important;
      }

      /* Modern Segmented Tab Bar */
      #settings-tab-scroller {
        width: 100% !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding-bottom: 0.75rem !important;
        margin-bottom: 1.25rem !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      }
      #settings-tab-scroller::-webkit-scrollbar {
        display: none !important;
      }

      #settings-tab-nav {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        background: #141416 !important;
        padding: 0.35rem !important;
        border-radius: 9999px !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        white-space: nowrap !important;
      }

      .settings-tab-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.45rem !important;
        padding: 0.6rem 1.15rem !important;
        border-radius: 9999px !important;
        font-size: 0.825rem !important;
        font-weight: 600 !important;
        color: #9ca3af !important;
        background: transparent !important;
        border: 1px solid transparent !important;
        white-space: nowrap !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        flex-shrink: 0 !important;
      }
      .settings-tab-btn:hover {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.06) !important;
      }
      .settings-tab-btn.active {
        color: #ffffff !important;
        background: #007bff !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
        box-shadow: 0 4px 14px rgba(0, 123, 255, 0.45) !important;
      }
      .settings-tab-btn i {
        width: 15px !important;
        height: 15px !important;
        flex-shrink: 0 !important;
      }

      /* Tab Content Containers: Vertical Spacing Between Cards */
      #settings-tab-content-wrapper > div {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.25rem !important;
        padding: 0 0.25rem !important;
        box-sizing: border-box !important;
      }
      #settings-tab-content-wrapper > div.hidden {
        display: none !important;
      }

      /* Restored Rich Card Padding and Rounded Corners */
      #settings-tab-content-wrapper .glass-pane,
      #settings-tab-content-wrapper .visual-engine-card,
      #settings-tab-content-wrapper #theme-selector-card {
        background: linear-gradient(145deg, #18181b 0%, #121214 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 1.35rem !important;
        padding: 1.35rem !important;
        margin-bottom: 0 !important;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45) !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }

      /* Section Headings inside Cards */
      #settings-tab-content-wrapper h2,
      #settings-tab-content-wrapper h3,
      #settings-tab-content-wrapper h4 {
        font-size: 1.05rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        margin-bottom: 0.35rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }

      /* Form Controls with Guaranteed Mobile Sizing */
      #settings-tab-content-wrapper input[type="text"],
      #settings-tab-content-wrapper input[type="number"],
      #settings-tab-content-wrapper select,
      #settings-tab-content-wrapper textarea {
        background-color: #0a0a0a !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 0.75rem !important;
        color: #f3f4f6 !important;
        padding: 0.65rem 0.85rem !important;
        font-size: 0.875rem !important;
        box-sizing: border-box !important;
        width: 100% !important;
        outline: none !important;
      }
      #settings-tab-content-wrapper select {
        height: 44px !important;
      }

      /* Save Button Wrapper */
      #settings-tab-content-wrapper .settings-save-bar {
        display: flex !important;
        justify-content: flex-end !important;
        padding-top: 1rem !important;
        margin-top: 0.5rem !important;
        border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
      }
      #settings-tab-content-wrapper button[data-action="save-settings"] {
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
        color: #ffffff !important;
        font-weight: 700 !important;
        border-radius: 0.75rem !important;
        padding: 0.75rem 1.75rem !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4) !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.5rem !important;
        min-height: 46px !important;
      }
      @media (max-width: 640px) {
        #settings-tab-content-wrapper button[data-action="save-settings"] {
          width: 100% !important;
          min-height: 48px !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  injectSettingsStyles();

  // Configuration for tabs
  const TABS = [
    { id: "general", label: "General", icon: "settings" },
    { id: "appearance", label: "Appearance", icon: "palette" },
    { id: "templates", label: "Templates", icon: "layout-template" },
    { id: "voice", label: "Voice OS", icon: "mic" },
    { id: "automation", label: "Automation", icon: "zap" },
  ];

  let currentTab = "general";

  // Modern Scrollable Tab Navigation UI
  function createTabsUI() {
    const scrollerWrapper = document.createElement("div");
    scrollerWrapper.id = "settings-tab-scroller";

    const navContainer = document.createElement("div");
    navContainer.id = "settings-tab-nav";

    TABS.forEach((tab) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `settings-tab-btn ${
        currentTab === tab.id ? "active" : ""
      }`;
      btn.dataset.tabId = tab.id;

      const icon = document.createElement("i");
      icon.dataset.lucide = tab.icon;
      btn.appendChild(icon);

      const labelSpan = document.createElement("span");
      labelSpan.textContent = tab.label;
      btn.appendChild(labelSpan);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab(tab.id);
        btn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      });

      navContainer.appendChild(btn);
    });

    scrollerWrapper.appendChild(navContainer);
    return scrollerWrapper;
  }

  function createTabContainers() {
    const wrapper = document.createElement("div");
    wrapper.id = "settings-tab-content-wrapper";

    TABS.forEach((tab) => {
      const container = document.createElement("div");
      container.id = `tab-content-${tab.id}`;
      container.className = `${currentTab === tab.id ? "block" : "hidden"}`;
      wrapper.appendChild(container);
    });

    return wrapper;
  }

  function switchTab(tabId) {
    currentTab = tabId;

    const nav = document.getElementById("settings-tab-nav");
    if (nav) {
      Array.from(nav.children).forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tabId === tabId);
      });
    }

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

    const scrollEl = document.getElementById("workspace-content");
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  function organizeContent(settingsForm) {
    if (settingsForm.querySelector("#settings-tab-nav")) return;

    const header = settingsForm.querySelector("h1");
    const containerDiv =
      settingsForm.querySelector(".space-y-8") ||
      settingsForm.querySelector(".space-y-6");

    if (!header || !containerDiv) return;

    const tabsNav = createTabsUI();
    const tabsContent = createTabContainers();

    header.insertAdjacentElement("afterend", tabsNav);
    header.parentNode.insertBefore(tabsContent, containerDiv);

    const sortElement = (element) => {
      if (element.id === "lang-toggle-card") return "appearance";
      if (element.id === "theme-selector-card") return "appearance";
      if (element.id === "visual-engine-panel") return "appearance";
      if (element.id === "hyper-voice-os-panel") return "voice";

      if (
        element.id === "automations-container" ||
        element.querySelector("#automations-container")
      ) {
        return "automation";
      }
      if (element.querySelector("#pos-layout-selector")) return "appearance";
      if (
        element.querySelector("#receipt-template-selector") ||
        element.querySelector("textarea[name='receiptFooterText']")
      ) {
        return "templates";
      }

      const title = element.querySelector("h2")?.innerText?.toLowerCase() || "";
      if (title.includes("automation") || title.includes("অটোমেশন"))
        return "automation";
      if (title.includes("pos layout") || title.includes("pos লেআউট"))
        return "appearance";
      if (
        title.includes("receipt") ||
        title.includes("রিসিপ্ট") ||
        title.includes("ইনভয়েস")
      )
        return "templates";

      return "general";
    };

    let saveButtonTemplate = null;

    Array.from(containerDiv.children).forEach((child) => {
      if (child.querySelector('button[data-action="save-settings"]')) {
        saveButtonTemplate = child;
        return;
      }

      if (
        child.id === "permissions-container" ||
        child
          .querySelector("h2")
          ?.innerText?.toLowerCase()
          .includes("role permissions")
      ) {
        return;
      }

      const targetTab = sortElement(child);
      const targetContainer = document.getElementById(
        `tab-content-${targetTab}`,
      );
      if (targetContainer) targetContainer.appendChild(child);
    });

    // Distribute Save Button to all tabs
    if (saveButtonTemplate) {
      TABS.forEach((tab) => {
        const tabContainer = document.getElementById(`tab-content-${tab.id}`);
        if (tabContainer) {
          const btnWrapper = saveButtonTemplate.cloneNode(true);
          btnWrapper.className = "settings-save-bar";
          tabContainer.appendChild(btnWrapper);
        }
      });
      saveButtonTemplate.remove();
    }

    containerDiv.style.display = "none";
    if (window.lucide) window.lucide.createIcons();

    // Hide empty tab buttons
    TABS.forEach((tab) => {
      const content = document.getElementById(`tab-content-${tab.id}`);
      const btn = document.querySelector(`button[data-tab-id="${tab.id}"]`);
      if (content && btn && content.children.length <= 1) {
        btn.style.display = "none";
      }
    });
  }

  const observer = new MutationObserver(() => {
    const settingsForm = document.getElementById("settings-form");
    if (!settingsForm) return;

    if (!document.getElementById("settings-tab-nav")) {
      organizeContent(settingsForm);
    }

    Array.from(settingsForm.children).forEach((child) => {
      if (["H1", "SCRIPT"].includes(child.tagName)) return;
      if (
        [
          "settings-tab-scroller",
          "settings-tab-nav",
          "settings-tab-content-wrapper",
        ].includes(child.id)
      )
        return;
      if (
        child.classList.contains("space-y-8") ||
        child.classList.contains("space-y-6")
      )
        return;

      let targetTab = "general";
      if (
        [
          "lang-toggle-card",
          "theme-selector-card",
          "visual-engine-panel",
        ].includes(child.id)
      )
        targetTab = "appearance";
      if (child.id === "hyper-voice-os-panel") targetTab = "voice";

      const targetContainer = document.getElementById(
        `tab-content-${targetTab}`,
      );
      if (targetContainer) {
        targetContainer.prepend(child);
        const btn = document.querySelector(
          `button[data-tab-id="${targetTab}"]`,
        );
        if (btn) btn.style.display = "inline-flex";
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const initialSettings = document.getElementById("settings-form");
  if (initialSettings) {
    organizeContent(initialSettings);
  }
})();
