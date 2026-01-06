/**
 * CashShilpo HyperVoice OS (Quantum Edition)
 * Features:
 * - Bilingual Speech Recognition (English & Bangla)
 * - "Ghost Clicker" Engine: Maps voice commands to physical DOM clicks.
 * - Floating Holographic Interface.
 * - Reactive Audio Visualizer.
 */

(function () {
  console.log("HyperVoice OS: Quantum Core Online");

  // --- CONFIGURATION ---
  const CONFIG_KEY = "hypervoice_config";
  const DEFAULT_CONFIG = {
    active: false,
    language: "en-US", // 'en-US' or 'bn-BD'
    autoRestart: true,
    feedbackVoice: true,
  };

  let config = JSON.parse(localStorage.getItem(CONFIG_KEY)) || DEFAULT_CONFIG;
  let recognition = null;
  let isListening = false;

  // --- COMMAND MAPPING (The Brain) ---
  // Maps spoken phrases (regex) to DOM Selectors
  const COMMAND_MAP = [
    // --- NAVIGATION (ENGLISH) ---
    {
      triggers: [/open dashboard/i, /go to dashboard/i, /show dashboard/i],
      selector: '[data-view="dashboard"]',
    },
    {
      triggers: [/open pos/i, /go to pos/i, /point of sale/i],
      selector: '[data-view="pos"]',
    },
    {
      triggers: [/open invoices/i, /show invoices/i],
      selector: '[data-view="invoices"]',
    },
    {
      triggers: [/open inventory/i, /show inventory/i, /stock/i],
      selector: '[data-view="inventory"]',
    },
    {
      triggers: [/open customers/i, /show customers/i],
      selector: '[data-view="customers"]',
    },
    {
      triggers: [/open reports/i, /show reports/i, /analytics/i],
      selector: '[data-view="reports"]',
    },
    {
      triggers: [/open settings/i, /configure/i],
      selector: '[data-view="settings"]',
    },

    // --- NAVIGATION (BANGLA) ---
    {
      triggers: [/ড্যাশবোর্ড/i, /ড্যাশবোর্ড খুলুন/i, /ড্যাশবোর্ড দেখান/i],
      selector: '[data-view="dashboard"]',
    },
    {
      triggers: [/পস/i, /পস খুলুন/i, /বিক্রয়/i],
      selector: '[data-view="pos"]',
    },
    { triggers: [/ইনভয়েস/i, /রশিদ/i], selector: '[data-view="invoices"]' },
    {
      triggers: [/ইনভেন্টরি/i, /স্টক/i, /পণ্য/i],
      selector: '[data-view="inventory"]',
    },
    { triggers: [/কাস্টমার/i, /গ্রাহক/i], selector: '[data-view="customers"]' },
    { triggers: [/রিপোর্ট/i, /প্রতিবেদন/i], selector: '[data-view="reports"]' },
    { triggers: [/সেটিংস/i, /সেটিং/i], selector: '[data-view="settings"]' },

    // --- ACTIONS (GLOBAL) ---
    {
      triggers: [
        /close/i,
        /close modal/i,
        /close tab/i,
        /বন্ধ করুন/i,
        /বাদ দিন/i,
      ],
      selector: [
        '[data-action="close-modal"]',
        '[data-action="close-tab"]',
        ".modal-overlay",
      ],
    },
    {
      triggers: [/search/i, /find/i, /খুঁজুন/i, /অনুসন্ধান/i],
      selector: '[data-action="open-search"]',
    },
    {
      triggers: [/new sale/i, /create sale/i, /নতুন বিক্রয়/i],
      selector: '[data-action="new-sale"]',
    },
    {
      triggers: [/add product/i, /new item/i, /নতুন পণ্য/i],
      selector: '[data-action="add-product"]',
    },
    {
      triggers: [/full screen/i, /fullscreen/i, /বড় পর্দা/i],
      selector: '[data-action="toggle-fullscreen"]',
    },
  ];

  // --- STYLES INJECTION ---
  function injectStyles() {
    if (document.getElementById("hypervoice-styles")) return;
    const css = `
            /* Settings Panel Styles */
            #hyper-voice-os-panel {
                background: linear-gradient(145deg, #0f172a, #1e293b);
                border: 1px solid #334155;
                border-radius: 16px;
                overflow: hidden;
                color: white;
            }
            .hv-header {
                padding: 1.5rem;
                background: rgba(0,0,0,0.2);
                display: flex; justify-content: space-between; align-items: center;
            }
            .hv-viz-box {
                height: 80px; display: flex; align-items: center; justify-content: center;
                background: rgba(0,0,0,0.3); border-y: 1px solid #334155;
            }
            .hv-bar {
                width: 6px; margin: 0 2px; background: #38bdf8;
                height: 10px; border-radius: 4px; transition: height 0.1s ease;
            }
            .hv-controls { padding: 1.5rem; display: grid; gap: 1rem; }

            /* Floating Holographic Orb */
            #hv-orb {
                position: fixed; bottom: 30px; right: 30px;
                width: 60px; height: 60px;
                border-radius: 50%;
                background: rgba(15, 23, 42, 0.9);
                border: 2px solid #38bdf8;
                box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
                display: flex; align-items: center; justify-content: center;
                z-index: 9999; cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
            }
            #hv-orb:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(56, 189, 248, 0.6); }
            #hv-orb.listening {
                border-color: #4ade80;
                animation: pulse-green 2s infinite;
            }
            #hv-orb.processing {
                border-color: #facc15;
                animation: spin-slow 3s linear infinite;
            }
            #hv-orb i { transition: all 0.3s; }
            
            /* Status Toast */
            #hv-status {
                position: fixed; bottom: 100px; right: 30px;
                background: rgba(15, 23, 42, 0.95);
                color: #e2e8f0; padding: 8px 16px;
                border-radius: 8px; font-size: 12px;
                border: 1px solid #334155;
                opacity: 0; transform: translateY(10px);
                transition: all 0.3s; pointer-events: none; z-index: 9998;
            }
            #hv-status.visible { opacity: 1; transform: translateY(0); }

            @keyframes pulse-green {
                0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
                70% { box-shadow: 0 0 0 15px rgba(74, 222, 128, 0); }
                100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
            }
            @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        `;
    const style = document.createElement("style");
    style.id = "hypervoice-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // --- CORE LOGIC: GHOST CLICKER ---
  function executeCommand(transcript) {
    console.log(`[Voice] Analyzing: "${transcript}"`);
    showStatus(`Heard: "${transcript}"`);

    const lowerTranscript = transcript.toLowerCase();
    let matched = false;

    for (const cmd of COMMAND_MAP) {
      const isMatch = cmd.triggers.some((t) => t.test(lowerTranscript));
      if (isMatch) {
        let targets = cmd.selector;
        if (!Array.isArray(targets)) targets = [targets];

        // Try finding the element (handling multiple selectors for "Close")
        for (const sel of targets) {
          // Try to find a visible element matching the selector
          // For "Close", we prefer the active tab's close button or an open modal's close button
          let el = null;
          if (sel === '[data-action="close-tab"]') {
            // Find the close button of the ACTIVE tab
            el = document.querySelector(
              '.main-tab.active [data-action="close-tab"]'
            );
          } else if (sel === '[data-action="close-modal"]') {
            // Find the close button of the topmost visible modal
            const openModals = document.querySelectorAll(
              ".modal-overlay:not(.opacity-0)"
            );
            if (openModals.length > 0) {
              el = openModals[openModals.length - 1].querySelector(
                '[data-action="close-modal"]'
              );
            }
          } else {
            // Standard selection
            el = document.querySelector(sel);
          }

          if (el && el.offsetParent !== null) {
            // Check if visible
            console.log(`[Voice] Executing click on: ${sel}`);
            // Highlight effect before clicking
            const originalTransition = el.style.transition;
            const originalTransform = el.style.transform;
            el.style.transition = "all 0.2s";
            el.style.transform = "scale(1.1)";
            el.style.boxShadow = "0 0 15px var(--accent)";

            setTimeout(() => {
              el.click();
              // Reset styles
              el.style.transform = originalTransform;
              el.style.boxShadow = "";
              setTimeout(() => {
                el.style.transition = originalTransition;
              }, 200);
            }, 300);

            matched = true;
            speakFeedback("Executing");
            break; // Stop after first successful action
          }
        }
      }
      if (matched) break;
    }

    if (!matched) {
      showStatus("Command not recognized");
    }
  }

  function speakFeedback(text) {
    if (!config.feedbackVoice) return;
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    synth.speak(utter);
  }

  function showStatus(text) {
    const toast = document.getElementById("hv-status");
    if (toast) {
      toast.textContent = text;
      toast.classList.add("visible");
      setTimeout(() => toast.classList.remove("visible"), 3000);
    }
  }

  // --- SPEECH RECOGNITION SETUP ---
  function initSpeechRecognition() {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web Speech API not supported.");
      alert(
        "Voice OS requires a Chromium-based browser (Chrome, Edge, Brave)."
      );
      return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // We restart manually for better control
    recognition.interimResults = false;
    recognition.lang = config.language; // 'en-US' or 'bn-BD'

    recognition.onstart = () => {
      isListening = true;
      updateOrbState("listening");
      showStatus("Listening...");
    };

    recognition.onend = () => {
      isListening = false;
      updateOrbState("idle");
      if (config.active && config.autoRestart) {
        // Small delay before restarting to prevent CPU hogging
        setTimeout(() => {
          if (config.active) recognition.start();
        }, 500);
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      executeCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.warn("Voice Error:", event.error);
      if (event.error === "not-allowed") {
        config.active = false;
        saveConfig();
        updateSettingsUI();
        alert("Microphone access denied.");
      }
    };
  }

  // --- UI COMPONENTS ---

  // 1. The Floating Orb
  function createOrb() {
    if (document.getElementById("hv-orb")) return;

    const orb = document.createElement("div");
    orb.id = "hv-orb";
    orb.innerHTML = `<i data-lucide="mic" class="w-6 h-6 text-white"></i>`;
    document.body.appendChild(orb);

    const status = document.createElement("div");
    status.id = "hv-status";
    document.body.appendChild(status);

    orb.addEventListener("click", () => {
      config.active = !config.active;
      saveConfig();
      toggleVoiceSystem();
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function updateOrbState(state) {
    const orb = document.getElementById("hv-orb");
    if (!orb) return;

    orb.classList.remove("listening", "processing");
    let iconName = "mic";

    if (!config.active) {
      orb.style.opacity = "0.5";
      orb.style.borderColor = "#94a3b8"; // Gray
      iconName = "mic-off";
    } else {
      orb.style.opacity = "1";
      if (state === "listening") {
        orb.classList.add("listening");
        iconName = "mic";
      } else {
        orb.style.borderColor = "#38bdf8"; // Blue
        iconName = "mic";
      }
    }

    // Re-generate inner HTML to ensure Lucide can render the correct icon.
    // This fixes the issue where Lucide replaces <i> with <svg>, causing subsequent queries for <i> to fail.
    orb.innerHTML = `<i data-lucide="${iconName}" class="w-6 h-6 text-white"></i>`;

    if (window.lucide) window.lucide.createIcons();
  }

  // 2. The Settings Panel (Injected into Settings Tab)
  function createSettingsPanel() {
    const panel = document.createElement("div");
    panel.id = "hyper-voice-os-panel";
    panel.innerHTML = `
            <div class="hv-header">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-500/20 rounded-lg"><i data-lucide="mic-activity" class="w-6 h-6 text-blue-400"></i></div>
                    <div>
                        <h3 class="text-lg font-bold text-white">HyperVoice OS</h3>
                        <p class="text-xs text-slate-400">Voice Command Interface</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono text-slate-400" id="hv-lang-display">${
                      config.language === "en-US" ? "English" : "Bangla"
                    }</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="hv-toggle-active" class="sr-only peer" ${
                          config.active ? "checked" : ""
                        }>
                        <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                </div>
            </div>
            
            <div class="hv-viz-box" id="hv-visualizer">
                <!-- Bars generated by JS -->
            </div>

            <div class="hv-controls">
                <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                    <span class="text-sm font-medium">Language Model</span>
                    <select id="hv-lang-select" class="bg-slate-800 border border-slate-600 text-xs rounded p-1.5 text-white outline-none">
                        <option value="en-US" ${
                          config.language === "en-US" ? "selected" : ""
                        }>English (International)</option>
                        <option value="bn-BD" ${
                          config.language === "bn-BD" ? "selected" : ""
                        }>Bangla (Bangladesh)</option>
                    </select>
                </div>
                
                <div class="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p class="text-xs text-blue-300 mb-2 font-bold uppercase tracking-wider">Voice Commands:</p>
                    <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div>• "Open POS" / "পস খুলুন"</div>
                        <div>• "Show Reports" / "রিপোর্ট"</div>
                        <div>• "Close Tab" / "বন্ধ করুন"</div>
                        <div>• "Full Screen" / "বড় পর্দা"</div>
                    </div>
                </div>
            </div>
        `;

    // Visualize logic (Fake bars for UI)
    const viz = panel.querySelector("#hv-visualizer");
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement("div");
      bar.className = "hv-bar";
      viz.appendChild(bar);
    }

    // Settings Listeners
    const toggle = panel.querySelector("#hv-toggle-active");
    toggle.addEventListener("change", (e) => {
      config.active = e.target.checked;
      saveConfig();
      toggleVoiceSystem();
    });

    const langSelect = panel.querySelector("#hv-lang-select");
    langSelect.addEventListener("change", (e) => {
      config.language = e.target.value;
      panel.querySelector("#hv-lang-display").textContent =
        e.target.value === "en-US" ? "English" : "Bangla";
      saveConfig();
      if (config.active) {
        // Restart to apply language
        if (recognition) recognition.stop();
        // onend will handle restart with new lang
      } else {
        if (recognition) recognition.lang = config.language;
      }
    });

    // Simple animation loop for visualizer
    setInterval(() => {
      if (config.active && isListening) {
        const bars = panel.querySelectorAll(".hv-bar");
        bars.forEach((bar) => {
          const h = Math.floor(Math.random() * 40) + 10;
          bar.style.height = `${h}px`;
        });
      }
    }, 100);

    return panel;
  }

  // --- SYSTEM CONTROLS ---
  function saveConfig() {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    updateOrbState(config.active ? "listening" : "idle");
  }

  function toggleVoiceSystem() {
    if (config.active) {
      try {
        recognition.start();
      } catch (e) {
        // Might already be started
      }
    } else {
      recognition.stop();
    }
    updateSettingsUI(); // Sync UI if settings panel is open
  }

  function updateSettingsUI() {
    const toggle = document.getElementById("hv-toggle-active");
    if (toggle) toggle.checked = config.active;
  }

  // --- INITIALIZATION ---
  injectStyles();
  createOrb();
  initSpeechRecognition();

  // Auto-start if config is active
  if (config.active) {
    toggleVoiceSystem();
  }

  // Observer to inject Settings Panel when Settings tab is opened
  const observer = new MutationObserver(() => {
    const settingsForm = document.getElementById("settings-form");
    if (settingsForm && !document.getElementById("hyper-voice-os-panel")) {
      const panel = createSettingsPanel();
      // We prepend it so it's picked up by the Tab Manager
      settingsForm.prepend(panel);
      if (window.lucide) window.lucide.createIcons();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
