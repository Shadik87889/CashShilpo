(function () {
  let deferredPrompt = null;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  // Register Service Worker for PWA compliance
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
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
        })
        .catch((err) => {
          console.warn("[SW Registration Error]", err);
        });
    });
  }

  // Capture the native Android install prompt as early as possible
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log("[PWA] Android installation prompt captured successfully.");
  });

  // Track successful installation
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    console.log("[PWA] CashShilpo installed on device.");
  });

  // Global Install Handler - Snaptube Style Direct Download
  window.triggerAppInstall = function () {
    const isAndroidDevice = /Android/i.test(navigator.userAgent);
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // 1. Android: Direct APK Download (Snaptube style)
    if (isAndroidDevice) {
      const downloadLink = document.createElement("a");
      downloadLink.href = "CashShilpo.apk";
      downloadLink.setAttribute("download", "CashShilpo.apk");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      return;
    }

    // 2. iOS iPhone: Show Apple Home Screen Setup
    if (isIOSDevice) {
      showIOSInstallSheet();
      return;
    }

    // 3. Desktop fallback: Direct APK Download link
    const confirmDownload = confirm(
      "Do you want to download the CashShilpo Android APK installer file?",
    );
    if (confirmDownload) {
      window.location.href = "CashShilpo.apk";
    }
  };
  // Android Native-Feel Install Guide (Never shows desktop text on phones)
  function showAndroidInstallSheet() {
    const existing = document.getElementById("android-install-modal");
    if (existing) existing.remove();

    const sheetHTML = `
      <div id="android-install-modal" class="fixed inset-0 z-[600] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease]">
        <div class="bg-[#18181b] border border-white/10 w-full max-w-md rounded-3xl p-6 text-white shadow-2xl relative">
          <button onclick="document.getElementById('android-install-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-xl font-bold">&times;</button>
          
          <div class="flex items-center gap-4 mb-4">
            <img src="cashshilpo-official-logo.png" class="w-12 h-12 rounded-2xl border border-white/10" alt="Logo">
            <div>
              <h3 class="font-bold text-lg leading-tight">Install CashShilpo App</h3>
              <p class="text-xs text-accent">Android Official Setup</p>
            </div>
          </div>

          <div class="space-y-3.5 text-sm text-gray-300 mb-6">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0">1</span>
              <span>Tap the <strong class="text-white">three dots menu (⋮)</strong> in Chrome at the top right.</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0">2</span>
              <span>Select <strong class="text-white">"Install app"</strong> or <strong class="text-white">"Add to Home screen"</strong>.</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0">3</span>
              <span>Tap <strong class="text-white">Install</strong> to add CashShilpo to your app drawer.</span>
            </div>
          </div>

          <button onclick="document.getElementById('android-install-modal').remove()" class="w-full py-3.5 bg-accent hover:bg-white text-black font-extrabold rounded-xl text-sm transition-colors">Understood</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", sheetHTML);
  }

  // iOS Safari Install Guide
  function showIOSInstallSheet() {
    const existing = document.getElementById("ios-install-modal");
    if (existing) existing.remove();

    const sheetHTML = `
      <div id="ios-install-modal" class="fixed inset-0 z-[600] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease]">
        <div class="bg-[#18181b] border border-white/10 w-full max-w-md rounded-3xl p-6 text-white shadow-2xl relative">
          <button onclick="document.getElementById('ios-install-modal').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-xl font-bold">&times;</button>
          
          <div class="flex items-center gap-4 mb-4">
            <img src="cashshilpo-official-logo.png" class="w-12 h-12 rounded-2xl border border-white/10" alt="Logo">
            <div>
              <h3 class="font-bold text-lg leading-tight">Install CashShilpo</h3>
              <p class="text-xs text-gray-400">Add to iPhone Home Screen</p>
            </div>
          </div>

          <div class="space-y-3.5 text-sm text-gray-300 mb-6">
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

          <button onclick="document.getElementById('ios-install-modal').remove()" class="w-full py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white transition-colors">Got It</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", sheetHTML);
  }

  function showDesktopInstructions() {
    alert(
      "To install CashShilpo on Desktop: Click the install icon (⊕) on the right side of your browser address bar.",
    );
  }

  // Auto-hide buttons if already running as an installed standalone app
  document.addEventListener("DOMContentLoaded", () => {
    if (isStandalone) {
      document.querySelectorAll('[data-action="install-pwa"]').forEach((el) => {
        el.style.display = "none";
      });
    }
  });
})();
