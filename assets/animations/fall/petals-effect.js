/**
 * Petals Fall Effect Script
 * Tự quản lý: CSS Injection, HTML Creation, Animation Logic
 */

(function () {
  "use strict";

  var data = window.__fallEffectManagerData;
  if (!data || !data.container) {
    console.error("[PetalsEffect] Missing manager data");
    return;
  }

  var container = data.container;
  var config = data.config || {};
  var effectConfig = config.config || {};

  // ===== PHẦN 1: CSS INJECTION =====
  var styleId = "fall-petals-style";
  if (!document.getElementById(styleId)) {
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent =
      "#fall-effect-overlay .fall-particle{" +
      "position:absolute;top:-12%;left:0;font-size:18px;line-height:1;" +
      "pointer-events:none;user-select:none;" +
      "will-change:transform,opacity,margin-left;" +
      "}" +
      "#fall-effect-overlay .fall-particle.petal{" +
      "animation-name:fall-drop,fall-sway;" +
      "animation-timing-function:linear,ease-in-out;" +
      "animation-iteration-count:1,infinite;" +
      "}" +
      "@keyframes fall-drop{" +
      "0%{transform:translateY(-20vh);opacity:0;}" +
      "10%{opacity:1;}" +
      "100%{transform:translateY(120vh);opacity:0;}" +
      "}" +
      "@keyframes fall-sway{" +
      "0%,100%{margin-left:0;}" +
      "50%{margin-left:18px;}" +
      "}";

    document.head.appendChild(style);

    data.registerCleanup(function () {
      if (style.parentNode) {
        style.remove();
      }
    });
  }

  // ===== PHẦN 2: HTML INJECTION & PHẦN 3: LOGIC =====
  var petalIcons = ["🌸", "🌺", "🌻", "🌷", "🏵️"];
  var particles = [];
  var generationInterval = null;
  var pendingTimeouts = [];

  function createPetal() {
    var particle = document.createElement("div");
    particle.className = "fall-particle petal";

    var left = Math.random() * 100;
    var delay = Math.random() * 3;
    var duration = effectConfig.speed || 11 + Math.random() * 5;
    var swayDuration = (effectConfig.sway || 5) + Math.random() * 3;
    var petalIcon = petalIcons[Math.floor(Math.random() * petalIcons.length)];

    particle.style.cssText =
      "left:" +
      left +
      "%;" +
      "opacity:" +
      (0.5 + Math.random() * 0.5) +
      ";" +
      "animation-duration:" +
      duration +
      "s," +
      swayDuration +
      "s;" +
      "animation-delay:" +
      delay +
      "s," +
      delay +
      "s;";

    particle.textContent = petalIcon;
    container.appendChild(particle);
    particles.push(particle);

    var timeoutId = setTimeout(
      function () {
        if (particle.parentNode === container) {
          container.removeChild(particle);
        }
        particles = particles.filter(function (p) {
          return p !== particle;
        });
      },
      (duration + delay) * 1000,
    );

    pendingTimeouts.push(timeoutId);
  }

  function init() {
    console.log(
      "[PetalsEffect] Init with " + effectConfig.count + " particles",
    );

    var particleCount = effectConfig.count || 14;
    for (var i = 0; i < particleCount; i++) {
      createPetal();
    }

    var generationRate = effectConfig.spawnInterval || 900;
    generationInterval = setInterval(function () {
      if (container && container.parentNode) {
        createPetal();
      }
    }, generationRate);

    data.registerInterval(generationInterval);
  }

  function cleanup() {
    console.log("[PetalsEffect] Cleanup");
    if (generationInterval) {
      clearInterval(generationInterval);
    }
    pendingTimeouts.forEach(function (id) {
      clearTimeout(id);
    });
    pendingTimeouts = [];
    particles.forEach(function (p) {
      if (p.parentNode === container) {
        container.removeChild(p);
      }
    });
    particles = [];
  }

  data.registerCleanup(cleanup);
  init();
})();
