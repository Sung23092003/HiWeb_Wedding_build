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
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .envelope {
      position: relative;
      width: 300px;
      height: 200px;
      background: #fff;
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
      background: #f8f9fa;
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
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 0.9rem;
      opacity: 0.8;
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
        <div class="envelope-flap"></div>
        <div class="envelope-content">
          <div class="ec-tag">Save The Date</div>
          <div class="ec-names">${templateData.coupleNames}</div>
          <div class="ec-date">${templateData.eventDate}</div>
        </div>
        <div class="open-hint">Click to open</div>
      </div>
    </div>
  `;

  shadowRoot.appendChild(container);

  // --- 3. LOGIC ---
  const envelope = shadowRoot.getElementById("envelope");
  const hostElement = shadowRoot.host;
  let isOpened = false;

  function openEnvelope() {
    if (isOpened) return;
    isOpened = true;

    envelope.classList.add("open");

    setTimeout(() => {
      hostElement.classList.add("away");
      const main = document.getElementById("main");
      if (main) {
        main.style.display = "block";
        main.classList.add("show");
      }
    }, 1500);
  }

  envelope.onclick = openEnvelope;
})();
