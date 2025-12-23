/**
 * CashShilpo Theme Manager Module
 * Features:
 * 1. Injects a robust Theme Selector into the Settings page.
 * 2. Manages CSS variables for multiple premium themes.
 * 3. Persists user preference via LocalStorage.
 * 4. Includes Default, Platinum Light, Obsidian Elite, Midnight, Forest, Crimson, Cyberpunk, Solar, Royal.
 * 5. NEW: Custom Theme Builder - Users can define their own palette.
 */

(function () {
  console.log("CashShilpo Theme Manager: Module Loaded");

  // 1. CONFIG & DEFINITIONS
  const PREF_KEY = "cashshilpo_theme_pref";
  const CUSTOM_COLORS_KEY = "cashshilpo_custom_colors";

  let currentTheme = localStorage.getItem(PREF_KEY) || "default";

  // Default configuration for the custom theme (starts as a dark theme variant)
  // using const to ensure the object structure, but we must be careful not to mutate it by reference
  const defaultCustomColors = {
    "--bg-primary": "#121212",
    "--bg-secondary": "#1e1e1e",
    "--bg-tertiary": "#2c2c2c",
    "--text-primary": "#ffffff",
    "--text-secondary": "#b3b3b3",
    "--accent": "#3b82f6",
    "--accent-hover": "#2563eb",
    "--border-color": "#333333",
  };

  // Load saved custom colors or use defaults.
  // CRITICAL FIX: We must spread {...defaultCustomColors} to create a COPY,
  // otherwise editing customColors mutates defaultCustomColors in memory.
  let customColors = JSON.parse(localStorage.getItem(CUSTOM_COLORS_KEY)) || {
    ...defaultCustomColors,
  };

  const themes = {
    default: {
      name: "Default Dark",
      icon: "moon",
      colors: null, // Uses default CSS variables defined in index.html
    },
    light: {
      name: "Platinum Light",
      icon: "sun",
      colors: {
        "--bg-primary": "#f6f9fc",
        "--bg-secondary": "#ffffff",
        "--bg-tertiary": "#f1f5f9",
        "--glass-bg": "rgba(255, 255, 255, 0.9)",
        "--border-color": "#e6eaf1",
        "--border-color-strong": "#d1d9e6",
        "--text-primary": "#0f172a",
        "--text-secondary": "#334155",
        "--accent": "#635bff",
        "--accent-hover": "#4b45e0",
        "--accent-glow": "rgba(99, 91, 255, 0.15)",
        "--success": "#059669",
        "--danger": "#dc2626",
        "--warning": "#d97706",
      },
    },
    obsidian: {
      name: "Obsidian Elite",
      icon: "gem",
      colors: {
        "--bg-primary": "#000000",
        "--bg-secondary": "#0f0f0f",
        "--bg-tertiary": "#1a1a1a",
        "--glass-bg": "rgba(15, 15, 15, 0.9)",
        "--border-color": "#333333",
        "--border-color-strong": "#d4af37",
        "--text-primary": "#ffffff",
        "--text-secondary": "#a1a1aa",
        "--accent": "#d4af37",
        "--accent-hover": "#b4941f",
        "--accent-glow": "rgba(212, 175, 55, 0.25)",
        "--success": "#10b981",
        "--danger": "#ef4444",
        "--warning": "#eab308",
      },
    },
    midnight: {
      name: "Midnight Blue",
      icon: "cloud-moon",
      colors: {
        "--bg-primary": "#020617",
        "--bg-secondary": "#0f172a",
        "--bg-tertiary": "#1e293b",
        "--glass-bg": "rgba(15, 17, 42, 0.7)",
        "--border-color": "#1e293b",
        "--border-color-strong": "#334155",
        "--text-primary": "#f8fafc",
        "--text-secondary": "#94a3b8",
        "--accent": "#38bdf8",
        "--accent-hover": "#0ea5e9",
        "--accent-glow": "rgba(56, 189, 248, 0.2)",
      },
    },
    forest: {
      name: "Deep Forest",
      icon: "trees",
      colors: {
        "--bg-primary": "#052e16",
        "--bg-secondary": "#064e3b",
        "--bg-tertiary": "#065f46",
        "--glass-bg": "rgba(6, 78, 59, 0.7)",
        "--border-color": "#065f46",
        "--border-color-strong": "#047857",
        "--text-primary": "#ecfdf5",
        "--text-secondary": "#a7f3d0",
        "--accent": "#34d399",
        "--accent-hover": "#10b981",
        "--accent-glow": "rgba(52, 211, 153, 0.2)",
      },
    },
    crimson: {
      name: "Crimson Dusk",
      icon: "fire",
      colors: {
        "--bg-primary": "#1a0505",
        "--bg-secondary": "#2b0a0a",
        "--bg-tertiary": "#450a0a",
        "--glass-bg": "rgba(43, 10, 10, 0.8)",
        "--border-color": "#450a0a",
        "--border-color-strong": "#7f1d1d",
        "--text-primary": "#ffe4e6",
        "--text-secondary": "#fda4af",
        "--accent": "#f43f5e",
        "--accent-hover": "#e11d48",
        "--accent-glow": "rgba(244, 63, 94, 0.3)",
      },
    },
    cyberpunk: {
      name: "Cyberpunk",
      icon: "zap",
      colors: {
        "--bg-primary": "#09090b",
        "--bg-secondary": "#18181b",
        "--bg-tertiary": "#27272a",
        "--glass-bg": "rgba(24, 24, 27, 0.8)",
        "--border-color": "#3f3f46",
        "--border-color-strong": "#52525b",
        "--text-primary": "#ffff00",
        "--text-secondary": "#22d3ee",
        "--accent": "#d946ef",
        "--accent-hover": "#c026d3",
        "--accent-glow": "rgba(217, 70, 239, 0.4)",
      },
    },
    solar: {
      name: "Solar Flare",
      icon: "sun",
      colors: {
        "--bg-primary": "#1c1917",
        "--bg-secondary": "#292524",
        "--bg-tertiary": "#44403c",
        "--glass-bg": "rgba(41, 37, 36, 0.8)",
        "--border-color": "#44403c",
        "--border-color-strong": "#57534e",
        "--text-primary": "#fff7ed",
        "--text-secondary": "#fdba74",
        "--accent": "#f97316",
        "--accent-hover": "#ea580c",
        "--accent-glow": "rgba(249, 115, 22, 0.25)",
        "--success": "#84cc16",
        "--warning": "#facc15",
      },
    },
    royal: {
      name: "Royal Velvet",
      icon: "crown",
      colors: {
        "--bg-primary": "#170f31",
        "--bg-secondary": "#241a4a",
        "--bg-tertiary": "#352563",
        "--glass-bg": "rgba(36, 26, 74, 0.8)",
        "--border-color": "#352563",
        "--border-color-strong": "#4c3690",
        "--text-primary": "#faf5ff",
        "--text-secondary": "#e9d5ff",
        "--accent": "#a855f7",
        "--accent-hover": "#9333ea",
        "--accent-glow": "rgba(168, 85, 247, 0.3)",
        "--success": "#2dd4bf",
      },
    },
    // CUSTOM THEME ENTRY
    custom: {
      name: "Custom",
      icon: "palette",
      colors: customColors, // Will be dynamically overridden in applyTheme
    },
  };

  // 2. CSS INJECTION
  function injectStyles() {
    const styleId = "cashshilpo-theme-styles";
    if (document.getElementById(styleId)) return;

    let css = `
            /* Theme Toggle Container */
            #theme-selector-card {
                background-color: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin-bottom: 2rem;
                animation: fadeIn 0.3s ease-in-out;
            }
            .theme-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            .theme-option {
                cursor: pointer;
                border: 2px solid var(--border-color);
                background-color: var(--bg-tertiary);
                border-radius: 0.5rem;
                padding: 1rem;
                text-align: center;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }
            .theme-option:hover {
                transform: translateY(-2px);
                border-color: var(--accent);
            }
            .theme-option.active {
                border-color: var(--accent);
                background-color: var(--accent-glow);
                box-shadow: 0 0 15px var(--accent-glow);
            }
            .theme-preview {
                height: 24px;
                width: 100%;
                border-radius: 4px;
                margin-bottom: 8px;
                background: linear-gradient(135deg, var(--preview-bg) 0%, var(--preview-bg) 50%, var(--preview-sec) 50%, var(--preview-sec) 100%);
                border: 1px solid var(--border-color-strong);
            }

            /* Custom Theme Editor Styles */
            #custom-theme-editor {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid var(--border-color);
                display: none; /* Hidden by default */
            }
            .color-input-group {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
            }
            .color-field {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .color-field label {
                font-size: 0.875rem;
                color: var(--text-secondary);
                flex: 1;
            }
            .color-field input[type="color"] {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                padding: 0;
                background: none;
            }
            
            /* === Premium Light Theme Specific Enhancements === */
            
            body.theme-light .card, 
            body.theme-light #theme-selector-card,
            body.theme-light .bg-secondary { 
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
                border: 1px solid #e6eaf1 !important;
            }

            body.theme-light button:not([class*="bg-"]):not([class*="btn-primary"]):hover, 
            body.theme-light a:not([class*="bg-"]):hover, 
            body.theme-light div[role="button"]:hover,
            body.theme-light .clickable:hover {
                color: #0f172a !important;
                background-color: #f1f5f9 !important;
            }
            
            body.theme-light input, 
            body.theme-light select, 
            body.theme-light textarea {
                background-color: #ffffff !important;
                color: #0f172a !important;
                border: 1px solid #cbd5e1 !important;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            body.theme-light input:focus, 
            body.theme-light select:focus, 
            body.theme-light textarea:focus {
                border-color: var(--accent) !important;
                box-shadow: 0 0 0 3px var(--accent-glow) !important;
                outline: none !important;
            }
            
            body.theme-light canvas {
                filter: contrast(1.05); 
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;

    // Generate CSS classes for PREDEFINED themes (Custom handled dynamically)
    Object.entries(themes).forEach(([key, theme]) => {
      if (theme.colors && key !== "custom") {
        css += `body.theme-${key} {`;
        Object.entries(theme.colors).forEach(([varName, value]) => {
          css += `${varName}: ${value} !important;`;
        });
        css += `}`;
      }
    });

    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
  }

  // 3. UI INJECTION
  function injectThemeSelector(container) {
    if (container.querySelector("#theme-selector-card")) return;

    const header = container.querySelector("h1");
    const langCard = document.getElementById("lang-toggle-card");

    const card = document.createElement("div");
    card.id = "theme-selector-card";

    let gridHTML = "";
    Object.entries(themes).forEach(([key, theme]) => {
      let bg = "#0a0a0a";
      let sec = "#121212";

      if (key === "custom") {
        bg = customColors["--bg-primary"];
        sec = customColors["--bg-secondary"];
      } else if (theme.colors) {
        bg = theme.colors["--bg-primary"];
        sec = theme.colors["--bg-secondary"];
      }

      gridHTML += `
                <div class="theme-option ${
                  currentTheme === key ? "active" : ""
                }" 
                     id="theme-opt-${key}"
                     data-theme="${key}" 
                     style="--preview-bg: ${bg}; --preview-sec: ${sec};">
                    <div class="theme-preview" id="preview-${key}"></div>
                    <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${
                      theme.name
                    }</span>
                </div>
            `;
    });

    const customEditorHTML = `
            <div id="custom-theme-editor">
                <h5 style="color: var(--text-primary); font-weight: 600; margin-bottom: 1rem;">Customize Your Palette</h5>
                <div class="color-input-group">
                    <div class="color-field">
                        <input type="color" id="cp-bg-primary" value="${customColors["--bg-primary"]}">
                        <label>Main Background</label>
                    </div>
                    <div class="color-field">
                        <input type="color" id="cp-bg-secondary" value="${customColors["--bg-secondary"]}">
                        <label>Card Background</label>
                    </div>
                    <div class="color-field">
                        <input type="color" id="cp-bg-tertiary" value="${customColors["--bg-tertiary"]}">
                        <label>Hover Background</label>
                    </div>
                    <div class="color-field">
                        <input type="color" id="cp-border" value="${customColors["--border-color"]}">
                        <label>Borders</label>
                    </div>
                    <div class="color-field">
                        <input type="color" id="cp-text-primary" value="${customColors["--text-primary"]}">
                        <label>Primary Text</label>
                    </div>
                    <div class="color-field">
                        <input type="color" id="cp-text-secondary" value="${customColors["--text-secondary"]}">
                        <label>Secondary Text</label>
                    </div>
                    <div class="color-field">
                        <input type="color" id="cp-accent" value="${customColors["--accent"]}">
                        <label>Accent Color</label>
                    </div>
                    <div class="color-field">
                        <input type="color" id="cp-accent-hover" value="${customColors["--accent-hover"]}">
                        <label>Accent Hover</label>
                    </div>
                </div>
                <div style="text-align: right;">
                    <button id="reset-custom-theme" class="btn btn-sm" style="background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-color); padding: 5px 10px; border-radius: 4px; cursor: pointer;">Reset Custom Defaults</button>
                </div>
            </div>
        `;

    card.innerHTML = `
            <div>
                <h4 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">Interface Theme</h4>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">Select a look and feel for your workspace.</p>
            </div>
            <div class="theme-grid">
                ${gridHTML}
            </div>
            ${customEditorHTML}
        `;

    if (langCard) {
      container.insertBefore(card, langCard);
    } else if (header && header.nextSibling) {
      header.parentNode.insertBefore(card, header.nextSibling);
    } else {
      container.prepend(card);
    }

    // Attach Event Listeners
    card.querySelectorAll(".theme-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        applyTheme(opt.dataset.theme);
        card
          .querySelectorAll(".theme-option")
          .forEach((o) => o.classList.remove("active"));
        opt.classList.add("active");
      });
    });

    // Custom Theme Inputs
    const inputMap = {
      "cp-bg-primary": "--bg-primary",
      "cp-bg-secondary": "--bg-secondary",
      "cp-bg-tertiary": "--bg-tertiary",
      "cp-border": "--border-color",
      "cp-text-primary": "--text-primary",
      "cp-text-secondary": "--text-secondary",
      "cp-accent": "--accent",
      "cp-accent-hover": "--accent-hover",
    };

    Object.entries(inputMap).forEach(([id, cssVar]) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", (e) => {
          const newVal = e.target.value;
          customColors[cssVar] = newVal;

          // Update live if currently on custom theme
          if (currentTheme === "custom") {
            document.body.style.setProperty(cssVar, newVal);
            // Also update preview box
            const preview = document.getElementById("preview-custom");
            const cardOpt = document.getElementById("theme-opt-custom");
            if (preview && cardOpt) {
              cardOpt.style.setProperty(
                "--preview-bg",
                customColors["--bg-primary"]
              );
              cardOpt.style.setProperty(
                "--preview-sec",
                customColors["--bg-secondary"]
              );
            }
          }

          // Save to storage
          localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(customColors));
        });
      }
    });

    // Reset Button Logic
    const resetBtn = document.getElementById("reset-custom-theme");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        // Restore defaults by cloning
        customColors = { ...defaultCustomColors };
        localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(customColors));

        // Update input values
        Object.keys(inputMap).forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = customColors[inputMap[id]];
        });

        // Update Preview Card immediately
        const cardOpt = document.getElementById("theme-opt-custom");
        if (cardOpt) {
          cardOpt.style.setProperty(
            "--preview-bg",
            customColors["--bg-primary"]
          );
          cardOpt.style.setProperty(
            "--preview-sec",
            customColors["--bg-secondary"]
          );
        }

        if (currentTheme === "custom") {
          applyTheme("custom"); // Re-apply to refresh view
        }
      });
    }

    // Ensure editor visibility matches current state on load
    const editor = document.getElementById("custom-theme-editor");
    if (editor) {
      editor.style.display = currentTheme === "custom" ? "block" : "none";
    }
  }

  // 4. THEME APPLICATION LOGIC
  function applyTheme(themeKey) {
    // Remove all pre-defined theme classes
    document.body.classList.remove(
      ...Object.keys(themes).map((k) => `theme-${k}`)
    );

    // Variables to clean up if switching AWAY from custom
    const customVars = [
      "--bg-primary",
      "--bg-secondary",
      "--bg-tertiary",
      "--glass-bg",
      "--border-color",
      "--border-color-strong",
      "--text-primary",
      "--text-secondary",
      "--accent",
      "--accent-hover",
      "--accent-glow",
      "--success",
      "--danger",
      "--warning",
    ];

    if (themeKey === "custom") {
      // 1. Add class
      document.body.classList.add("theme-custom");

      // 2. Apply Dynamic Variables directly to body style
      Object.entries(customColors).forEach(([key, val]) => {
        document.body.style.setProperty(key, val);
      });

      // 3. Show Editor
      const editor = document.getElementById("custom-theme-editor");
      if (editor) editor.style.display = "block";
    } else {
      // 1. Clean up inline styles (so pre-defined class takes over)
      customVars.forEach((v) => document.body.style.removeProperty(v));

      // 2. Apply standard class
      if (themes[themeKey] && themes[themeKey].colors) {
        document.body.classList.add(`theme-${themeKey}`);
      }

      // 3. Hide Editor
      const editor = document.getElementById("custom-theme-editor");
      if (editor) editor.style.display = "none";
    }

    localStorage.setItem(PREF_KEY, themeKey);
    currentTheme = themeKey;
    window.dispatchEvent(new Event("resize")); // Redraw charts
  }

  // 5. OBSERVER
  const observer = new MutationObserver((mutations) => {
    const settingsForm = document.getElementById("settings-form");
    if (settingsForm && !document.getElementById("theme-selector-card")) {
      injectThemeSelector(settingsForm);
    }
  });

  // 6. INITIALIZE
  injectStyles();
  applyTheme(currentTheme);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
