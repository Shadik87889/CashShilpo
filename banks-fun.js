/**
 * BANKING FUN MODULE - BANGLADESH EDITION (ENHANCED & LOCALIZED)
 * * This module injects advanced banking capabilities into the existing POS system.
 * It simulates a complete list of Bangladeshi banks and integrates seamlessly
 * with the existing payment flow by leveraging DOM manipulation and Event Delegation.
 * * * FIX APPLIED: Now supports Bangla localization detection to prevent buttons
 * from disappearing when language is switched.
 */

(function () {
  // --- 1. DATA: Comprehensive List of Banks in Bangladesh ---
  let bdBanks = [
    // State-owned Commercial Banks (SCBs)
    {
      id: "sonali",
      name: "Sonali Bank",
      type: "State-owned",
      color: "#fcd34d",
    },
    {
      id: "janata",
      name: "Janata Bank",
      type: "State-owned",
      color: "#ef4444",
    },
    {
      id: "agrani",
      name: "Agrani Bank",
      type: "State-owned",
      color: "#10b981",
    },
    {
      id: "rupali",
      name: "Rupali Bank",
      type: "State-owned",
      color: "#3b82f6",
    },
    {
      id: "bdbl",
      name: "Bangladesh Development Bank",
      type: "State-owned",
      color: "#6366f1",
    },
    { id: "basic", name: "BASIC Bank", type: "State-owned", color: "#8b5cf6" },

    // Private Commercial Banks (PCBs)
    { id: "brac", name: "BRAC Bank", type: "Private", color: "#2563eb" },
    {
      id: "dbbl",
      name: "Dutch-Bangla Bank (DBBL)",
      type: "Private",
      color: "#16a34a",
    },
    { id: "city", name: "The City Bank", type: "Private", color: "#dc2626" },
    {
      id: "ebl",
      name: "Eastern Bank (EBL)",
      type: "Private",
      color: "#f59e0b",
    },
    { id: "prime", name: "Prime Bank", type: "Private", color: "#059669" },
    { id: "pubali", name: "Pubali Bank", type: "Private", color: "#0891b2" },
    {
      id: "ucb",
      name: "United Commercial Bank (UCB)",
      type: "Private",
      color: "#d97706",
    },
    { id: "dhaka", name: "Dhaka Bank", type: "Private", color: "#4f46e5" },
    {
      id: "mutual",
      name: "Mutual Trust Bank",
      type: "Private",
      color: "#be185d",
    },
    { id: "nbl", name: "National Bank", type: "Private", color: "#b91c1c" },
    { id: "one", name: "ONE Bank", type: "Private", color: "#b45309" },
    { id: "trust", name: "Trust Bank", type: "Private", color: "#15803d" },
    { id: "ific", name: "IFIC Bank", type: "Private", color: "#7c2d12" },
    {
      id: "mercantile",
      name: "Mercantile Bank",
      type: "Private",
      color: "#4338ca",
    },
    {
      id: "southeast",
      name: "Southeast Bank",
      type: "Private",
      color: "#c2410c",
    },
    { id: "premier", name: "Premier Bank", type: "Private", color: "#0e7490" },
    { id: "jamuna", name: "Jamuna Bank", type: "Private", color: "#be123c" },
    { id: "nrb", name: "NRB Bank", type: "Private", color: "#1d4ed8" },
    {
      id: "modhumoti",
      name: "Modhumoti Bank",
      type: "Private",
      color: "#a21caf",
    },
    { id: "midland", name: "Midland Bank", type: "Private", color: "#374151" },
    { id: "meghna", name: "Meghna Bank", type: "Private", color: "#047857" },

    // Islamic Banks
    {
      id: "islami",
      name: "Islami Bank Bangladesh",
      type: "Islamic",
      color: "#166534",
    },
    {
      id: "al-arafah",
      name: "Al-Arafah Islami Bank",
      type: "Islamic",
      color: "#15803d",
    },
    { id: "exim", name: "EXIM Bank", type: "Islamic", color: "#065f46" },
    {
      id: "social",
      name: "Social Islami Bank",
      type: "Islamic",
      color: "#ea580c",
    },
    {
      id: "shahjalal",
      name: "Shahjalal Islami Bank",
      type: "Islamic",
      color: "#0f766e",
    },
    {
      id: "first-security",
      name: "First Security Islami Bank",
      type: "Islamic",
      color: "#1e40af",
    },
    { id: "union", name: "Union Bank", type: "Islamic", color: "#b91c1c" },
    {
      id: "global-islami",
      name: "Global Islami Bank",
      type: "Islamic",
      color: "#4338ca",
    },

    // Foreign Commercial Banks (FCBs)
    {
      id: "scb",
      name: "Standard Chartered",
      type: "Foreign",
      color: "#0f172a",
    },
    { id: "hsbc", name: "HSBC", type: "Foreign", color: "#dc2626" },
    { id: "citi", name: "Citi Bank N.A.", type: "Foreign", color: "#2563eb" },
    { id: "woori", name: "Woori Bank", type: "Foreign", color: "#0284c7" },
    {
      id: "sbi",
      name: "State Bank of India",
      type: "Foreign",
      color: "#1e3a8a",
    },
    { id: "habib", name: "Habib Bank", type: "Foreign", color: "#065f46" },
  ];

  // --- 2. STATE: Context Management ---
  let currentFlow = "transfer"; // 'transfer', 'card', 'due-card', 'due-transfer'

  // --- Constants for Localization ---
  const POS_TITLES = ["Process Payment", "পেমেন্ট প্রক্রিয়া"];
  const DUE_TITLES = [
    "Receive Due Payment",
    "বকেয়া পেমেন্ট গ্রহণ করুন",
    "Receive Payment",
    "পেমেন্ট গ্রহণ",
  ];

  // --- 3. LOGIC: Bank Selection Modal & Add Bank ---

  function createBankModal() {
    const modalId = "bank-selection-modal";
    if (document.getElementById(modalId))
      return document.getElementById(modalId);

    const overlay = document.createElement("div");
    overlay.id = modalId;
    overlay.className =
      "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 pointer-events-none";

    overlay.innerHTML = `
            <div class="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-2xl transform scale-95 transition-transform duration-300 flex flex-col max-h-[85vh]">
                <!-- Header -->
                <div class="p-5 border-b border-[var(--border-color)] flex justify-between items-center">
                    <div>
                        <h3 id="bank-modal-title" class="text-xl font-bold text-[var(--text-primary)]">Select Bank</h3>
                        <p id="bank-modal-subtitle" class="text-sm text-[var(--text-secondary)]">Choose the bank for this transaction.</p>
                    </div>
                    <div class="flex gap-2">
                        <button id="add-new-bank-btn" class="btn btn-sm btn-primary flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                             Add Bank
                        </button>
                        <button id="close-bank-modal" class="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                </div>

                <!-- Add Bank Form (Hidden by default) -->
                <div id="add-bank-form" class="hidden p-4 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                         <input type="text" id="new-bank-name" placeholder="Bank Name" class="form-input w-full text-sm">
                         <select id="new-bank-type" class="form-select w-full text-sm">
                            <option value="Private">Private</option>
                            <option value="State-owned">State-owned</option>
                            <option value="Islamic">Islamic</option>
                            <option value="Foreign">Foreign</option>
                            <option value="MFS">Mobile Banking</option>
                         </select>
                         <button id="save-new-bank-btn" class="btn btn-success text-sm text-white">Save Bank</button>
                    </div>
                </div>

                <!-- Search & Filter -->
                <div class="p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 backdrop-blur-md sticky top-0 z-10">
                    <div class="flex gap-3">
                        <div class="relative flex-grow">
                            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input type="text" id="bank-search" placeholder="Search banks..." class="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none">
                        </div>
                        <select id="bank-type-filter" class="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-3 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent)]">
                            <option value="all">All Types</option>
                            <option value="Private">Private</option>
                            <option value="State-owned">State-owned</option>
                            <option value="Islamic">Islamic</option>
                            <option value="Foreign">Foreign</option>
                            <option value="MFS">Mobile Banking</option>
                        </select>
                    </div>
                </div>

                <!-- Bank Grid -->
                <div id="bank-list-grid" class="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <!-- Banks will be injected here -->
                </div>
            </div>
        `;

    document.body.appendChild(overlay);

    // Bind Events
    const closeBtn = overlay.querySelector("#close-bank-modal");
    closeBtn.addEventListener("click", closeBankModal);

    const searchInput = overlay.querySelector("#bank-search");
    const filterSelect = overlay.querySelector("#bank-type-filter");

    // Add Bank Toggle
    const addBankToggle = overlay.querySelector("#add-new-bank-btn");
    const addBankForm = overlay.querySelector("#add-bank-form");
    addBankToggle.addEventListener("click", () => {
      addBankForm.classList.toggle("hidden");
      if (!addBankForm.classList.contains("hidden")) {
        overlay.querySelector("#new-bank-name").focus();
      }
    });

    // Save New Bank Logic
    const saveBankBtn = overlay.querySelector("#save-new-bank-btn");
    saveBankBtn.addEventListener("click", () => {
      const name = overlay.querySelector("#new-bank-name").value.trim();
      const type = overlay.querySelector("#new-bank-type").value;

      if (!name) return alert("Bank name is required"); // Basic validation

      const id = name.toLowerCase().replace(/\s+/g, "-");
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16); // Random color

      const newBank = { id, name, type, color };
      bdBanks.push(newBank); // Add to local list

      // Refresh grid
      renderBanks(overlay.querySelector("#bank-list-grid"), bdBanks);

      // Reset and hide form
      overlay.querySelector("#new-bank-name").value = "";
      addBankForm.classList.add("hidden");
    });

    const filterBanks = () => {
      const query = searchInput.value.toLowerCase();
      const type = filterSelect.value;
      const container = overlay.querySelector("#bank-list-grid");

      const filtered = bdBanks.filter((b) => {
        const matchesName = b.name.toLowerCase().includes(query);
        const matchesType = type === "all" || b.type === type;
        return matchesName && matchesType;
      });

      renderBanks(container, filtered);
    };

    searchInput.addEventListener("input", filterBanks);
    filterSelect.addEventListener("change", filterBanks);

    return overlay;
  }

  function renderBanks(container, banks) {
    if (banks.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-8 text-[var(--text-secondary)]">No banks found.</div>`;
      return;
    }

    container.innerHTML = banks
      .map(
        (bank) => `
            <button class="bank-select-btn group relative flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--accent)] transition-all duration-200 text-left" data-bank-name="${
              bank.name
            }">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md group-hover:scale-110 transition-transform" style="background-color: ${
                  bank.color
                }">
                    ${bank.name.substring(0, 2).toUpperCase()}
                </div>
                <div class="flex-grow min-w-0">
                    <p class="text-sm font-semibold text-[var(--text-primary)] truncate">${
                      bank.name
                    }</p>
                    <p class="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">${
                      bank.type
                    }</p>
                </div>
                <div class="absolute inset-0 border-2 border-[var(--accent)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </button>
        `,
      )
      .join("");

    container.querySelectorAll(".bank-select-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const bankName = e.currentTarget.dataset.bankName;
        selectBank(bankName);
      });
    });
  }

  function openBankModal(flow = "transfer") {
    currentFlow = flow; // Set the context

    let modal = document.getElementById("bank-selection-modal");
    if (!modal) modal = createBankModal();

    // Update Title based on flow
    const titleEl = modal.querySelector("#bank-modal-title");
    const subtitleEl = modal.querySelector("#bank-modal-subtitle");

    if (currentFlow === "card" || currentFlow === "due-card") {
      titleEl.textContent = "Select POS Terminal (Bank)";
      subtitleEl.textContent =
        "Which bank terminal is being used for this card payment?";
    } else {
      titleEl.textContent = "Select Bank";
      subtitleEl.textContent = "Choose the bank for this transfer.";
    }

    // Reset Search
    modal.querySelector("#bank-search").value = "";
    modal.querySelector("#bank-type-filter").value = "all";
    renderBanks(modal.querySelector("#bank-list-grid"), bdBanks);

    // Animation
    modal.classList.remove("pointer-events-none", "opacity-0");
    modal.querySelector("div").classList.remove("scale-95");
    modal.querySelector("div").classList.add("scale-100");
  }

  function closeBankModal() {
    const modal = document.getElementById("bank-selection-modal");
    if (!modal) return;

    modal.classList.add("pointer-events-none", "opacity-0");
    modal.querySelector("div").classList.remove("scale-100");
    modal.querySelector("div").classList.add("scale-95");
  }

  // --- 4. INTEGRATION: Hook into Payment Flow ---

  function selectBank(bankName) {
    // We need to identify WHICH modal is active (POS or Due Payment)
    // FIX: Check for both English and Bangla titles in internalText or query
    const activeModals = Array.from(
      document.querySelectorAll(".modal-content"),
    );

    const posModal = activeModals.find((m) => {
      const text = m.innerText || "";
      return POS_TITLES.some((title) => text.includes(title));
    });

    const dueModal = activeModals.find((m) => {
      const text = m.innerText || "";
      return DUE_TITLES.some((title) => text.includes(title));
    });

    let targetModal = null;
    let methodString = "";

    // Determine Context based on currentFlow
    if (currentFlow === "card" || currentFlow === "transfer") {
      targetModal = posModal;
    } else {
      targetModal = dueModal;
    }

    if (targetModal) {
      console.log(
        `[Banking] Selected Bank: ${bankName} for Flow: ${currentFlow}`,
      );

      // Construct method string
      if (currentFlow.includes("card")) {
        methodString = `Card: ${bankName}`;
      } else {
        methodString = `Bank: ${bankName}`;
      }

      // --- 1. Handle Updating the Form Data (The "Logic") ---
      if (targetModal === posModal) {
        // For POS, we trigger the existing hidden button logic which index.html listens to
        const tempBtn = document.createElement("button");
        tempBtn.dataset.paymentAction = "set-method";
        tempBtn.dataset.method = methodString;
        tempBtn.style.display = "none";
        targetModal.appendChild(tempBtn);
        tempBtn.click();
        tempBtn.remove();
      } else {
        // For Due Payment, we need to update the hidden <select> we replaced OR
        // find the form and update its state manually since we hid the original selector
        const form = targetModal.querySelector("form");
        if (form) {
          const select = form.querySelector('select[name="paymentMethod"]');

          // If original select exists, try to update it.
          if (select) {
            // Create option if not exists
            let option = Array.from(select.options).find(
              (o) => o.value === methodString,
            );
            if (!option) {
              option = document.createElement("option");
              option.value = methodString;
              option.text = methodString;
              select.add(option);
            }
            select.value = methodString;
          }
        }
      }

      // --- 2. Update Visuals (The "UI") ---
      // Remove 'active' from all custom buttons
      const allMethodBtns = targetModal.querySelectorAll(".payment-method-btn");
      allMethodBtns.forEach((b) => b.classList.remove("active"));

      // HTML content for the active button (handling overflow with truncated classes)
      const buttonContent = `
                <div class="flex flex-col items-center w-full px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-[var(--accent)] mb-1">
                        ${
                          currentFlow.includes("card")
                            ? '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>'
                            : '<path d="M3 21h18"/><path d="M5 21V7"/><path d="M19 21V7"/><path d="M2 7h20"/><path d="M12 2 2 7h20z"/>'
                        }
                    </svg>
                    <span class="text-[10px] leading-tight text-center font-semibold w-full truncate text-ellipsis overflow-hidden whitespace-nowrap block" title="${
                      currentFlow.includes("card") ? "Card" : "Bank"
                    }: ${bankName}">
                        ${
                          currentFlow.includes("card") ? "Card" : "Bank"
                        } (${bankName})
                    </span>
                </div>
            `;

      if (currentFlow.includes("card")) {
        // Find Card button
        const cardBtn = targetModal.querySelector('button[data-method="Card"]');
        if (cardBtn) {
          cardBtn.classList.add(
            "active",
            "border-[var(--accent)]",
            "bg-[var(--accent-glow)]",
          );
          cardBtn.innerHTML = buttonContent;
        }
      } else {
        // Find Bank Transfer button
        const bankTransferBtn =
          targetModal.querySelector("#custom-bank-btn") ||
          targetModal.querySelector('button[data-method="Bank Transfer"]');
        if (bankTransferBtn) {
          bankTransferBtn.classList.add(
            "active",
            "border-[var(--accent)]",
            "bg-[var(--accent-glow)]",
          );
          bankTransferBtn.innerHTML = buttonContent;
        }
      }

      closeBankModal();
    }
  }

  // --- 5. OBSERVER: Detect Payment Modal & Inject/Hijack Buttons ---

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.classList.contains("modal-overlay")) {
          const titleEl = node.querySelector("h3");

          if (!titleEl) return;

          const titleText = titleEl.textContent;

          // 1. Detect POS Payment Modal (English OR Bangla)
          if (POS_TITLES.includes(titleText)) {
            injectPOSFeatures(node);
          }
          // 2. Detect Due Payment Modal (English OR Bangla)
          if (DUE_TITLES.includes(titleText)) {
            injectDuePaymentFeatures(node);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function injectPOSFeatures(modalNode) {
    // 1. INJECT "Bank Transfer" Button
    const methodGrids = modalNode.querySelectorAll(".grid.grid-cols-2.gap-3");
    if (methodGrids.length >= 2) {
      if (!modalNode.querySelector("#custom-bank-btn")) {
        const container = methodGrids[1].parentNode;
        const bankBtnContainer = document.createElement("div");
        bankBtnContainer.className = "mb-4";

        bankBtnContainer.innerHTML = `
                    <button id="custom-bank-btn" class="payment-method-btn btn btn-secondary h-16 w-full flex flex-col items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M3 21h18"/><path d="M5 21V7"/><path d="M19 21V7"/><path d="M2 7h20"/><path d="M12 2 2 7h20z"/></svg>
                        Bank Transfer
                    </button>
                `;
        methodGrids[1].after(bankBtnContainer);

        const btn = bankBtnContainer.querySelector("#custom-bank-btn");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openBankModal("transfer"); // Open in Transfer mode
        });
      }
    }

    // 2. HIJACK "Card" Button
    const cardBtn = modalNode.querySelector('button[data-method="Card"]');
    if (cardBtn && !cardBtn.dataset.hijacked) {
      cardBtn.dataset.hijacked = "true";
      cardBtn.dataset.paymentAction = "select-card-terminal";
      cardBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openBankModal("card"); // Open in Card mode
      });
    }
  }

  function injectDuePaymentFeatures(modalNode) {
    // Find the select element to replace
    const selectElement = modalNode.querySelector(
      'select[name="paymentMethod"]',
    );
    if (!selectElement) return;

    // Hide the parent div of the select element (Payment Method label + select)
    const selectContainer = selectElement.parentElement;
    selectContainer.style.display = "none";

    // Create the new grid container
    const gridContainer = document.createElement("div");
    gridContainer.className = "grid grid-cols-2 gap-3 mb-4";

    // Helper to create buttons
    const createBtn = (method, icon, label, flowType) => {
      const btn = document.createElement("button");
      btn.type = "button"; // Prevent form submission
      btn.className =
        "payment-method-btn btn btn-secondary h-16 flex flex-col items-center justify-center gap-1";
      if (method === "Cash")
        btn.classList.add(
          "active",
          "border-[var(--accent)]",
          "bg-[var(--accent-glow)]",
        );
      btn.dataset.method = method;
      btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">${icon}</svg>
                <span class="text-xs font-semibold">${label}</span>
            `;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // Visual Toggle
        gridContainer
          .querySelectorAll(".payment-method-btn")
          .forEach((b) =>
            b.classList.remove(
              "active",
              "border-[var(--accent)]",
              "bg-[var(--accent-glow)]",
            ),
          );
        btn.classList.add(
          "active",
          "border-[var(--accent)]",
          "bg-[var(--accent-glow)]",
        );

        // Logic
        if (flowType) {
          openBankModal(flowType);
        } else {
          // Simple method (Cash)
          selectElement.value = method;
        }
      });
      return btn;
    };

    // Cash Button
    const cashBtn = createBtn(
      "Cash",
      '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      "Cash",
      null,
    );

    // Card Button (Triggers Modal)
    const cardBtn = createBtn(
      "Card",
      '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
      "Card",
      "due-card",
    );

    // Bank Transfer Button (Triggers Modal)
    const bankBtn = createBtn(
      "Bank Transfer",
      '<path d="M3 21h18"/><path d="M5 21V7"/><path d="M19 21V7"/><path d="M2 7h20"/><path d="M12 2 2 7h20z"/>',
      "Bank Transfer",
      "due-transfer",
    );
    bankBtn.id = "custom-bank-btn"; // Use ID for selectBank to find it

    // Append to grid
    gridContainer.appendChild(cashBtn);
    gridContainer.appendChild(cardBtn);

    // Insert grid after the hidden select container
    selectContainer.after(gridContainer);
    // Insert Bank Transfer separate row like in POS---
    const bankRow = document.createElement("div");
    bankRow.className = "mb-4";
    bankRow.appendChild(bankBtn);
    bankRow.querySelector("button").classList.add("w-full"); // Make full width
    gridContainer.after(bankRow);
  }

  console.log(
    "Banking Fun Module Loaded: Bangladesh Banks Ready 🇧🇩 (Enhanced POS + Due Payment + Localization Support)",
  );
})();
