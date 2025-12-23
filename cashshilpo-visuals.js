/**
 * CashShilpo Visual Engine Pro (Ultra Premium)
 * A complete aesthetic control center for the modern POS.
 * * Features:
 * - Dynamic Color System (Auto-generates palettes)
 * - Glassmorphism Physics (Blur/Opacity control)
 * - Typography & Density Matrix
 * - Spatial Scaling (UI Zoom)
 */

(function () {
  console.log("CashShilpo Visuals: Pro Engine Loaded");

  // --- 1. CONFIGURATION & STATE MANAGEMENT ---
  const PREF_KEY = "cashshilpo_visual_pref_v2";

  const defaults = {
    density: "comfortable", // comfortable, compact
    font: "inter", // inter, serif, mono
    radius: "md", // none, sm, md, lg, full
    animations: true, // true, false
    accent: "#007bff", // Hex code
    blurStrength: 20, // px
    glassOpacity: 0.6, // 0.0 - 1.0
    uiScale: 100, // %
    wallpaper: "clean", // none, dots, grid
    shadows: "soft", // flat, soft, deep
  };

  // Merge saved config with defaults to ensure new keys exist
  let config = {
    ...defaults,
    ...JSON.parse(localStorage.getItem(PREF_KEY) || "{}"),
  };

  // --- 2. COLOR UTILITIES (For dynamic theme generation) ---
  const ColorUtils = {
    hexToRgb: (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    },
    adjustBrightness: (hex, percent) => {
      const num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = ((num >> 8) & 0x00ff) + amt,
        B = (num & 0x0000ff) + amt;
      return (
        "#" +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    },
  };

  // --- 3. DYNAMIC STYLE ENGINE ---
  const styleSheet = document.createElement("style");
  styleSheet.id = "cashshilpo-visual-engine";
  document.head.appendChild(styleSheet);

  const updateStyles = () => {
    const rgb = ColorUtils.hexToRgb(config.accent);
    const accentHover = ColorUtils.adjustBrightness(config.accent, -20); // Darken by 20%

    let fontStack = "'Inter', sans-serif";
    if (config.font === "serif") fontStack = "'Playfair Display', serif";
    if (config.font === "mono") fontStack = "'Source Code Pro', monospace";

    let radiusVal = "0.5rem"; // md
    if (config.radius === "none") radiusVal = "0px";
    if (config.radius === "sm") radiusVal = "0.25rem";
    if (config.radius === "lg") radiusVal = "1rem";
    if (config.radius === "full") radiusVal = "1.5rem";

    let shadowVal =
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
    if (config.shadows === "flat") shadowVal = "none";
    if (config.shadows === "deep")
      shadowVal =
        "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)";

    // Generate Wallpaper CSS
    let bgImage = "none";
    let bgSize = "auto";
    if (config.wallpaper === "dots") {
      bgImage = "radial-gradient(#333 1px, transparent 1px)";
      bgSize = "20px 20px";
    } else if (config.wallpaper === "grid") {
      bgImage =
        "linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)";
      bgSize = "40px 40px";
    }

    const css = `
            :root {
                /* --- TYPOGRAPHY & SCALE --- */
                --ui-base-scale: ${config.uiScale / 100};
                font-size: calc(16px * var(--ui-base-scale));
                
                /* --- DYNAMIC COLORS --- */
                --accent: ${config.accent} !important;
                --accent-hover: ${accentHover} !important;
                --accent-glow: rgba(${rgb.r}, ${rgb.g}, ${
      rgb.b
    }, 0.35) !important;
                
                /* --- GLASSMORPHISM --- */
                --glass-blur: ${config.blurStrength}px;
                --glass-bg: rgba(26, 26, 26, ${config.glassOpacity}) !important;
            }

            /* --- GLOBAL OVERRIDES --- */
            body {
                font-family: ${fontStack} !important;
                background-image: ${bgImage} !important;
                background-size: ${bgSize} !important;
            }

            /* Apply Blur to Glass Panes */
            .glass-pane, .modal-content, .bg-bg-secondary\/50 {
                backdrop-filter: blur(var(--glass-blur)) !important;
                -webkit-backdrop-filter: blur(var(--glass-blur)) !important;
                box-shadow: ${shadowVal} !important;
            }

            /* --- RADIUS CONTROL --- */
            /* We use a wildcard to enforce radius preference on key UI elements */
            .rounded-lg, .rounded-xl, .rounded-md, .rounded, .btn, .form-input, .glass-pane {
                border-radius: ${radiusVal} !important;
            }
            /* Exception for circular avatars/buttons */
            .rounded-full { border-radius: 9999px !important; }

            /* --- DENSITY CONTROL --- */
            ${
              config.density === "compact"
                ? `
                .p-4 { padding: 0.75rem !important; }
                .p-6 { padding: 1rem !important; }
                .py-3 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                .px-4 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
                .gap-6 { gap: 1rem !important; }
                .text-3xl { font-size: 1.5rem !important; line-height: 2rem !important; }
                .h-12 { height: 2.5rem !important; }
                .h-16 { height: 3.5rem !important; }
                .table-pro th, .table-pro td { padding: 0.5rem 1rem !important; }
            `
                : ""
            }

            /* --- ANIMATION CONTROL --- */
            ${
              !config.animations
                ? `
                *, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                }
            `
                : ""
            }
        `;

    styleSheet.innerHTML = css;
    localStorage.setItem(PREF_KEY, JSON.stringify(config));
  };

  // --- 4. UI COMPONENT GENERATOR ---
  const renderControlPanel = (container) => {
    // Remove existing panel if any
    const existing = document.getElementById("visual-engine-panel");
    if (existing) existing.remove();

    const panel = document.createElement("div");
    panel.id = "visual-engine-panel";
    panel.className = "visual-engine-card mb-8 animate-fade-in";

    // Inject Custom Styles for the Panel Elements
    const panelStyles = `
            <style>
                .visual-engine-card {
                    background: rgba(18, 18, 20, 0.85);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    color: #fff;
                }
                .ve-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 1.5rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }
                .ve-section-title {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #9ca3af;
                    margin-bottom: 0.75rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .ve-slider-container {
                    margin-bottom: 1rem;
                }
                .ve-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 99px;
                    outline: none;
                    transition: background 0.2s;
                }
                .ve-slider:hover {
                    background: rgba(255,255,255,0.15);
                }
                .ve-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--accent);
                    cursor: pointer;
                    box-shadow: 0 0 15px var(--accent-glow);
                    border: 2px solid #fff;
                    transition: transform 0.1s ease;
                }
                .ve-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                }
                .ve-swatch-grid {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }
                .ve-color-swatch {
                    width: 2.25rem;
                    height: 2.25rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                    border: 2px solid transparent;
                }
                .ve-color-swatch:hover {
                    transform: translateY(-3px) scale(1.05);
                }
                .ve-color-swatch.active {
                    border-color: white;
                    box-shadow: 0 0 15px var(--accent-glow);
                }
                .ve-btn-group {
                    display: flex;
                    background: rgba(0,0,0,0.3);
                    padding: 0.25rem;
                    border-radius: 0.75rem;
                    gap: 0.25rem;
                }
                .ve-option-btn {
                    flex: 1;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #9ca3af;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    border-radius: 0.5rem;
                }
                .ve-option-btn:hover {
                    color: white;
                }
                .ve-option-btn.active {
                    background: var(--accent);
                    color: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .ve-value-display {
                    font-family: 'Source Code Pro', monospace;
                    font-size: 0.75rem;
                    color: var(--accent);
                    background: rgba(255,255,255,0.05);
                    padding: 2px 6px;
                    border-radius: 4px;
                }
            </style>
        `;

    // Helper for sections
    const createSection = (title, icon, content) => `
            <div class="mb-8 last:mb-0">
                <h5 class="ve-section-title">
                    <i data-lucide="${icon}" class="w-4 h-4 text-accent"></i> ${title}
                </h5>
                ${content}
            </div>
        `;

    // Helper for segmented controls
    const createSegmentedControl = (key, options) => `
            <div class="ve-btn-group">
                ${options
                  .map(
                    (opt) => `
                    <button class="ve-option-btn ${
                      config[key] === opt.value ? "active" : ""
                    }"
                        onclick="window.updateCashShilpoVisual('${key}', '${
                      opt.value
                    }')">
                        ${opt.label}
                    </button>
                `
                  )
                  .join("")}
            </div>
        `;

    // Helper for sliders
    const createSlider = (key, min, max, unit, label) => `
            <div class="ve-slider-container">
                <div class="flex justify-between text-xs text-gray-400 mb-2">
                    <span>${label}</span>
                    <span class="ve-value-display">${config[key]}${unit}</span>
                </div>
                <input type="range" min="${min}" max="${max}" value="${config[key]}" 
                    class="ve-slider"
                    oninput="window.updateCashShilpoVisual('${key}', this.value)">
            </div>
        `;

    // Helper for color picker
    const presets = [
      "#007bff",
      "#10b981",
      "#8b5cf6",
      "#f59e0b",
      "#ec4899",
      "#ef4444",
      "#06b6d4",
      "#84cc16",
    ];
    const colorPickerHTML = `
            <div class="ve-swatch-grid">
                ${presets
                  .map(
                    (c) => `
                    <button class="ve-color-swatch ${
                      config.accent === c ? "active" : ""
                    }" 
                        style="background-color: ${c};" 
                        onclick="window.updateCashShilpoVisual('accent', '${c}')">
                    </button>
                `
                  )
                  .join("")}
                <div class="relative group">
                    <input type="color" value="${config.accent}" 
                        class="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        oninput="window.updateCashShilpoVisual('accent', this.value)">
                    <div class="ve-color-swatch flex items-center justify-center bg-gray-800 border-dashed border-gray-600 border-2 group-hover:border-white">
                        <i data-lucide="plus" class="w-4 h-4 text-gray-400 group-hover:text-white"></i>
                    </div>
                </div>
            </div>
        `;

    panel.innerHTML = `
            ${panelStyles}
            <div class="ve-header">
                <div>
                    <h2 class="text-xl font-bold flex items-center gap-2">
                        <i data-lucide="palette" class="w-5 h-5 text-accent"></i> Visual Command Center
                    </h2>
                    <p class="text-xs text-gray-400 mt-1">Personalize your CashShilpo experience</p>
                </div>
                <button class="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1" onclick="window.resetCashShilpoVisuals()">
                    <i data-lucide="rotate-ccw" class="w-3 h-3"></i> Reset
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <!-- Column 1 -->
                <div>
                    ${createSection(
                      "Brand Identity",
                      "paint-bucket",
                      colorPickerHTML
                    )}
                    
                    ${createSection(
                      "Display Scale",
                      "monitor",
                      createSlider("uiScale", 80, 120, "%", "Zoom Level")
                    )}

                    ${createSection(
                      "Typography",
                      "type",
                      createSegmentedControl("font", [
                        { label: "Modern", value: "inter" },
                        { label: "Serif", value: "serif" },
                        { label: "Mono", value: "mono" },
                      ])
                    )}
                </div>

                <!-- Column 2 -->
                <div>
                    ${createSection(
                      "Glass Physics",
                      "droplets",
                      `
                        ${createSlider(
                          "blurStrength",
                          0,
                          40,
                          "px",
                          "Blur Intensity"
                        )}
                        ${createSlider(
                          "glassOpacity",
                          0.1,
                          1.0,
                          "",
                          "Bg Opacity"
                        )}
                    `
                    )}

                    ${createSection(
                      "Interface Layout",
                      "layout",
                      `
                         <div class="space-y-6">
                            <div>
                                <p class="text-xs text-gray-500 mb-2">Spacing Density</p>
                                ${createSegmentedControl("density", [
                                  { label: "Relaxed", value: "comfortable" },
                                  { label: "Compact", value: "compact" },
                                ])}
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-2">Corner Radius</p>
                                ${createSegmentedControl("radius", [
                                  { label: "Sharp", value: "none" },
                                  { label: "Smooth", value: "md" },
                                  { label: "Round", value: "full" },
                                ])}
                            </div>
                        </div>
                    `
                    )}
                </div>
            </div>

            <!-- Bottom Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-2 pt-6 border-t border-gray-800">
                 ${createSection(
                   "Background Pattern",
                   "image",
                   createSegmentedControl("wallpaper", [
                     { label: "Clean", value: "none" },
                     { label: "Dots", value: "dots" },
                     { label: "Grid", value: "grid" },
                   ])
                 )}
                 ${createSection(
                   "Effects & Depth",
                   "layers",
                   createSegmentedControl("shadows", [
                     { label: "Flat", value: "flat" },
                     { label: "Soft", value: "soft" },
                     { label: "Deep", value: "deep" },
                   ]) +
                     `<div class="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                        <span class="text-sm text-gray-300">Enable Animations</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${
                              config.animations ? "checked" : ""
                            } 
                                class="sr-only peer"
                                onchange="window.updateCashShilpoVisual('animations', this.checked)">
                            <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                    </div>`
                 )}
            </div>
        `;

    // Inject into the settings form logic
    const header = container.querySelector("h1");
    if (header) {
      header.insertAdjacentElement("afterend", panel);
      lucide.createIcons();
    } else {
      container.prepend(panel);
      lucide.createIcons();
    }
  };

  // --- 5. PUBLIC API & INIT ---
  window.updateCashShilpoVisual = (key, value) => {
    // Parse numbers for sliders
    if (["blurStrength", "glassOpacity", "uiScale"].includes(key)) {
      value = parseFloat(value);
    }
    config[key] = value;
    updateStyles();

    // Re-render panel to update active states/slider labels without full reload
    const panel = document.getElementById("visual-engine-panel");
    if (panel) {
      // Find parent and re-render. A bit hacky but keeps UI in sync.
      const parent = panel.parentElement;
      renderControlPanel(parent);
    }
  };

  window.resetCashShilpoVisuals = () => {
    config = { ...defaults };
    updateStyles();
    const panel = document.getElementById("visual-engine-panel");
    if (panel) renderControlPanel(panel.parentElement);
  };

  // --- 6. OBSERVER (To inject into Settings View dynamically) ---
  const observer = new MutationObserver((mutations) => {
    const settingsForm = document.getElementById("settings-form");
    const existingPanel = document.getElementById("visual-engine-panel");

    if (settingsForm && !existingPanel) {
      renderControlPanel(settingsForm);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial Run
  updateStyles();
})();
