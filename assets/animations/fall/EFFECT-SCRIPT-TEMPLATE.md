# Effect Script Template - Hướng dẫn Viết Effect Script Con

Mỗi file effect script (e.g., `leaves-effect.js`, `petals-effect.js`, `hearts-effect.js`) phải tuân thủ cấu trúc 3 phần:

## PHẦN 1: CSS INJECTION

Tự tạo và chèn `<style>` tag vào `document.head` chứa:

- Tất cả `@keyframes` dành riêng cho loại hạt đó
- Base styling của `.fall-particle`
- Styling riêng cho variant của hạt (`.leaf`, `.heart`, `.petal`, v.v.)

```javascript
// PHẦN 1: CSS INJECTION
var styleId = "fall-leaves-style";
if (!document.getElementById(styleId)) {
  var style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    #fall-effect-overlay .fall-particle {
      position: absolute;
      top: -12%;
      left: 0;
      font-size: 18px;
      line-height: 1;
      pointer-events: none;
      user-select: none;
      will-change: transform, opacity, margin-left;
    }
    
    #fall-effect-overlay .fall-particle.leaf {
      animation-name: fall-drop, fall-spin;
      animation-timing-function: linear, ease-in-out;
      animation-iteration-count: 1, infinite;
    }
    
    @keyframes fall-drop {
      0% { 
        transform: translateY(-20vh); 
        opacity: 0; 
      }
      10% { 
        opacity: 1; 
      }
      100% { 
        transform: translateY(120vh); 
        opacity: 0; 
      }
    }
    
    @keyframes fall-spin {
      0%, 100% { 
        margin-left: 0; 
      }
      25% { 
        margin-left: 12px; 
      }
      75% { 
        margin-left: -12px; 
      }
    }
  `;
  document.head.appendChild(style);

  // Đăng ký cleanup để xóa style khi effect tắt
  data.registerCleanup(function () {
    if (style.parentNode) {
      style.remove();
    }
  });
}
```

## PHẦN 2: HTML INJECTION

Tạo DOM elements (particles) và append vào `data.container`:

```javascript
// PHẦN 2: HTML INJECTION
var leafIcons = ["🍂", "🍁", "🌾"];
var particles = [];

function createLeaf() {
  var particle = document.createElement("div");
  particle.className = "fall-particle leaf";
  particle.textContent =
    leafIcons[Math.floor(Math.random() * leafIcons.length)];

  var left = Math.random() * 100;
  var duration = effectConfig.speed + Math.random() * 4;
  var delay = Math.random() * 2.5;

  particle.style.cssText = `
    left: ${left}%;
    animation-duration: ${duration}s, 4s;
    animation-delay: ${delay}s;
  `;

  container.appendChild(particle);
  particles.push(particle);

  // Tự xóa particle khi animation kết thúc
  var timeoutId = setTimeout(
    function () {
      if (particle.parentNode === container) {
        container.removeChild(particle);
      }
    },
    (duration + delay) * 1000,
  );

  // Đăng ký cleanup cho timeout
  data.registerCleanup(function () {
    clearTimeout(timeoutId);
  });
}
```

## PHẦN 3: LOGIC

Khởi tạo hiệu ứng và quản lý vòng đời:

```javascript
// PHẦN 3: LOGIC
var effectConfig = config.config || {};
var particleCount = effectConfig.count || 14;
var spawnInterval = effectConfig.spawnInterval || 900;

// Spawn initial particles
for (var i = 0; i < particleCount; i++) {
  createLeaf();
}

// Setup continuous spawn loop
var generationInterval = setInterval(function () {
  if (container && container.parentNode) {
    createLeaf();
  }
}, spawnInterval);

// Register interval management
data.registerInterval(generationInterval);

// Master cleanup function
data.registerCleanup(function () {
  if (generationInterval) {
    clearInterval(generationInterval);
  }
  // Clear all remaining particles
  particles.forEach(function (p) {
    if (p.parentNode === container) {
      container.removeChild(p);
    }
  });
  particles = [];
});
```

## Bộ Khung Hoàn Chỉnh

```javascript
/**
 * [Effect Name] Effect Script
 * Tự quản lý: CSS, HTML, Logic
 */

(function () {
  "use strict";

  var data = window.__fallEffectManagerData;
  if (!data || !data.container) {
    console.error("[EffectName] Missing manager data");
    return;
  }

  var container = data.container;
  var config = data.config;
  var effectConfig = config.config || {};

  // ===== PHẦN 1: CSS INJECTION =====
  var styleId = "fall-[effect-name]-style";
  if (!document.getElementById(styleId)) {
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent = `/* CSS cho effect này */`;
    document.head.appendChild(style);

    data.registerCleanup(function () {
      if (style.parentNode) style.remove();
    });
  }

  // ===== PHẦN 2: HTML INJECTION =====
  var particles = [];

  function createParticle() {
    var particle = document.createElement("div");
    particle.className = "fall-particle [variant-class]";
    // ... setup particle
    container.appendChild(particle);
    particles.push(particle);
  }

  // ===== PHẦN 3: LOGIC =====
  var spawnInterval = setInterval(function () {
    if (container && container.parentNode) {
      createParticle();
    }
  }, effectConfig.spawnInterval || 900);

  data.registerInterval(spawnInterval);

  data.registerCleanup(function () {
    if (spawnInterval) clearInterval(spawnInterval);
    particles.forEach(function (p) {
      if (p.parentNode === container) {
        container.removeChild(p);
      }
    });
    particles = [];
  });
})();
```

## Nguyên Tắc Quan Trọng

1. **Tính Đóng Gói (Encapsulation)**: Mỗi effect tự quản lý CSS, HTML, và logic của riêng nó.
2. **Cleanup Toàn Bộ**: Khi manager gọi cleanup, effect phải xóa sạch style, DOM, và các biến.
3. **Sử Dụng Config**: Lấy `count`, `speed`, `spawnInterval` từ `data.config.config`.
4. **Callback Registration**: Luôn đăng ký cleanup và interval qua `data.registerCleanup()` và `data.registerInterval()`.
5. **Error Handling**: Kiểm tra `data` và `container` trước khi sử dụng.
