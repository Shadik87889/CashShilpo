/**
 * CashShilpo Smart Button Animation Module
 * "Drop-in" script to add loading states to buttons automatically.
 * * Features:
 * - Detects "Action" buttons (Save, Pay, Create, etc.)
 * - Shows a spinner on click
 * - Prevents double-clicks
 * - Resets automatically when:
 * 1. A Toast notification appears (Success/Error)
 * 2. The Modal containing the button closes
 * 3. A safety timer expires (10s)
 */

(function () {
  console.log("CashShilpo: Button Animation Module Initialized");

  // --- 1. Inject CSS Styles for the Spinner ---
  const styleId = "cs-btn-anim-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
            /* Spinner Keyframes */
            @keyframes cs-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Loading State Class */
            .cs-btn-loading {
                position: relative !important;
                color: transparent !important; /* Hide original text */
                pointer-events: none !important; /* Block clicks */
                transition: all 0.2s ease;
                cursor: wait !important;
            }

            /* The Spinner Pseudo-element */
            .cs-btn-loading::after {
                content: "";
                position: absolute;
                width: 1.2em;
                height: 1.2em;
                top: 50%;
                left: 50%;
                margin-top: -0.6em;
                margin-left: -0.6em;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: currentColor; /* Matches button text color usually, or white */
                animation: cs-spin 0.6s linear infinite;
                z-index: 10;
            }

            /* Adjust spinner color for specific button types */
            .btn-primary.cs-btn-loading::after, 
            .btn-success.cs-btn-loading::after, 
            .btn-danger.cs-btn-loading::after {
                border-top-color: #ffffff;
            }
            
            .btn-secondary.cs-btn-loading::after {
                border-top-color: var(--text-primary, #333);
                border-color: rgba(0,0,0,0.1);
            }
        `;
    document.head.appendChild(style);
  }

  // --- 2. Configuration ---
  // Buttons with text starting with these words will get the animation
  const ACTION_KEYWORDS = [
    "Save",
    "Create",
    "Update",
    "Delete",
    "Pay",
    "Login",
    "Sign In",
    "Confirm",
    "Finalize",
    "Send",
    "Run",
    "Import",
    "Export",
    "Submit",
    "Add",
    "Receive",
    "Apply",
    "Process",
    "Log",
    "Invite",
  ];

  // Buttons explicitly ignored (like closing a modal)
  const IGNORE_KEYWORDS = ["Cancel", "Close", "Back"];

  // Track loading buttons to reset them later
  const loadingButtons = new Set();

  // --- 3. Helper Functions ---

  function startLoading(btn) {
    if (!btn || btn.classList.contains("cs-btn-loading")) return;

    // Don't animate if it's a simple navigation or non-async action
    // Heuristic: If it has 'data-action' it's likely handled by JS.
    // If it's type="submit", it's a form.

    btn.classList.add("cs-btn-loading");
    // Store the original width to prevent collapse (optional, but good for UX)
    btn.style.minWidth = getComputedStyle(btn).width;

    loadingButtons.add(btn);

    // Failsafe: Reset after 10 seconds if no response/error occurs
    setTimeout(() => stopLoading(btn), 10000);
  }

  function stopLoading(btn) {
    if (btn && loadingButtons.has(btn)) {
      btn.classList.remove("cs-btn-loading");
      btn.style.minWidth = ""; // Reset width
      loadingButtons.delete(btn);
    }
  }

  function stopAllLoading() {
    loadingButtons.forEach((btn) => stopLoading(btn));
    loadingButtons.clear();
  }

  // --- 4. Event Listeners ---

  // A. Global Click Listener (Delegation)
  document.body.addEventListener(
    "click",
    function (e) {
      // Find the closest button element
      const btn = e.target.closest("button");
      if (!btn) return;

      // Skip if disabled or already loading
      if (btn.disabled || btn.classList.contains("cs-btn-loading")) return;

      // Check text content
      const text = (btn.innerText || btn.textContent).trim();

      // 1. Check Ignore List
      if (IGNORE_KEYWORDS.some((k) => text.includes(k))) return;

      // 2. Check Action Keywords OR specific classes
      const isActionBtn = ACTION_KEYWORDS.some((k) => text.startsWith(k));
      const isImportantBtn =
        btn.classList.contains("btn-primary") ||
        btn.classList.contains("btn-success") ||
        btn.classList.contains("btn-danger");

      if (isActionBtn || isImportantBtn) {
        // Special handling for "Apply Discount" or "Apply" buttons that are synchronous/fast
        // We only want to animate "Heavy" actions.
        // If it's inside a form, we let the submit handler handle it (better for validation)
        if (btn.type === "submit") return;

        startLoading(btn);
      }
    },
    true
  ); // Capture phase to run before other handlers might stop propagation

  // B. Form Submit Listener
  // This is better for forms because it only fires if HTML5 validation passes
  document.body.addEventListener("submit", function (e) {
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      startLoading(submitBtn);
    }
  });

  // --- 5. Reset Triggers (The "Smart" Part) ---

  // Trigger 1: Watch for Toasts (Notifications)
  // When a toast appears, it usually means the action completed or failed.
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        // A toast was added! Stop all animations.
        // We wait a tiny bit (300ms) to ensure the UI update feels smooth
        setTimeout(stopAllLoading, 100);
      }
    });
  });

  const toastsContainer = document.getElementById("toasts-container");
  if (toastsContainer) {
    observer.observe(toastsContainer, { childList: true });
  } else {
    // Fallback: poll for container if script loads before DOM is fully ready
    const poller = setInterval(() => {
      const el = document.getElementById("toasts-container");
      if (el) {
        observer.observe(el, { childList: true });
        clearInterval(poller);
      }
    }, 1000);
  }

  // Trigger 2: Watch for Modals Closing
  // If a button was inside a modal and the modal closes, we should clean up.
  // Also, if the "Save" button closes the modal, the action is done.
  const modalObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check if nodes were removed (modal closed)
      if (mutation.removedNodes.length > 0) {
        mutation.removedNodes.forEach((node) => {
          if (
            node.classList &&
            (node.classList.contains("modal-overlay") ||
              node.id === "modals-container")
          ) {
            stopAllLoading();
          }
          // Also check if any tracked button was inside the removed node
          loadingButtons.forEach((btn) => {
            if (node.contains(btn)) {
              loadingButtons.delete(btn);
            }
          });
        });
      }
    });
  });

  const modalsContainer = document.getElementById("modals-container");
  if (modalsContainer) {
    modalObserver.observe(modalsContainer, { childList: true, subtree: true });
  }
})();
