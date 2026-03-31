/**
 * CashShilpo Advanced Tax & VAT Engine
 * Handles complex Tax Inclusive/Exclusive pricing and multiple VAT rates.
 */

window.CashShilpoTax = {
  defaultConfig: {
    taxMode: "exclusive", // 'exclusive' or 'inclusive'
    rates: [
      { id: "tx_std", name: "VAT (Standard)", rate: 15, isDefault: true },
      { id: "tx_red", name: "VAT (Reduced)", rate: 5, isDefault: false },
      { id: "tx_zero", name: "Exempt", rate: 0, isDefault: false },
    ],
  },

  getConfig: function (appSettings) {
    return appSettings?.advancedTax || this.defaultConfig;
  },

  // --- 1. SETTINGS UI GENERATOR ---
  getSettingsHTML: function (currentConfig) {
    const config = currentConfig || this.defaultConfig;

    const rateRows = config.rates
      .map(
        (r) => `
            <div class="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg border border-border-color tax-rate-row" data-id="${
              r.id
            }">
                <div class="flex-grow">
                    <input type="text" class="form-input w-full text-sm tax-name" value="${
                      r.name
                    }" placeholder="Tax Name (e.g. VAT)">
                </div>
                <div class="w-32">
                    <div class="relative">
                        <input type="number" step="0.1" class="form-input w-full text-sm tax-rate" value="${
                          r.rate
                        }" placeholder="Rate">
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">%</span>
                    </div>
                </div>
                <div class="w-24 text-center">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="radio" name="defaultTaxRate" class="form-radio h-4 w-4 text-accent tax-default" ${
                          r.isDefault ? "checked" : ""
                        }>
                        <span class="ml-2 text-xs text-text-secondary">Default</span>
                    </label>
                </div>
                <button type="button" class="btn btn-danger-secondary p-2 h-auto remove-tax-btn"><i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i></button>
            </div>
        `,
      )
      .join("");

    return `
            <div class="glass-pane p-6 rounded-lg" id="advanced-tax-settings-container">
                <h2 class="text-xl font-semibold text-text-primary border-b border-border-color pb-4 mb-4 flex items-center gap-2">
                    <i data-lucide="calculator" class="text-accent"></i> Advanced VAT & Tax Management
                </h2>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-text-secondary mb-2">Global Pricing Mode</label>
                        <div class="flex gap-4">
                            <label class="flex items-center p-3 border border-border-color rounded-lg cursor-pointer hover:bg-bg-tertiary flex-1 ${
                              config.taxMode === "exclusive"
                                ? "bg-accent/10 border-accent"
                                : ""
                            }" id="tax-mode-exclusive-label">
                                <input type="radio" name="globalTaxMode" value="exclusive" class="form-radio h-4 w-4 text-accent hidden" ${
                                  config.taxMode === "exclusive"
                                    ? "checked"
                                    : ""
                                }>
                                <div class="ml-2">
                                    <p class="font-medium text-text-primary">Tax Exclusive (Added at checkout)</p>
                                    <p class="text-xs text-text-secondary mt-0.5">Product prices exclude VAT. VAT is added on top during sale.</p>
                                </div>
                            </label>
                            <label class="flex items-center p-3 border border-border-color rounded-lg cursor-pointer hover:bg-bg-tertiary flex-1 ${
                              config.taxMode === "inclusive"
                                ? "bg-accent/10 border-accent"
                                : ""
                            }" id="tax-mode-inclusive-label">
                                <input type="radio" name="globalTaxMode" value="inclusive" class="form-radio h-4 w-4 text-accent hidden" ${
                                  config.taxMode === "inclusive"
                                    ? "checked"
                                    : ""
                                }>
                                <div class="ml-2">
                                    <p class="font-medium text-text-primary">Tax Inclusive (Included in price)</p>
                                    <p class="text-xs text-text-secondary mt-0.5">Product prices already include VAT. Calculated backward.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="block text-sm font-medium text-text-secondary">Tax Rates</label>
                            <button type="button" id="add-tax-rate-btn" class="btn btn-secondary btn-sm"><i data-lucide="plus" class="w-4 h-4 mr-2"></i>Add Rate</button>
                        </div>
                        <div id="tax-rates-list" class="space-y-2">
                            ${rateRows}
                        </div>
                    </div>
                </div>
            </div>
        `;
  },

  bindSettingsEvents: function () {
    const container = document.getElementById(
      "advanced-tax-settings-container",
    );
    if (!container) return;

    // Toggle UI for mode
    const radios = container.querySelectorAll('input[name="globalTaxMode"]');
    radios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        container
          .querySelectorAll("label")
          .forEach((l) => l.classList.remove("bg-accent/10", "border-accent"));
        e.target
          .closest("label")
          .classList.add("bg-accent/10", "border-accent");
      });
    });

    // Add Rate
    const addBtn = container.querySelector("#add-tax-rate-btn");
    const list = container.querySelector("#tax-rates-list");
    addBtn.addEventListener("click", () => {
      const newId = `tx_${Date.now()}`;
      const row = document.createElement("div");
      row.className =
        "flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg border border-border-color tax-rate-row";
      row.dataset.id = newId;
      row.innerHTML = `
                <div class="flex-grow"><input type="text" class="form-input w-full text-sm tax-name" placeholder="Tax Name (e.g. VAT)"></div>
                <div class="w-32"><div class="relative"><input type="number" step="0.1" class="form-input w-full text-sm tax-rate" placeholder="Rate"><span class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">%</span></div></div>
                <div class="w-24 text-center"><label class="inline-flex items-center cursor-pointer"><input type="radio" name="defaultTaxRate" class="form-radio h-4 w-4 text-accent tax-default"><span class="ml-2 text-xs text-text-secondary">Default</span></label></div>
                <button type="button" class="btn btn-danger-secondary p-2 h-auto remove-tax-btn"><i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i></button>
            `;
      list.appendChild(row);
      if (window.lucide) window.lucide.createIcons();
    });

    // Remove Rate
    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".remove-tax-btn");
      if (btn) btn.closest(".tax-rate-row").remove();
    });
  },

  extractSettingsData: function (documentObj) {
    const container = documentObj.getElementById(
      "advanced-tax-settings-container",
    );
    if (!container) return null;

    const taxMode = container.querySelector(
      'input[name="globalTaxMode"]:checked',
    ).value;
    const rates = [];
    container.querySelectorAll(".tax-rate-row").forEach((row) => {
      const name = row.querySelector(".tax-name").value.trim();
      const rate = parseFloat(row.querySelector(".tax-rate").value) || 0;
      if (name) {
        rates.push({
          id: row.dataset.id,
          name: name,
          rate: rate,
          isDefault: row.querySelector(".tax-default").checked,
        });
      }
    });

    // Ensure at least one default
    if (rates.length > 0 && !rates.some((r) => r.isDefault)) {
      rates[0].isDefault = true;
    }

    return { taxMode, rates };
  },

  // --- 2. PRODUCT UI GENERATOR ---
  getProductFormHTML: function (productData, appSettings) {
    const config = this.getConfig(appSettings);
    const pTaxRateId = productData.taxRateId || "";
    const pTaxMode = productData.taxMode || "inherit";

    const rateOptions = config.rates
      .map(
        (r) =>
          `<option value="${r.id}" ${
            pTaxRateId === r.id || (pTaxRateId === "" && r.isDefault)
              ? "selected"
              : ""
          }>${r.name} (${r.rate}%)</option>`,
      )
      .join("");

    return `
            <div class="grid grid-cols-2 gap-4 mt-4 p-4 border border-border-color rounded-lg bg-bg-secondary" id="advanced-product-tax-container">
                <div class="col-span-2"><p class="text-sm font-semibold text-text-primary mb-2">Tax/VAT Settings</p></div>
                <div>
                    <label class="block text-xs font-medium text-text-secondary mb-1">Applicable Tax Rate</label>
                    <select name="adv_taxRateId" class="form-select w-full text-sm">
                        <option value="exempt" ${
                          pTaxRateId === "exempt" ? "selected" : ""
                        }>None / Exempt (0%)</option>
                        ${rateOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-text-secondary mb-1">Pricing Mode Override</label>
                    <select name="adv_taxMode" class="form-select w-full text-sm">
                        <option value="inherit" ${
                          pTaxMode === "inherit" ? "selected" : ""
                        }>Inherit Global (${config.taxMode})</option>
                        <option value="exclusive" ${
                          pTaxMode === "exclusive" ? "selected" : ""
                        }>Force Tax Exclusive</option>
                        <option value="inclusive" ${
                          pTaxMode === "inclusive" ? "selected" : ""
                        }>Force Tax Inclusive</option>
                    </select>
                </div>
            </div>
        `;
  },

  extractProductData: function (formData) {
    const taxRateId = formData.get("adv_taxRateId");
    const taxMode = formData.get("adv_taxMode");
    if (taxRateId) {
      return { taxRateId, taxMode };
    }
    return {};
  },

  // --- 3. CORE CALCULATION ENGINE ---
  calculateCart: function (cartItems, manualDiscountObj, appSettings) {
    const config = this.getConfig(appSettings);
    let subtotalBase = 0; // Sum of prices before tax
    let totalTax = 0;
    let totalDisplay = 0; // Sum of final prices (Price * Qty)
    let taxBreakdown = {};

    // Calculate item by item
    cartItems.forEach((item) => {
      // 1. Determine Rate
      let rateObj = null;
      if (item.taxRateId && item.taxRateId !== "exempt") {
        rateObj = config.rates.find((r) => r.id === item.taxRateId);
      } else if (item.taxRateId !== "exempt") {
        rateObj = config.rates.find((r) => r.isDefault);
      }
      const ratePercent = rateObj ? rateObj.rate : 0;
      const rateDecimal = ratePercent / 100;
      const rateName = rateObj ? rateObj.name : "Exempt";

      // 2. Determine Mode
      const mode =
        item.taxMode && item.taxMode !== "inherit"
          ? item.taxMode
          : config.taxMode;

      // 3. Apply Line Item Discount first
      let effectivePrice =
        item.originalPrice !== undefined ? item.originalPrice : item.price;
      if (item.discount && item.discount.value > 0) {
        if (item.discount.type === "percent") {
          effectivePrice = effectivePrice * (1 - item.discount.value / 100);
        } else {
          effectivePrice = Math.max(0, effectivePrice - item.discount.value); // Assuming fixed discount is in matching currency
        }
      }

      const qty = item.qty || 1;
      const lineTotalRaw = effectivePrice * qty;
      totalDisplay += lineTotalRaw;

      let itemBasePrice, itemTaxAmount;

      if (rateDecimal === 0) {
        itemBasePrice = lineTotalRaw;
        itemTaxAmount = 0;
      } else if (mode === "inclusive") {
        // Price includes tax. Base = Total / (1 + Rate)
        itemBasePrice = lineTotalRaw / (1 + rateDecimal);
        itemTaxAmount = lineTotalRaw - itemBasePrice;
      } else {
        // Price excludes tax. Tax is added on top.
        itemBasePrice = lineTotalRaw;
        itemTaxAmount = lineTotalRaw * rateDecimal;
      }

      // Temporarily store these for global discount proportional distribution
      item._tempBase = itemBasePrice;
      item._tempTax = itemTaxAmount;
      item._tempRateName = `${rateName} (${ratePercent}%)`;
    });

    // Apply Global / Manual Discount (Pro-rated)
    let finalDiscountAmountBase = 0;
    let finalSubtotal = 0;
    let finalTotalTax = 0;

    // Calculate Total Base before global discount
    const initialTotalBase = cartItems.reduce(
      (sum, item) => sum + item._tempBase,
      0,
    );
    const initialTotalWithTax = cartItems.reduce(
      (sum, item) => sum + item._tempBase + item._tempTax,
      0,
    );

    if (manualDiscountObj && manualDiscountObj.value > 0) {
      if (manualDiscountObj.type === "percent") {
        finalDiscountAmountBase =
          initialTotalWithTax * (manualDiscountObj.value / 100);
      } else {
        finalDiscountAmountBase = manualDiscountObj.value;
      }
    }

    // Distribute discount and calculate finals
    const discountRatio =
      initialTotalWithTax > 0
        ? (initialTotalWithTax - finalDiscountAmountBase) / initialTotalWithTax
        : 1;

    cartItems.forEach((item) => {
      const discountedBase = item._tempBase * discountRatio;
      const discountedTax = item._tempTax * discountRatio;

      finalSubtotal += discountedBase;
      finalTotalTax += discountedTax;

      if (discountedTax > 0) {
        taxBreakdown[item._tempRateName] =
          (taxBreakdown[item._tempRateName] || 0) + discountedTax;
      }
    });

    return {
      subtotalBase: finalSubtotal,
      taxAmount: finalTotalTax,
      totalDiscount: finalDiscountAmountBase,
      grandTotal: finalSubtotal + finalTotalTax,
      taxBreakdown: taxBreakdown,
    };
  },
};
