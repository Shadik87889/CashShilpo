/**
 * CashShilpo Visual Physics Engine
 * "Game Changing" UI Customization Module.
 * Allows live manipulation of CSS variables for geometry, atmosphere, and physics.
 */

(function () {
  console.log("CashShilpo Visual Engine: Module Loaded");

  // Default Config
  const DEFAULTS = {
    borderRadius: 0.5, // rem
    glassBlur: 20, // px
    fontSizeScale: 1, // multiplier
    animationSpeed: 1, // multiplier (1 = normal, 0.5 = fast, 2 = slow)
    interfaceDensity: "comfortable", // 'compact', 'comfortable', 'spacious'
  };

  const STORAGE_KEY = "cashshilpo_visual_pref";
  let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ...DEFAULTS };

  // --- 1. CORE LOGIC: APPLY SETTINGS ---
  function applyVisuals() {
    const root = document.documentElement;

    // Geometry: Border Radius
    // We update the standard Tailwind radius variables logic by overriding styles or setting specific vars
    // Since Tailwind uses classes, we manipulate specific CSS vars if the CSS is set up for it,
    // OR we inject a style tag to override common classes.

    // For this implementation, we assume we can affect standard elements via a global override style block
    // or direct variable manipulation if the CSS uses vars.
    // Let's use a dynamic style block for maximum compatibility.

    let radiusCSS = "";
    if (config.borderRadius !== 0.5) {
      // Only override if changed
      radiusCSS = `
            .rounded-lg, .rounded-xl, .rounded-md, .btn, .form-input, .card {
                border-radius: ${config.borderRadius}rem !important;
            }
            .rounded-full { border-radius: 9999px !important; } /* Protect pills */
        `;
    }

    // Atmosphere: Glass Blur
    // Updates the --glass-bg variable or backdrop-filter classes
    let blurCSS = `
        .glass-pane, .modal-content, .bg-glass {
            backdrop-filter: blur(${config.glassBlur}px) !important;
            -webkit-backdrop-filter: blur(${config.glassBlur}px) !important;
        }
    `;

    // Physics: Animation Speed
    // We adjust transition durations
    let animCSS = `
        *, .modal-content, .toast, .view-pane {
            transition-duration: ${200 * config.animationSpeed}ms !important;
        }
    `;

    // Typography: Scale
    let fontCSS = `
        html {
            font-size: ${16 * config.fontSizeScale}px !important;
        }
    `;

    // Density adjustments (padding overrides)
    let densityCSS = "";
    if (config.interfaceDensity === "compact") {
      densityCSS = `
            .p-4 { padding: 0.75rem !important; }
            .p-6 { padding: 1rem !important; }
            .py-3 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .px-6 { padding-left: 1rem !important; padding-right: 1rem !important; }
            .btn { padding: 0.5rem 1rem !important; }
            .table-pro td, .table-pro th { padding: 0.75rem 1rem !important; }
        `;
    } else if (config.interfaceDensity === "spacious") {
      densityCSS = `
            .p-4 { padding: 1.5rem !important; }
            .table-pro td, .table-pro th { padding: 1.5rem !important; }
        `;
    }

    // Inject/Update Style Tag
    let styleTag = document.getElementById("visual-engine-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "visual-engine-styles";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = radiusCSS + blurCSS + animCSS + fontCSS + densityCSS;
  }

  // --- 2. UI INJECTION ---
  function injectVisualPanel(settingsForm) {
    if (document.getElementById("visual-engine-panel")) return;

    const panel = document.createElement("div");
    panel.id = "visual-engine-panel";
    panel.className = "animate-fadeIn";

    panel.innerHTML = `
        <div class="glass-pane p-6 rounded-xl border border-border-color relative overflow-hidden">
            <!-- Background Decoration -->
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <i data-lucide="scan-eye" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-text-primary">Visual Physics Engine</h2>
                        <p class="text-sm text-text-secondary">Fine-tune the geometry, atmosphere, and physics of your interface.</p>
                    </div>
                    <button id="reset-visuals" class="ml-auto text-xs text-accent hover:underline">Reset Defaults</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <!-- Geometry Section -->
                    <div class="space-y-6">
                        <h3 class="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="box" class="w-4 h-4"></i> Geometry
                        </h3>
                        
                        <!-- Radius Slider -->
                        <div class="space-y-3">
                            <div class="flex justify-between text-sm">
                                <span class="text-text-primary">Corner Roundness</span>
                                <span class="font-mono text-xs text-text-secondary" id="val-radius">${
                                  config.borderRadius
                                }rem</span>
                            </div>
                            <input type="range" id="input-radius" min="0" max="1.5" step="0.1" value="${
                              config.borderRadius
                            }" class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent">
                            <div class="flex justify-between text-[10px] text-text-secondary uppercase">
                                <span>Square</span>
                                <span>Round</span>
                            </div>
                        </div>

                        <!-- Density Selector -->
                        <div class="space-y-3">
                            <span class="text-sm text-text-primary block">Interface Density</span>
                            <div class="flex bg-bg-tertiary p-1 rounded-lg">
                                <button data-density="compact" class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                  config.interfaceDensity === "compact"
                                    ? "bg-bg-secondary text-accent shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                                }">Compact</button>
                                <button data-density="comfortable" class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                  config.interfaceDensity === "comfortable"
                                    ? "bg-bg-secondary text-accent shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                                }">Comfortable</button>
                                <button data-density="spacious" class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                  config.interfaceDensity === "spacious"
                                    ? "bg-bg-secondary text-accent shadow-sm"
                                    : "text-text-secondary hover:text-text-primary"
                                }">Spacious</button>
                            </div>
                        </div>
                    </div>

                    <!-- Physics & Atmosphere Section -->
                    <div class="space-y-6">
                        <h3 class="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="wind" class="w-4 h-4"></i> Atmosphere
                        </h3>

                        <!-- Blur Slider -->
                        <div class="space-y-3">
                            <div class="flex justify-between text-sm">
                                <span class="text-text-primary">Glass Blur</span>
                                <span class="font-mono text-xs text-text-secondary" id="val-blur">${
                                  config.glassBlur
                                }px</span>
                            </div>
                            <input type="range" id="input-blur" min="0" max="50" step="1" value="${
                              config.glassBlur
                            }" class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent">
                        </div>

                        <!-- Font Scale -->
                        <div class="space-y-3">
                            <div class="flex justify-between text-sm">
                                <span class="text-text-primary">Font Scale</span>
                                <span class="font-mono text-xs text-text-secondary" id="val-scale">${parseInt(
                                  config.fontSizeScale * 100
                                )}%</span>
                            </div>
                            <input type="range" id="input-scale" min="0.8" max="1.2" step="0.05" value="${
                              config.fontSizeScale
                            }" class="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent">
                        </div>
                    </div>
                </div>
                
                <!-- Live Preview Card (Mini) -->
                <div class="mt-8 pt-6 border-t border-border-color">
                    <p class="text-xs text-text-secondary mb-3">Live Preview</p>
                    <div class="flex gap-4">
                        <button class="btn btn-primary">Primary Button</button>
                        <button class="btn btn-secondary">Secondary</button>
                        <div class="flex-grow">
                             <input type="text" class="form-input w-full" placeholder="Input field preview...">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert into DOM (The Settings Tab Manager will catch this ID and move it to the Visuals tab)
    const container = settingsForm.querySelector(".space-y-8") || settingsForm;
    container.appendChild(panel);

    if (window.lucide) window.lucide.createIcons();

    // --- EVENT LISTENERS ---
    const updateConfig = (key, value) => {
      config[key] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      applyVisuals();
    };

    // Radius
    const rSlider = document.getElementById("input-radius");
    const rLabel = document.getElementById("val-radius");
    rSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      rLabel.textContent = `${val}rem`;
      updateConfig("borderRadius", val);
    });

    // Blur
    const bSlider = document.getElementById("input-blur");
    const bLabel = document.getElementById("val-blur");
    bSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      bLabel.textContent = `${val}px`;
      updateConfig("glassBlur", val);
    });

    // Font Scale
    const sSlider = document.getElementById("input-scale");
    const sLabel = document.getElementById("val-scale");
    sSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      sLabel.textContent = `${parseInt(val * 100)}%`;
      updateConfig("fontSizeScale", val);
    });

    // Density Buttons
    panel.querySelectorAll("[data-density]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        const density = btn.dataset.density;

        // Update UI state
        panel.querySelectorAll("[data-density]").forEach((b) => {
          b.className =
            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all text-text-secondary hover:text-text-primary";
        });
        btn.className =
          "flex-1 py-1.5 text-xs font-medium rounded-md transition-all bg-bg-secondary text-accent shadow-sm";

        updateConfig("interfaceDensity", density);
      });
    });

    // Reset
    document.getElementById("reset-visuals").addEventListener("click", (e) => {
      e.preventDefault();
      config = { ...DEFAULTS };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      applyVisuals();

      // Update inputs
      rSlider.value = config.borderRadius;
      rLabel.textContent = `${config.borderRadius}rem`;
      bSlider.value = config.glassBlur;
      bLabel.textContent = `${config.glassBlur}px`;
      sSlider.value = config.fontSizeScale;
      sLabel.textContent = `${config.fontSizeScale * 100}%`;

      // Update density buttons
      panel.querySelectorAll("[data-density]").forEach((b) => {
        b.className =
          b.dataset.density === "comfortable"
            ? "flex-1 py-1.5 text-xs font-medium rounded-md transition-all bg-bg-secondary text-accent shadow-sm"
            : "flex-1 py-1.5 text-xs font-medium rounded-md transition-all text-text-secondary hover:text-text-primary";
      });
    });
  }

  // --- 3. OBSERVER FOR INJECTION ---
  const observer = new MutationObserver((mutations) => {
    const settingsForm = document.getElementById("settings-form");
    // Only inject if settings form exists AND we haven't injected yet
    if (settingsForm && !document.getElementById("visual-engine-panel")) {
      injectVisualPanel(settingsForm);
    }
  });

  // --- 4. INITIALIZE ---
  applyVisuals(); // Apply CSS immediately on load

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
