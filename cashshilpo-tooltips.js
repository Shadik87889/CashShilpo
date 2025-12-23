/**
 * CashShilpo Tooltip & Sidebar Helper
 * Provides tooltips for the collapsed sidebar, header icons, and other essential UI elements.
 */

(function () {
  console.log("CashShilpo Tooltips: Module Loaded");

  const TOOLTIP_ID = "cashshilpo-global-tooltip";
  let tooltipEl = null;

  // Initialize the tooltip element
  function initTooltipElement() {
    if (document.getElementById(TOOLTIP_ID)) return;

    tooltipEl = document.createElement("div");
    tooltipEl.id = TOOLTIP_ID;
    // Tailwind classes for a sleek, glass-morphism tooltip
    tooltipEl.className =
      "fixed z-[9999] px-3 py-1.5 text-xs font-medium text-white bg-gray-900/90 backdrop-blur-sm rounded-md shadow-lg pointer-events-none opacity-0 transition-opacity duration-200 whitespace-nowrap border border-white/10";
    document.body.appendChild(tooltipEl);
  }

  // Position and show the tooltip
  function showTooltip(target, text, position = "right") {
    if (!tooltipEl) initTooltipElement();

    tooltipEl.textContent = text;
    const targetRect = target.getBoundingClientRect();

    let top, left;

    if (position === "bottom") {
      // Position below the element (ideal for headers)
      top = targetRect.bottom + 8;
      left = targetRect.left + targetRect.width / 2 - tooltipEl.offsetWidth / 2;
    } else {
      // Position to the right (ideal for sidebar)
      top = targetRect.top + targetRect.height / 2 - tooltipEl.offsetHeight / 2;
      left = targetRect.right + 10;
    }

    // --- Viewport Collision Detection ---

    // Horizontal adjustment
    if (left < 10) left = 10;
    if (left + tooltipEl.offsetWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipEl.offsetWidth - 10;
    }

    // Vertical adjustment
    if (top + tooltipEl.offsetHeight > window.innerHeight - 10) {
      top = targetRect.top - tooltipEl.offsetHeight - 8;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.opacity = "1";
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.style.opacity = "0";
  }

  // Event Delegation for Performance
  document.addEventListener("mouseover", (e) => {
    // Broaden target selection to include header buttons/actions
    const target = e.target.closest(
      "[data-tooltip], aside button, aside a, header button, .header-action"
    );
    if (!target) return;

    // 1. Sidebar Specific Logic (Left positioning)
    const sidebar = document.querySelector("aside");
    const isCollapsed = sidebar && sidebar.classList.contains("w-20");

    if (isCollapsed && target.closest("aside")) {
      const labelSpan = target.querySelector("span");
      const text = labelSpan
        ? labelSpan.textContent.trim()
        : target.getAttribute("title");
      if (text) showTooltip(target, text, "right");
      return;
    }

    // 2. Header Specific Logic (Bottom positioning)
    if (target.closest("header")) {
      const text =
        target.getAttribute("data-tooltip") ||
        target.getAttribute("aria-label") ||
        target.title;
      if (text) {
        // If the element has a native title, we "take over" the UI
        if (target.title) {
          target.setAttribute("data-original-title", target.title);
          target.removeAttribute("title");
        }
        showTooltip(target, text, "bottom");
      }
      return;
    }

    // 3. Generic Tooltip Logic
    const genericText = target.getAttribute("data-tooltip");
    if (genericText) {
      showTooltip(target, genericText, "right");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target.closest(
      "[data-tooltip], aside button, aside a, header button, .header-action"
    );
    if (target && target.hasAttribute("data-original-title")) {
      target.setAttribute("title", target.getAttribute("data-original-title"));
      target.removeAttribute("data-original-title");
    }
    hideTooltip();
  });

  // Clean up on click
  document.addEventListener("click", () => {
    hideTooltip();
  });

  // Initialize on load
  initTooltipElement();
})();
