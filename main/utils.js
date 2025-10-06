// --- CORE UTILITY FUNCTIONS ---

/**
 * Gets the current business profile based on settings.
 * @returns {object} The active business profile object.
 */
function getCurrentProfile() {
  const profileId = appState.settings.businessType;
  return (
    businessProfiles[profileId] ||
    appState.customProfiles[profileId] ||
    businessProfiles.general
  );
}

/**
 * An object containing currency conversion and formatting utilities.
 */
const currencyUtils = {
  /**
   * Gets currency information for a given code.
   * @param {string} [currencyCode=appState.currentCurrency] - The currency code (e.g., 'USD', 'BDT').
   * @returns {object} The currency information object.
   */
  get(currencyCode = appState.currentCurrency) {
    return (
      storeInfo.currencies[currencyCode] ||
      storeInfo.currencies[storeInfo.baseCurrency]
    );
  },
  /**
   * Converts an amount from the base currency to a target currency.
   * @param {number} amountInBase - The amount in the store's base currency.
   * @param {string} [toCurrencyCode=appState.currentCurrency] - The target currency code.
   * @returns {number} The converted amount.
   */
  convert(amountInBase, toCurrencyCode = appState.currentCurrency) {
    const rate = this.get(toCurrencyCode).rate;
    return amountInBase * rate;
  },
  /**
   * Formats a number as a currency string.
   * @param {number} amountInBase - The amount in the store's base currency.
   * @param {string} [toCurrencyCode=appState.currentCurrency] - The target currency for display.
   * @param {object} [options={}] - Intl.NumberFormat options.
   * @returns {string} The formatted currency string.
   */
  format(
    amountInBase,
    toCurrencyCode = appState.currentCurrency,
    options = {}
  ) {
    const currencyInfo = this.get(toCurrencyCode);
    const convertedAmount = this.convert(amountInBase, toCurrencyCode);

    const formattedWithCode = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: toCurrencyCode,
      currencyDisplay: "code",
      ...options,
    }).format(convertedAmount);

    return formattedWithCode.replace(toCurrencyCode, currencyInfo.symbol);
  },
};

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {('success'|'error'|'info'|'warning')} [type='success'] - The type of toast.
 */
function showToast(message, type = "success") {
  const toastsContainer = document.getElementById("toasts-container");
  const toastStyles = {
    success: {
      bg: "bg-green-500/10 border-green-500/50",
      icon: "check-circle",
      iconColor: "text-green-400",
    },
    error: {
      bg: "bg-red-500/10 border-red-500/50",
      icon: "alert-circle",
      iconColor: "text-red-400",
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/50",
      icon: "info",
      iconColor: "text-blue-400",
    },
    warning: {
      bg: "bg-yellow-500/10 border-yellow-500/50",
      icon: "alert-triangle",
      iconColor: "text-yellow-400",
    },
  };
  const style = toastStyles[type];
  const toast = document.createElement("div");
  toast.className = `toast glass-pane flex items-center gap-4 text-text-primary text-sm font-medium px-4 py-3 rounded-xl shadow-lg ${style.bg}`;
  toast.innerHTML = `<i data-lucide="${style.icon}" class="w-6 h-6 ${style.iconColor}"></i><p class="flex-1">${message}</p>`;
  toastsContainer.prepend(toast);
  lucide.createIcons();
  setTimeout(() => toast.remove(), 5000);
}

/**
 * Displays a modal dialog.
 * @param {string} title - The title of the modal.
 * @param {string} content - The HTML content for the modal body.
 * @param {string} footer - The HTML content for the modal footer.
 * @param {object} [options={}] - Additional options for the modal.
 * @param {string} [options.size='max-w-lg'] - Tailwind CSS class for modal width.
 * @param {string} [options.customClasses=''] - Additional custom classes for the modal content.
 * @returns {HTMLElement} The created modal element.
 */
function showModal(title, content, footer, options = {}) {
  const modalsContainer = document.getElementById("modals-container");
  const { size = "max-w-lg", customClasses = "" } = options;
  const modalId = `modal-${Date.now()}`;
  const modalHTML = `
        <div id="${modalId}" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 opacity-0">
            <div class="modal-content glass-pane rounded-xl shadow-2xl w-full ${size} ${customClasses} scale-95 transform">
                <div class="flex justify-between items-center p-5 border-b border-border-color">
                    <h3 class="text-xl font-semibold text-text-primary">${title}</h3>
                    <button data-action="close-modal" class="p-1 rounded-full text-text-secondary hover:bg-bg-tertiary hover:text-white">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="p-6 text-text-secondary max-h-[70vh] overflow-y-auto">${content}</div>
                ${
                  footer
                    ? `<div class="flex justify-end items-center p-4 bg-[var(--bg-secondary)]/50 rounded-b-xl space-x-3">${footer}</div>`
                    : ""
                }
            </div>
        </div>`;
  modalsContainer.insertAdjacentHTML("beforeend", modalHTML);
  lucide.createIcons();
  const modalEl = document.getElementById(modalId);
  setTimeout(() => {
    modalEl.classList.remove("opacity-0");
    modalEl.querySelector(".modal-content").classList.remove("scale-95");
  }, 10);
  return modalEl;
}

/**
 * Closes and removes a modal from the DOM.
 * @param {HTMLElement} modalEl - The modal element to close.
 */
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("opacity-0");
  modalEl.querySelector(".modal-content").classList.add("scale-95");
  setTimeout(() => modalEl.remove(), 300);
}
