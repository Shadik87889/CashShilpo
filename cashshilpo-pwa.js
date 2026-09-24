(function () {
  let deferredPrompt = null;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            if (
              installingWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("[CashShilpo] New version detected. Reloading...");
              window.location.reload();
            }
          };
        };
      });
    });
  }

  // Intercept Android Chrome install event
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelectorAll('[data-action="install-pwa"]').forEach((btn) => {
      btn.classList.remove("hidden");
    });
  });

  // Global Install Handler callable from any button
  window.triggerAppInstall = function () {
    if (isStandalone) {
      alert("CashShilpo is already installed and running as a standalone app.");
      return;
    }

    if (deferredPrompt) {
      // Android Native Prompt
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("[PWA] User accepted install");
        }
        deferredPrompt = null;
      });
    } else if (isIOS) {
      // iOS Custom Bottom Sheet Guide
      showIOSInstallSheet();
    } else {
      // Fallback for Desktop Chrome/Edge or direct visit
      showDesktopInstructions();
    }
  };

  function showIOSInstallSheet() {
    const existing = document.getElementById("ios-install-modal");
    if (existing) existing.remove();

    const sheetHTML = `
      <div id="ios-install-modal" class="fixed inset-0 z-[600] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease]">
        <div class="bg-[#18181b] border border-white/10 w-full max-w-md rounded-3xl p-6 text-white shadow-2xl relative">
          <button onclick="document.getElementById('ios-install-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-xl font-bold">&times;</button>
          
          <div class="flex items-center gap-4 mb-4">
            <img src="cashshilpo-official-logo.png" class="w-12 h-12 rounded-2xl border border-white/10" alt="Logo">
            <div>
              <h3 class="font-bold text-lg leading-tight">Install CashShilpo</h3>
              <p class="text-xs text-gray-400">Add to iPhone Home Screen</p>
            </div>
          </div>

          <div class="space-y-3 text-sm text-gray-300 mb-6">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span>Tap the <strong class="text-white">Share</strong> button at the bottom of Safari (<span class="text-blue-400 text-lg">⎋</span>).</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span>Scroll down and tap <strong class="text-white">"Add to Home Screen"</strong> (➕).</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center shrink-0">3</span>
              <span>Tap <strong class="text-white">Add</strong> in the top right corner.</span>
            </div>
          </div>

          <button onclick="document.getElementById('ios-install-modal').remove()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white">Got It</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", sheetHTML);
  }

  function showDesktopInstructions() {
    alert(
      "To install on desktop or browser: Click the install icon (⊕) on the right side of your browser URL bar.",
    );
  }

  // Auto-hide buttons if already inside the standalone app
  document.addEventListener("DOMContentLoaded", () => {
    if (isStandalone) {
      document.querySelectorAll('[data-action="install-pwa"]').forEach((el) => {
        el.style.display = "none";
      });
    }
  });
})();
