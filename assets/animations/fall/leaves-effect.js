/**
 * Leaves Fall Effect Script
 * Tự quản lý: CSS Injection, HTML Creation, Animation Logic
 */

(function () {
  "use strict";

  var data = window.__fallEffectManagerData;
  if (!data || !data.container) {
    console.error("[LeavesEffect] Missing manager data");
    return;
  }

  var container = data.container;
  var config = data.config || {};
  var effectConfig = config.config || {};

  // ===== PHẦN 1: CSS INJECTION =====
  var styleId = "fall-leaves-style";
  if (!document.getElementById(styleId)) {
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent =
      "#fall-effect-overlay .fall-particle{" +
      "position:absolute;top:-12%;left:0;font-size:18px;line-height:1;" +
      "pointer-events:none;user-select:none;" +
      "will-change:transform,opacity,margin-left;" +
      "}" +
      "#fall-effect-overlay .fall-particle.leaf{" +
      "animation-name:fall-drop,fall-spin;" +
      "animation-timing-function:linear,ease-in-out;" +
      "animation-iteration-count:1,infinite;" +
      "}" +
      "@keyframes fall-drop{" +
      "0%{transform:translateY(-20vh);opacity:0;}" +
      "10%{opacity:1;}" +
      "100%{transform:translateY(120vh);opacity:0;}" +
      "}" +
      "@keyframes fall-spin{" +
      "0%,100%{margin-left:0;}" +
      "25%{margin-left:12px;}" +
      "75%{margin-left:-12px;}" +
      "}";

    document.head.appendChild(style);

    // Đăng ký cleanup để xóa style
    data.registerCleanup(function () {
      if (style.parentNode) {
        style.remove();
      }
    });
  }

  // ===== PHẦN 2: HTML INJECTION & PHẦN 3: LOGIC =====
  var leafIcons = ["🍂", "🍁", "🌾"];
  var particles = [];
  var generationInterval = null;
  var pendingTimeouts = [];

  function createLeaf() {
    var particle = document.createElement("div");
    particle.className = "fall-particle leaf";

    var left = Math.random() * 100;
    var delay = Math.random() * 2.5;
    var duration = effectConfig.speed || 9 + Math.random() * 4;
    var rotateDuration = 4 + Math.random() * 3;
    var leafIcon = leafIcons[Math.floor(Math.random() * leafIcons.length)];

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
      rotateDuration +
      "s;" +
      "animation-delay:" +
      delay +
      "s," +
      delay +
      "s;";

    particle.textContent = leafIcon;
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
      "[LeavesEffect] Init with " + effectConfig.count + " particles",
    );

    var particleCount = effectConfig.count || 14;
    for (var i = 0; i < particleCount; i++) {
      createLeaf();
    }

    var generationRate = effectConfig.spawnInterval || 900;
    generationInterval = setInterval(function () {
      if (container && container.parentNode) {
        createLeaf();
      }
    }, generationRate);

    data.registerInterval(generationInterval);
  }

  function cleanup() {
    console.log("[LeavesEffect] Cleanup");
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
