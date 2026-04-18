(function () {
  // Check if we're in editor mode or no shadow root
  if (!window.__openingEffectData || !window.__openingEffectData.shadowRoot) {
    console.warn("Envelope Effect: No shadow root available");
    return;
  }

  const shadowRoot = window.__openingEffectData.shadowRoot;
  const templateData = window.__openingEffectData.templateData;

  // --- 1. CSS INJECTION ---
  const css = `
    .envelope-container {
      font-family: "Cormorant Garamond", serif;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
        center/cover no-repeat;
      cursor: pointer;
    }

    .envelope {
      position: relative;
      width: 300px;
      height: 200px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      transition: all 0.8s ease;
      cursor: pointer;
    }

    .envelope.open {
      transform: scale(0.8);
      opacity: 0;
    }

    .envelope-flap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
      clip-path: polygon(0 0, 50% 100%, 100% 0);
      transition: all 1s ease;
    }

    .envelope.open .envelope-flap {
      transform: rotateX(180deg);
      transform-origin: bottom center;
    }

    .envelope-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #333;
      opacity: 0;
      transition: opacity 0.5s ease 0.5s;
    }

    .envelope.open .envelope-content {
      opacity: 1;
    }

    .ec-tag { font-size: 1rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; opacity: 0.8; }
    .ec-names { font-size: 1.8rem; line-height: 1.2; font-weight: 300; }
    .ec-date { font-size: 0.9rem; margin-top: 10px; letter-spacing: 1px; }

    .open-hint {
      position: absolute;
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    /* Progress Bar Styles */
    /*
    .progress-container {
      position: absolute;
      bottom: -60px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .progress-container.show {
      opacity: 1;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      width: 0%;
      transition: width 0.1s linear;
      border-radius: 2px;
    }

    .progress-text {
      position: absolute;
      bottom: -80px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 0.85rem;
      opacity: 0;
      transition: opacity 0.3s ease;
      white-space: nowrap;
    }

    .progress-text.show {
      opacity: 0.8;
    }
    */
    .envelope-img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;
      top: 0;
      left: 0;
    }

    .waxseal {
      position: absolute;
      top: 62%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90px;
      height: 90px;
      border-radius: 50%;
      overflow: hidden;
      animation: bumpbamp 1.5s infinite alternate;
      z-index: 10;
    }

    .waxseal img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .seal-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: "Great Vibes", cursive;
      font-size: 12px;
      color: white;
      letter-spacing: 1px;
      z-index: 11;
    }

    .click-hint {
      position: absolute;
      bottom: 25px;
      left: 53%;
      transform: translateX(-50%);
      width: 40px;
      animation: blink 1.5s infinite;
      z-index: 100;
    }

    .click-hint img {
      width: 100%;
    }

    .decor-left {
      position: absolute;
      top: 0;
      left: -40px;
      width: 80px;
      z-index: 3;
    }

    .decor-left img {
      width: 100%;
    }

    .decor-right {
      position: absolute;
      top: 120px;
      right: -40px;
      width: 80px;
      z-index: 3;
    }

    .decor-right img {
      width: 100%;
    }

    @keyframes bumpbamp {
      0% {
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        transform: translate(-50%, -50%) scale(1.2);
      }
    }

    @keyframes blink {
      0% {
        opacity: 0.2;
        transform: translateX(-50%) scale(0.9);
      }
      50% {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
      100% {
        opacity: 0.2;
        transform: translateX(-50%) scale(0.9);
      }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = css;
  shadowRoot.appendChild(styleSheet);

  // --- 2. HTML INJECTION ---
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="envelope-container">
      <div class="envelope" id="envelope">
      <!-- HÌNH ENVELOPE CHÍNH -->
      <img class="envelope-img" src="https://i.postimg.cc/Dz74SwKY/envelope2.png" alt="envelope" />
 
        <div class="envelope-flap"></div>
      <!-- WAX SEAL (HÌNh đỏ 3D) -->
      <div class="waxseal">
        <img src="https://i.postimg.cc/gJTxty6d/red-3d.png" alt="wax seal" />
        <span class="seal-text">QH</span>
      </div>
      
      <!-- CLICK HINT (MŨI TÊN) -->
      <div class="click-hint">
        <img src="https://i.postimg.cc/rsjPLmMF/click.png" alt="click hint" />
      </div>
      
      <!-- DECORATION TRÁI (TIM) -->
      <div class="decor-left">
        <img src="https://i.postimg.cc/1RrTFW6H/heart-2.png" alt="decoration left" />
      </div>
      
      <!-- DECORATION PHẢI (HOA) -->
      <div class="decor-right">
        <img src="https://i.postimg.cc/KYQkBhGc/flower.png" alt="decoration right" />
      </div>
        <div class="envelope-content">
          <div class="ec-tag">Save The Date</div>
          <div class="ec-names">${templateData.coupleNames}</div>
          <div class="ec-date">${templateData.eventDate}</div>
        </div>        
        <div class="open-hint">Click to open</div>
        <div class="progress-container" id="progressContainer">
          <div class="progress-bar" id="progressBar"></div>
        </div>
        <div class="progress-text" id="progressText">0%</div>
      </div>
    </div>
  `;

  shadowRoot.appendChild(container);

  // --- 3. LOGIC ---
  const envelope = shadowRoot.getElementById("envelope");
  const hostElement = shadowRoot.host;
  const progressContainer = shadowRoot.getElementById("progressContainer");
  const progressBar = shadowRoot.getElementById("progressBar");
  const progressText = shadowRoot.getElementById("progressText");
  let isOpened = false;
  let isOpening = false;

  function animateProgress() {
    progressContainer.classList.add("show");
    progressText.classList.add("show");

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15; // Random increment từ 0-15%
      if (progress > 100) progress = 100;

      progressBar.style.width = progress + "%";
      progressText.textContent = Math.floor(progress) + "%";

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progressContainer.classList.remove("show");
          progressText.classList.remove("show");
        }, 300);
      }
    }, 150); // Cập nhật mỗi 150ms
  }

  function openEnvelope() {
    if (isOpened || isOpening) return;
    isOpening = true;

    // ✅ Bắt đầu animation progress
    animateProgress();

    envelope.classList.add("open");

    setTimeout(() => {
      hostElement.classList.add("away");
      const main = document.getElementById("main");
      if (main) {
        main.style.display = "block";
        main.classList.add("show");
      }
      isOpened = true;
    }, 1500);
  }

  envelope.onclick = openEnvelope;
})();
