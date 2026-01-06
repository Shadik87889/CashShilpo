/**
 * CashShilpo Neural Engine Settings
 * A "Game Changing" premium settings module for AI configuration.
 * Features:
 * - Interactive Neural Network Canvas Background
 * - Voice Synthesis Configuration
 * - AI Autonomy Levels
 * - Real-time "System Status" visualization
 */

(function () {
  console.log("CashShilpo Neural Engine: Module Loaded");

  // --- 1. Canvas Animation Logic ---
  function initNeuralNetwork(canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60;
    const connectionDistance = 120;
    const mouseDistance = 150;

    let mouse = { x: null, y: null };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 0.5;
            const directionY = forceDirectionY * force * 0.5;
            this.vx += directionX;
            this.vy += directionY;
          }
        }
      }

      draw() {
        ctx.fillStyle = "rgba(59, 130, 246, 0.5)"; // Blue-500
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            let opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    // Events
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    initParticles();
    animate();
  }

  // --- 2. UI Builder ---
  function createNeuralPanel() {
    const panel = document.createElement("div");
    panel.id = "neural-engine-panel";
    // Using existing styles + some custom layout
    panel.className =
      "glass-pane relative overflow-hidden rounded-xl border border-blue-500/30 mb-8 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]";

    // HTML Structure
    panel.innerHTML = `
        <canvas id="neural-canvas" class="absolute inset-0 w-full h-full pointer-events-auto" style="z-index: 0;"></canvas>
        
        <div class="relative z-10 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Header Section -->
            <div class="lg:col-span-3 flex justify-between items-center border-b border-blue-500/20 pb-4 mb-2">
                <div>
                    <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                        <i data-lucide="brain-circuit" class="w-8 h-8 text-blue-400"></i>
                        Neural Engine <span class="text-xs align-top bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full ml-2">V2.0 ALPHA</span>
                    </h2>
                    <p class="text-blue-200/70 text-sm mt-1">Configure the AI cortex and autonomous decision capabilities.</p>
                </div>
                <div class="text-right hidden sm:block">
                    <p class="text-xs text-blue-300 font-mono">SYSTEM STATUS</p>
                    <div class="flex items-center gap-2 justify-end">
                        <span class="relative flex h-3 w-3">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span class="text-green-400 font-bold font-mono">ONLINE</span>
                    </div>
                </div>
            </div>

            <!-- Left Col: Voice & Persona -->
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-blue-100 mb-2">AI Persona</label>
                    <div class="grid grid-cols-2 gap-2">
                        <button class="p-3 rounded-lg border border-blue-500/30 bg-blue-900/20 hover:bg-blue-600/20 text-left transition-all group active-persona">
                            <i data-lucide="bot" class="w-6 h-6 text-blue-400 mb-2"></i>
                            <div class="text-sm font-bold text-white">Assistant</div>
                            <div class="text-xs text-blue-300/70">Helpful & Polite</div>
                        </button>
                        <button class="p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-left transition-all group">
                            <i data-lucide="zap" class="w-6 h-6 text-yellow-400 mb-2"></i>
                            <div class="text-sm font-bold text-white">Analyst</div>
                            <div class="text-xs text-blue-300/70">Data-Driven</div>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-blue-100 mb-2">Vocal Interface</label>
                    <select class="form-select w-full bg-black/40 border-blue-500/30 text-blue-100 focus:border-blue-400 focus:ring-blue-400/20">
                        <option>Synthesized - Female (Default)</option>
                        <option>Synthesized - Male</option>
                        <option>Disabled (Text Only)</option>
                    </select>
                </div>
            </div>

            <!-- Middle Col: Autonomy Sliders -->
            <div class="space-y-6">
                 <div>
                    <div class="flex justify-between mb-2">
                        <label class="text-sm font-medium text-blue-100">Prediction Confidence</label>
                        <span class="text-xs font-mono text-blue-400">92%</span>
                    </div>
                    <input type="range" min="0" max="100" value="92" class="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-blue-500">
                    <p class="text-xs text-blue-300/60 mt-1">Minimum confidence score required for AI suggestions.</p>
                 </div>

                 <div class="p-4 rounded-lg bg-blue-900/10 border border-blue-500/20">
                    <h4 class="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <i data-lucide="cpu" class="w-4 h-4 text-blue-400"></i> Auto-Pilot Actions
                    </h4>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <div class="relative">
                                <input type="checkbox" class="sr-only peer">
                                <div class="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
                                <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                            <span class="text-sm text-blue-100 group-hover:text-white transition-colors">Draft Re-Stock POs</span>
                        </label>
                         <label class="flex items-center gap-3 cursor-pointer group">
                            <div class="relative">
                                <input type="checkbox" class="sr-only peer" checked>
                                <div class="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-blue-500 transition-colors"></div>
                                <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                            <span class="text-sm text-blue-100 group-hover:text-white transition-colors">Analyze Fraud Risk</span>
                        </label>
                    </div>
                 </div>
            </div>

            <!-- Right Col: Real-time Stats (Mockup) -->
            <div class="bg-black/40 rounded-xl p-4 border border-blue-500/10 font-mono text-xs text-blue-300 space-y-2 h-full flex flex-col">
                <p class="text-blue-500 font-bold mb-2">NEURAL LOGS</p>
                <div class="space-y-1 flex-1 overflow-hidden opacity-80" id="neural-logs">
                    <p>[10:42:01] <span class="text-green-400">Connected</span> to predictive model v4.1</p>
                    <p>[10:42:02] Analyzing inventory turnover...</p>
                    <p>[10:42:02] <span class="text-yellow-400">Optimization</span> found for 'Coffee Beans'.</p>
                    <p>[10:42:05] Voice synthesis engine ready.</p>
                </div>
                <div class="mt-2 pt-2 border-t border-blue-500/10">
                    <div class="flex justify-between">
                        <span>CPU Load:</span>
                        <span class="text-white">12%</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Memory:</span>
                        <span class="text-white">342MB</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    return panel;
  }

  // --- 3. Integration Logic ---
  const observer = new MutationObserver((mutations) => {
    const settingsForm = document.getElementById("settings-form");

    // Only proceed if settings exist and we haven't injected yet
    if (settingsForm && !document.getElementById("neural-engine-panel")) {
      const panel = createNeuralPanel();

      // We insert it at the top of the form temporarily.
      // The settings-tab manager will detect it via ID and move it to the correct tab.
      const header = settingsForm.querySelector("h1");
      if (header && header.nextSibling) {
        header.parentNode.insertBefore(panel, header.nextSibling);
      } else {
        settingsForm.prepend(panel);
      }

      // Initialize visuals
      if (window.lucide) window.lucide.createIcons();
      requestAnimationFrame(() => {
        const canvas = panel.querySelector("#neural-canvas");
        if (canvas) initNeuralNetwork(canvas);
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
