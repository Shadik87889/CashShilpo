/**
 * CashShilpo Settings Tab Manager & Premium Templates Pack
 * Combines layout organization with 10 World-Class Invoice Templates.
 */

(function () {
  console.log("CashShilpo Settings & Templates: Module Loaded");

  // --- PART 1: PREMIUM TEMPLATES DEFINITION ---
  const premiumTemplates = {
    uber_clean: {
      name: "Uber Clean",
      preview: `<div class="w-full h-full bg-white p-2 flex flex-col justify-between border border-gray-200"><div class="text-2xl font-bold tracking-tighter text-black">INVOICE</div><div class="space-y-1"><div class="h-1 w-full bg-gray-100"></div><div class="h-1 w-2/3 bg-gray-100"></div></div><div class="flex justify-between font-mono text-[8px] font-bold mt-2"><span>TOTAL</span><span>$0.00</span></div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "uber_clean"),
    },
    corporate_navy: {
      name: "Corporate Navy",
      preview: `<div class="w-full h-full bg-white flex flex-col border border-gray-200"><div class="bg-slate-800 h-8 w-full"></div><div class="p-2 space-y-2"><div class="h-1 w-full bg-gray-100"></div><div class="h-1 w-1/2 bg-gray-100"></div></div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "corporate_navy"),
    },
    boutique_serif: {
      name: "Boutique Serif",
      preview: `<div class="w-full h-full bg-[#fdfbf7] p-2 flex flex-col items-center justify-center border border-[#e5e0d8]"><div class="font-serif italic text-xs text-center">Thank You</div><div class="mt-2 h-px w-8 bg-black"></div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "boutique_serif"),
    },
    tech_mono: {
      name: "Tech Mono",
      preview: `<div class="w-full h-full bg-slate-900 p-2 font-mono text-[6px] text-green-400 flex flex-col border border-slate-700"><div>> INVOICE_INIT</div><div class="mt-2">> LOAD_ITEMS...</div><div class="mt-auto">> TOTAL: 100%</div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "tech_mono"),
    },
    modern_grid: {
      name: "Modern Grid",
      preview: `<div class="w-full h-full bg-white p-1 grid grid-cols-2 gap-1 border border-gray-200"><div class="bg-gray-100 h-full rounded"></div><div class="bg-gray-100 h-full rounded"></div><div class="col-span-2 bg-gray-800 h-4 rounded mt-auto"></div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "modern_grid"),
    },
    bold_contrast: {
      name: "Bold Contrast",
      preview: `<div class="w-full h-full bg-white flex flex-col border border-black"><div class="bg-black text-white text-[8px] font-black p-2 text-center uppercase">Invoice</div><div class="p-2 font-black text-xl text-center">$$$</div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "bold_contrast"),
    },
    eco_nature: {
      name: "Eco Nature",
      preview: `<div class="w-full h-full bg-[#f0fdf4] border border-[#bbf7d0] p-2 rounded-lg flex flex-col"><div class="text-green-800 font-bold text-[8px]">Receipt</div><div class="mt-auto h-2 w-full bg-green-600 rounded"></div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "eco_nature"),
    },
    luxury_gold: {
      name: "Luxury Gold",
      preview: `<div class="w-full h-full bg-black border border-yellow-600 p-2 flex flex-col items-center justify-center"><div class="text-yellow-500 font-serif text-[10px]">PREMIUM</div><div class="h-px w-12 bg-yellow-600 my-1"></div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "luxury_gold"),
    },
    classic_print: {
      name: "Classic Print",
      preview: `<div class="w-full h-full bg-white p-2 border-2 border-double border-gray-400 flex flex-col"><div class="text-center font-serif text-[8px] uppercase tracking-widest border-b border-gray-300 pb-1">Invoice</div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "classic_print"),
    },
    compact_retail: {
      name: "Compact Retail",
      preview: `<div class="w-full h-full bg-white p-2 flex flex-col items-center border-t-4 border-blue-500 shadow-sm"><div class="text-[8px] font-bold">STORE</div><div class="text-[6px] text-gray-500">123 Main St</div><div class="mt-2 text-[8px] font-mono">Total: $0.00</div></div>`,
      getBody: (invoice, paymentState) =>
        generatePremiumTemplateHTML(invoice, paymentState, "compact_retail"),
    },
  };

  // Try to inject into the main receiptTemplates object if available in scope
  try {
    if (typeof receiptTemplates !== "undefined") {
      Object.assign(receiptTemplates, premiumTemplates);
      console.log("Premium templates injected successfully.");
    }
  } catch (e) {
    console.warn(
      "Could not inject templates directly into receiptTemplates object.",
    );
  }

  // --- PART 2: TAB UI LOGIC ---
  const TABS = [
    { id: "general", label: "General", icon: "settings" },
    { id: "appearance", label: "Appearance", icon: "palette" },
    { id: "templates", label: "Templates", icon: "layout-template" },
    { id: "voice", label: "Voice OS", icon: "mic-activity" },
    { id: "automation", label: "Automation", icon: "zap" },
  ];

  let currentTab = "general";

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

  function switchTab(tabId) {
    currentTab = tabId;
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

  // --- PART 3: TEMPLATE INJECTION HELPER ---
  // If the templates weren't rendered by the main app, we manually inject them here.
  function injectMissingTemplates(selectorContainer) {
    if (!selectorContainer) return;

    // Check if premium templates are already there
    const hasPremium = selectorContainer.querySelector(
      '[data-template-id="uber_clean"]',
    );
    if (hasPremium) return;

    console.log("Injecting premium template cards into DOM...");

    // Get currently selected template from the DOM if possible
    const currentActive = selectorContainer.querySelector(
      ".template-selector.active",
    );
    const currentActiveId = currentActive
      ? currentActive.dataset.templateId
      : "modern";

    // Generate HTML for new templates
    const newTemplatesHTML = Object.entries(premiumTemplates)
      .map(
        ([key, template]) => `
        <div data-action="select-template" data-template-id="${key}" class="template-selector rounded-lg p-4 bg-bg-secondary ${
          currentActiveId === key ? "active" : ""
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
      `,
      )
      .join("");

    // Append to the grid
    const grid = selectorContainer.querySelector(".grid");
    if (grid) {
      grid.insertAdjacentHTML("beforeend", newTemplatesHTML);
      // Re-init icons for the new elements
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function organizeContent(settingsForm) {
    if (settingsForm.querySelector("#settings-tab-nav")) return;

    const header = settingsForm.querySelector("h1");
    const containerDiv = settingsForm.querySelector(".space-y-8.max-w-4xl");

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

      const title = element.querySelector("h2")?.innerText?.toLowerCase() || "";

      if (
        element.id === "automations-container" ||
        title.includes("automation")
      )
        return "automation";
      if (title.includes("pos layout")) return "appearance";

      // Target the receipt templates section
      if (title.includes("receipt & invoice")) {
        // Attempt to inject templates while moving this element
        const selector = element.querySelector("#receipt-template-selector");
        injectMissingTemplates(selector);
        return "templates";
      }

      if (title.includes("receipt footer")) return "templates";

      return "general";
    };

    Array.from(containerDiv.children).forEach((child) => {
      if (
        child.classList.contains("flex") &&
        child.querySelector('button[data-action="save-settings"]')
      ) {
        document.getElementById("tab-content-general").appendChild(child);
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

    containerDiv.style.display = "none";
    if (window.lucide) window.lucide.createIcons();

    TABS.forEach((tab) => {
      const content = document.getElementById(`tab-content-${tab.id}`);
      const btn = document.querySelector(`button[data-tab-id="${tab.id}"]`);
      if (content && btn && content.children.length === 0) {
        btn.style.display = "none";
      }
    });
  }

  const observer = new MutationObserver((mutations) => {
    const settingsForm = document.getElementById("settings-form");
    if (!settingsForm) return;

    if (!document.getElementById("settings-tab-nav")) {
      organizeContent(settingsForm);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const initialSettings = document.getElementById("settings-form");
  if (initialSettings) {
    organizeContent(initialSettings);
  }

  // --- HTML GENERATOR FOR PREMIUM TEMPLATES ---
  // (Helper function required for getBody)
  function generatePremiumTemplateHTML(invoice, paymentState, style) {
    const { storeInfo } = firestoreData; // Will work if inside module scope or global
    const currency = invoice.currency || appState.currentCurrency;

    // Helpers
    const format = (amt) => currencyUtils.format(amt, currency);
    const date = new Date(invoice.date).toLocaleDateString();

    // Data Prep
    const items = invoice.items || [];
    const subtotal = invoice.subtotalInBaseCurrency;
    const tax = invoice.taxInBaseCurrency;
    const total = invoice.totalInBaseCurrency;
    const discount =
      (invoice.persistentDiscountDetails?.amount || 0) +
      (invoice.manualDiscountInBase || 0);
    const due = invoice.dueAmount || 0;

    const payments = paymentState
      ? paymentState.payments
      : invoice.paymentDetails || [];

    // --- STYLES CONFIGURATION ---
    const styles = {
      uber_clean: {
        container:
          "font-family: 'Inter', sans-serif; color: #000; padding: 40px; max-width: 800px; margin: 0 auto;",
        header:
          "display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px;",
        title:
          "font-size: 48px; font-weight: 900; letter-spacing: -2px; line-height: 1;",
        meta: "text-align: right; font-size: 14px; color: #666;",
        tableHeader:
          "border-bottom: 2px solid #000; padding-bottom: 10px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;",
        itemRow:
          "padding: 15px 0; border-bottom: 1px solid #eee; font-size: 14px;",
        totalSection: "margin-top: 40px; text-align: right;",
        grandTotal: "font-size: 36px; font-weight: 900; margin-top: 10px;",
        accent: "#000",
      },
      corporate_navy: {
        container:
          "font-family: 'Roboto', sans-serif; color: #334155; max-width: 800px; margin: 0 auto; background: #fff;",
        header:
          "background: #0f172a; color: #fff; padding: 40px; display: flex; justify-content: space-between;",
        title:
          "font-size: 32px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase;",
        meta: "text-align: right; font-size: 13px; opacity: 0.8;",
        tableHeader:
          "background: #f1f5f9; padding: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #475569;",
        itemRow:
          "padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;",
        totalSection: "margin-top: 20px; padding: 0 40px; text-align: right;",
        grandTotal: "font-size: 28px; font-weight: 700; color: #0f172a;",
        accent: "#0f172a",
      },
      boutique_serif: {
        container:
          "font-family: 'Playfair Display', serif; color: #444; padding: 50px; max-width: 800px; margin: 0 auto; background: #fdfbf7;",
        header:
          "text-align: center; margin-bottom: 50px; border-bottom: 1px solid #dcdcdc; padding-bottom: 30px;",
        title: "font-size: 42px; font-style: italic; margin-bottom: 10px;",
        meta:
          "font-family: 'Lato', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;",
        tableHeader:
          "font-family: 'Lato', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding-bottom: 5px;",
        itemRow:
          "padding: 20px 0; border-bottom: 1px dashed #dcdcdc; font-size: 16px;",
        totalSection:
          "margin-top: 40px; text-align: center; border-top: 1px solid #000; padding-top: 20px;",
        grandTotal: "font-size: 32px; margin-top: 10px;",
        accent: "#444",
      },
      tech_mono: {
        container:
          "font-family: 'Courier New', monospace; color: #00ff41; background: #0d0208; padding: 40px; max-width: 800px; margin: 0 auto;",
        header:
          "border-bottom: 1px dashed #00ff41; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between;",
        title: "font-size: 24px; font-weight: bold;",
        meta: "text-align: right; font-size: 12px;",
        tableHeader:
          "border-bottom: 1px dashed #00ff41; padding-bottom: 10px; font-size: 14px;",
        itemRow: "padding: 10px 0; font-size: 14px;",
        totalSection:
          "margin-top: 30px; border-top: 1px dashed #00ff41; padding-top: 20px; text-align: right;",
        grandTotal: "font-size: 24px; font-weight: bold;",
        accent: "#00ff41",
      },
      modern_grid: {
        container:
          "font-family: 'Inter', sans-serif; color: #1f2937; padding: 40px; max-width: 800px; margin: 0 auto;",
        header:
          "display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;",
        title: "font-size: 36px; font-weight: 800; color: #111;",
        meta: "font-size: 14px; text-align: right;",
        tableHeader:
          "display: grid; grid-template-columns: 3fr 1fr 1fr 1fr; background: #f3f4f6; padding: 10px; font-weight: 600; border-radius: 6px;",
        itemRow:
          "display: grid; grid-template-columns: 3fr 1fr 1fr 1fr; padding: 15px 10px; border-bottom: 1px solid #e5e7eb;",
        totalSection:
          "margin-top: 30px; display: flex; justify-content: flex-end;",
        grandTotal: "font-size: 24px; font-weight: 800;",
        accent: "#3b82f6",
      },
      bold_contrast: {
        container:
          "font-family: 'Arial Black', sans-serif; color: #000; padding: 40px; max-width: 800px; margin: 0 auto; border: 4px solid #000;",
        header:
          "background: #000; color: #fff; padding: 30px; text-align: center; text-transform: uppercase;",
        title: "font-size: 40px; letter-spacing: -1px;",
        meta:
          "margin-top: 20px; font-family: 'Arial', sans-serif; font-weight: bold; display: flex; justify-content: space-between;",
        tableHeader:
          "border-bottom: 4px solid #000; padding: 10px 0; font-size: 16px; text-transform: uppercase;",
        itemRow:
          "padding: 15px 0; border-bottom: 2px solid #000; font-family: 'Arial', sans-serif; font-weight: bold;",
        totalSection:
          "margin-top: 40px; text-align: right; background: #000; color: #fff; padding: 20px;",
        grandTotal: "font-size: 40px;",
        accent: "#000",
      },
      eco_nature: {
        container:
          "font-family: 'DM Sans', sans-serif; color: #14532d; padding: 40px; max-width: 800px; margin: 0 auto; background: #f0fdf4;",
        header:
          "display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #86efac; padding-bottom: 20px; margin-bottom: 30px;",
        title: "font-size: 30px; font-weight: 700; color: #166534;",
        meta: "font-size: 14px; text-align: right;",
        tableHeader:
          "color: #15803d; font-size: 13px; font-weight: 600; padding-bottom: 10px;",
        itemRow:
          "padding: 12px 0; border-bottom: 1px dashed #86efac; font-size: 15px;",
        totalSection: "margin-top: 30px; text-align: right;",
        grandTotal: "font-size: 28px; font-weight: 700; color: #166534;",
        accent: "#16a34a",
      },
      luxury_gold: {
        container:
          "font-family: 'Cinzel', serif; color: #eab308; background: #000; padding: 60px; max-width: 800px; margin: 0 auto; text-align: center;",
        header:
          "border-bottom: 1px solid #eab308; padding-bottom: 30px; margin-bottom: 40px;",
        title: "font-size: 36px; letter-spacing: 4px;",
        meta:
          "font-family: 'Montserrat', sans-serif; color: #fff; font-size: 12px; margin-top: 10px;",
        tableHeader:
          "font-family: 'Montserrat', sans-serif; color: #ca8a04; font-size: 11px; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 10px;",
        itemRow:
          "font-family: 'Montserrat', sans-serif; color: #fff; padding: 20px 0; border-bottom: 1px solid #222;",
        totalSection:
          "margin-top: 50px; border-top: 1px solid #eab308; padding-top: 30px;",
        grandTotal: "font-size: 32px;",
        accent: "#eab308",
      },
      classic_print: {
        container:
          "font-family: 'Times New Roman', serif; color: #000; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #000;",
        header: "text-align: center; margin-bottom: 30px;",
        title:
          "font-size: 28px; font-weight: bold; text-decoration: underline;",
        meta: "font-size: 14px; margin-top: 10px;",
        tableHeader:
          "border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 5px 0; font-weight: bold;",
        itemRow: "padding: 5px 0; font-size: 14px;",
        totalSection:
          "margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; text-align: right;",
        grandTotal: "font-size: 18px; font-weight: bold;",
        accent: "#000",
      },
      compact_retail: {
        container:
          "font-family: 'Inter', sans-serif; width: 300px; margin: 0 auto; background: #fff; padding: 15px; color: #000;",
        header: "text-align: center; margin-bottom: 15px;",
        title: "font-size: 18px; font-weight: 800;",
        meta: "font-size: 10px; color: #555;",
        tableHeader:
          "font-size: 10px; font-weight: 700; border-bottom: 1px dashed #ccc; padding-bottom: 5px;",
        itemRow:
          "font-size: 11px; padding: 8px 0; border-bottom: 1px solid #f3f4f6;",
        totalSection:
          "margin-top: 15px; border-top: 2px solid #000; padding-top: 10px;",
        grandTotal: "font-size: 16px; font-weight: 800; text-align: right;",
        accent: "#000",
      },
    }[style];

    // Default fallback if style not found
    if (!styles) return "<p>Error: Template style not found.</p>";

    // Grid row rendering depends on the style
    const isGrid = style === "modern_grid";
    const rowClass = isGrid
      ? styles.itemRow
      : `display: flex; justify-content: space-between; ${styles.itemRow}`;
    const headerClass = isGrid
      ? styles.tableHeader
      : `display: flex; justify-content: space-between; ${styles.tableHeader}`;

    // Common Items HTML
    const itemsHTML = items
      .map(
        (item) => `
        <div style="${rowClass}">
            <div style="${isGrid ? "" : "flex: 2;"}">
                ${item.name}
                ${
                  item.isSerialized
                    ? `<div style="font-size: 0.8em; opacity: 0.7;">SN: ${item.serialNumber}</div>`
                    : ""
                }
            </div>
            <div style="${
              isGrid ? "text-align: center;" : "flex: 1; text-align: center;"
            }">${item.qty || 1}</div>
            <div style="${
              isGrid ? "text-align: right;" : "flex: 1; text-align: right;"
            }">${format(item.price)}</div>
            <div style="${
              isGrid
                ? "text-align: right;"
                : "flex: 1; text-align: right; font-weight: bold;"
            }">${format((item.qty || 1) * item.price)}</div>
        </div>
    `,
      )
      .join("");

    return `
    <div style="${styles.container}">
        <div style="${styles.header}">
            <div>
                <div style="${
                  styles.title
                }">${storeInfo.name.toUpperCase()}</div>
                <div style="font-size: 14px; opacity: 0.8;">${
                  storeInfo.address
                }</div>
                <div style="font-size: 14px; opacity: 0.8;">${
                  storeInfo.contact
                }</div>
            </div>
            <div style="${styles.meta}">
                <div>INVOICE #${invoice.id.slice(-6)}</div>
                <div>${date}</div>
            </div>
        </div>

        <div style="${headerClass}">
            <div style="${isGrid ? "" : "flex: 2;"}">ITEM DESCRIPTION</div>
            <div style="${
              isGrid ? "text-align: center;" : "flex: 1; text-align: center;"
            }">QTY</div>
            <div style="${
              isGrid ? "text-align: right;" : "flex: 1; text-align: right;"
            }">PRICE</div>
            <div style="${
              isGrid ? "text-align: right;" : "flex: 1; text-align: right;"
            }">TOTAL</div>
        </div>

        <div>${itemsHTML}</div>

        <div style="${styles.totalSection}">
            <div style="display: inline-block; min-width: 200px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Subtotal:</span> <span>${format(
                  subtotal,
                )}</span></div>
                ${
                  discount > 0
                    ? `<div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: ${
                        styles.accent
                      };"><span>Discount:</span> <span>-${format(
                        discount,
                      )}</span></div>`
                    : ""
                }
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>Tax:</span> <span>${format(
                  tax,
                )}</span></div>
                <div style="${
                  styles.grandTotal
                }; display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #ccc;">
                    <span>TOTAL:</span> <span>${format(total)}</span>
                </div>
                ${
                  due > 0
                    ? `<div style="display: flex; justify-content: space-between; margin-top: 5px; font-weight: bold; color: #dc2626;"><span>DUE:</span> <span>${format(
                        due,
                      )}</span></div>`
                    : ""
                }
            </div>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 12px; opacity: 0.6;">
            <p>${
              storeInfo.settings.receiptFooterText ||
              "Thank you for your business!"
            }</p>
        </div>
    </div>
    `;
  }
})();
