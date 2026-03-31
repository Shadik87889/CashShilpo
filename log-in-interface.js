(function () {
  console.log("Premium Login Interface: v3.4 Stable Loaded (Strictly Scoped)");

  // --- 1. CONFIGURATION ---
  const CONFIG = {
    bgImage: "ChatGPT Image Jan 10, 2026, 10_45_03 PM.png",
    logoUrl: "cashshilpo-official-logo.png",
    brandName: "CashShilpo",
    tagline: "Empowering Commerce, One Sale at a Time.",
  };

  // --- 2. CSS STYLES ---
  // CRITICAL FIX: Every selector is strictly bound to #login-container and renamed
  // to avoid colliding with main app classes like .form-pane or .glass-card.
  const STYLES = `
          /* --- Core Layout Reset --- */
          #login-container {
              display: flex;
              padding: 0 !important;
              background-color: #000 !important;
              overflow: hidden !important;
              position: fixed !important;
              top: 0; left: 0; right: 0; bottom: 0;
              z-index: 100 !important;
          }

          /* Ensure container hides when inline style is set to none */
          #login-container[style*="display: none"] {
              display: none !important;
              z-index: -1 !important;
              pointer-events: none !important;
          }

          /* Uncage the original card wrapper */
          #login-container > div.w-full.max-w-md {
              width: 100% !important;
              max-width: 100% !important;
              background: transparent !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
              height: 100%;
          }
  
          /* --- Split Layout Grid --- */
          #login-container .login-split-layout {
              display: grid;
              grid-template-columns: 1fr;
              height: 100vh;
              width: 100vw;
              overflow: hidden;
              background-color: #000;
          }
          @media (min-width: 1024px) {
              #login-container .login-split-layout {
                  grid-template-columns: 1.2fr 1fr; /* 55% Visual, 45% Form */
              }
          }
  
          /* --- Left Pane: Visuals --- */
          #login-container .login-visual-pane {
              position: relative;
              background-color: #050505;
              overflow: hidden;
              display: none; /* Hidden on mobile by default */
              flex-direction: column;
              justify-content: space-between;
              padding: 4rem;
          }
          @media (min-width: 1024px) {
              #login-container .login-visual-pane {
                  display: flex;
              }
          }
          
          #login-container .login-visual-bg {
              position: absolute;
              inset: 0;
              background-image: url('${CONFIG.bgImage}');
              background-size: cover;
              background-position: center;
              opacity: 0.4;
              transition: transform 10s ease-in-out;
              animation: loginSlowZoom 20s infinite alternate;
          }
          @keyframes loginSlowZoom {
              from { transform: scale(1); }
              to { transform: scale(1.1); }
          }
  
          #login-container .login-visual-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(to bottom, rgba(0,0,0,0.2), #000);
              backdrop-filter: blur(1px);
          }
  
          #login-container .login-visual-content {
              position: relative;
              z-index: 10;
              color: white;
          }
  
          #login-container .login-brand-tag {
              display: inline-flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 2rem;
          }
          #login-container .login-brand-tag img {
              width: 48px;
              height: 48px;
              filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.5));
          }
          #login-container .login-brand-tag span {
              font-size: 1.5rem;
              font-weight: 800;
              letter-spacing: -0.03em;
          }
  
          #login-container .login-hero-text h2 {
              font-size: 3.5rem;
              font-weight: 800;
              line-height: 1.1;
              background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 1.5rem;
          }
          #login-container .login-hero-text p {
              font-size: 1.125rem;
              color: #94a3b8;
              max-width: 80%;
              line-height: 1.6;
          }
  
          /* Floating UI Elements */
          #login-container .login-glass-card {
              background: rgba(255, 255, 255, 0.03);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 16px;
              padding: 1.5rem;
              margin-top: 4rem;
              max-width: 400px;
              animation: loginFloat 6s ease-in-out infinite;
          }
          @keyframes loginFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
          }
  
          /* --- Right Pane: Form --- */
          #login-container .login-form-pane {
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 2rem;
              background-color: #0a0a0a;
              overflow-y: auto;
              z-index: 20;
          }
  
          #login-container .login-form-wrapper {
              width: 100%;
              max-width: 420px;
              animation: loginSlideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes loginSlideUpFade {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
  
          /* Form Styling Overrides */
          #login-container .login-form-pane h1 {
              font-size: 2rem !important;
              font-weight: 700 !important;
              color: white !important;
              margin-bottom: 0.5rem !important;
              text-align: left !important;
          }
          #login-container .login-form-pane p.text-text-secondary {
              text-align: left !important;
              margin-bottom: 2.5rem !important;
              color: #64748b !important;
          }
  
          #login-container .login-form-pane .form-input {
              background-color: #121212 !important;
              border: 1px solid #27272a !important;
              color: white !important;
              padding: 1rem !important;
              border-radius: 0.75rem !important;
              font-size: 1rem !important;
              transition: all 0.2s ease;
          }
          #login-container .login-form-pane .form-input:focus {
              background-color: #000 !important;
              border-color: #3b82f6 !important;
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
          }
          #login-container .login-form-pane label {
              font-size: 0.875rem !important;
              font-weight: 600 !important;
              color: #a1a1aa !important;
              margin-bottom: 0.5rem !important;
          }
  
          /* --- Premium Button with Loading Effect --- */
          #login-container .btn-primary {
              position: relative;
              background: #fff !important;
              color: #000 !important;
              border: none !important;
              border-radius: 0.75rem !important;
              padding: 1rem !important;
              font-weight: 700 !important;
              font-size: 1rem !important;
              letter-spacing: 0.025em !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              overflow: hidden;
              width: 100%;
              cursor: pointer !important;
          }
          #login-container .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 20px -10px rgba(255, 255, 255, 0.5) !important;
          }
          #login-container .btn-primary:active {
              transform: scale(0.98);
          }
  
          /* Loading State Styles */
          #login-container .btn-primary.loading {
              color: transparent !important;
              pointer-events: none;
              background: #e2e8f0 !important;
          }
          #login-container .btn-primary.loading::after {
              content: "";
              position: absolute;
              left: 50%;
              top: 50%;
              width: 20px;
              height: 20px;
              margin-left: -10px;
              margin-top: -10px;
              border: 2px solid #000;
              border-top-color: transparent;
              border-radius: 50%;
              animation: loginSpin 0.8s linear infinite;
              opacity: 1;
          }
          @keyframes loginSpin {
              to { transform: rotate(360deg); }
          }
  
          /* Links */
          #login-container a {
              color: #3b82f6 !important;
              font-weight: 600;
              transition: color 0.2s;
          }
          #login-container a:hover {
              color: #60a5fa !important;
              text-decoration: none !important;
          }

          /* Hide original logo in form if present to avoid duplication */
          #login-container .login-form-pane .text-center.mb-8 {
              display: none !important; 
          }
          
          /* Custom Scrollbar for form pane */
          #login-container .login-form-pane::-webkit-scrollbar {
              width: 6px;
          }
          #login-container .login-form-pane::-webkit-scrollbar-track {
              background: #0a0a0a;
          }
          #login-container .login-form-pane::-webkit-scrollbar-thumb {
              background: #27272a;
              border-radius: 3px;
          }
      `;

  // --- 3. INJECT STYLES ---
  function injectStyles() {
    if (document.getElementById("premium-login-styles")) return;
    const styleSheet = document.createElement("style");
    styleSheet.id = "premium-login-styles";
    styleSheet.textContent = STYLES;
    document.head.appendChild(styleSheet);
  }

  // --- 4. CREATE DOM STRUCTURE ---
  function transformLayout() {
    const loginContainer = document.getElementById("login-container");
    if (!loginContainer) return;

    // Check if we already transformed it
    if (document.getElementById("split-layout-root")) return;

    // Find the original form content
    const originalFormWrapper = loginContainer.querySelector(
      ".w-full.max-w-md",
    );
    const authFormContainer = document.getElementById("auth-form-container");

    // Guard: Only proceed if the original form exists
    if (!originalFormWrapper || !authFormContainer) return;

    console.log("Transforming Login Layout with Strict Isolation...");

    // 1. Create the new Split Layout Root
    const splitRoot = document.createElement("div");
    splitRoot.id = "split-layout-root";
    splitRoot.className = "login-split-layout"; // UPDATED SCOPED CLASS

    // 2. Create Left Pane: Visuals
    const visualPane = document.createElement("div");
    visualPane.className = "login-visual-pane"; // UPDATED SCOPED CLASS
    visualPane.innerHTML = `
          <div class="login-visual-bg"></div>
          <div class="login-visual-overlay"></div>
          <div class="login-visual-content h-full flex flex-col justify-between relative z-10">
              <div class="login-brand-tag">
                  <img src="${
                    CONFIG.logoUrl
                  }" alt="Logo" onerror="this.style.display='none'">
                  <span>${CONFIG.brandName}</span>
              </div>
              
              <div class="login-hero-text">
                  <h2>Future of<br>Retail Management.</h2>
                  <p class="mt-4">${CONFIG.tagline}</p>
                  
                  <div class="login-glass-card">
                      <div class="flex items-center gap-3 mb-2">
                          <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <span class="font-bold text-sm">System Status: Online</span>
                      </div>
                      <p class="text-xs text-gray-400">Secure, encrypted connection established. Ready for business.</p>
                  </div>
              </div>
  
              <div class="text-xs text-gray-500">
                  &copy; ${new Date().getFullYear()} ${CONFIG.brandName} Inc.
              </div>
          </div>
      `;

    // 3. Create Right Pane: Form
    const formPane = document.createElement("div");
    formPane.className = "login-form-pane"; // UPDATED SCOPED CLASS (Fixes main app conflict)

    // Wrap the form for animation
    const formWrapper = document.createElement("div");
    formWrapper.className = "login-form-wrapper"; // UPDATED SCOPED CLASS

    // Move the actual form container into our wrapper
    formWrapper.appendChild(authFormContainer);
    formPane.appendChild(formWrapper);

    // 5. Assemble the Split Layout
    splitRoot.appendChild(visualPane);
    splitRoot.appendChild(formPane);

    // 6. Safe Swap
    loginContainer.innerHTML = "";
    loginContainer.appendChild(splitRoot);

    // 7. Attach Robust Listeners
    attachSmartListeners(formWrapper);
  }

  // --- 5. SMART LOADING LOGIC ---
  function attachSmartListeners(container) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest('button[type="submit"]');
      if (btn) {
        const form = btn.closest("form");
        if (form && form.checkValidity()) {
          btn.classList.add("loading");
          setTimeout(() => {
            if (btn.classList.contains("loading")) {
              btn.classList.remove("loading");
            }
          }, 15000);
        }
      }
    });

    const errorObserver = new MutationObserver((mutations) => {
      const errorElement = container.querySelector("#auth-error");
      const submitBtn = container.querySelector('button[type="submit"]');

      if (
        errorElement &&
        submitBtn &&
        submitBtn.classList.contains("loading")
      ) {
        const isVisible = !errorElement.classList.contains("hidden");
        const hasText = errorElement.textContent.trim().length > 0;

        if (isVisible && hasText) {
          submitBtn.classList.remove("loading");
        }
      }
    });

    errorObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    container.addEventListener("input", (e) => {
      const submitBtn = container.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.classList.contains("loading")) {
        submitBtn.classList.remove("loading");
      }
    });
  }

  // --- 6. INITIALIZATION OBSERVER ---
  const observer = new MutationObserver((mutations) => {
    const loginContainer = document.getElementById("login-container");
    if (loginContainer && loginContainer.style.display !== "none") {
      if (
        loginContainer.querySelector(".w-full.max-w-md") &&
        !document.getElementById("split-layout-root")
      ) {
        injectStyles();
        requestAnimationFrame(() => transformLayout());
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  injectStyles();
  transformLayout();
})();
