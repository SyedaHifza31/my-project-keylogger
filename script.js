/* ===============================
   SECTION SHOW / HIDE
   (Product / Service / About)
================================ */
function showSection(id) {
  const sections = document.querySelectorAll(".info-section");

  sections.forEach(sec => {
    sec.style.display = "none";   
  });

  const active = document.getElementById(id);
  if (active) {
    active.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".menu-btn");
  const sections = document.querySelectorAll(".info-section");

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); 

      const targetId = btn.dataset.target;

      
      sections.forEach(sec => sec.classList.remove("active"));

      
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add("active");
      }
    });
  });
});

/* ===============================
   BASIC KEYLOGGER DETECTION
   (Behaviour Based)
================================ */

class KeyloggerDetector {
  constructor() {
    this.startTime = null;
    this.delays = [];
    this.threshold = 220; 
  }

  start() {
    document.addEventListener("keydown", () => {
      this.startTime = performance.now();
    });

    document.addEventListener("keyup", () => {
      if (!this.startTime) return;

      const delay = performance.now() - this.startTime;
      this.delays.push(delay);

      if (this.delays.length > 10) {
        const avg =
          this.delays.reduce((a, b) => a + b, 0) / this.delays.length;

        if (delay > avg * 2 || delay > this.threshold) {
          this.showAlert(
            `⚠ Suspicious typing delay detected (${Math.round(delay)} ms)`
          );
        }
      }

      this.startTime = null;
    });
  }

  showAlert(message) {
    if (document.getElementById("basic-alert")) return;

    const box = document.createElement("div");
    box.id = "basic-alert";
    box.innerText = message;

    box.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: red;
      color: white;
      padding: 14px 18px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 0 15px rgba(255,0,0,0.6);
      font-family: Arial;
    `;

    document.body.appendChild(box);
    setTimeout(() => box.remove(), 5000);
  }
}

const detector = new KeyloggerDetector();
detector.start();


/* ===============================
   ML-STYLE KEYLOGGER DETECTION
   (FYP DEMO – Lightweight ML)
================================ */

let typingData = [];
let lastKeyTime = null;

document.addEventListener("keydown", () => {
  lastKeyTime = performance.now();
});

document.addEventListener("keyup", () => {
  if (!lastKeyTime) return;

  const delay = performance.now() - lastKeyTime;
  typingData.push(delay);

  if (typingData.length > 30) typingData.shift();

  analyzeTypingML(delay);
  lastKeyTime = null;
});

function analyzeTypingML(currentDelay) {
  if (typingData.length < 12) return;

  const mean =
    typingData.reduce((a, b) => a + b, 0) / typingData.length;

  const variance =
    typingData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
    typingData.length;

  const stdDev = Math.sqrt(variance);

  const riskScore = Math.min(
    100,
    Math.round((stdDev / 100) * 50 + (currentDelay > mean ? 30 : 0))
  );

  updateRiskUI(riskScore);

  if (currentDelay > mean + 2 * stdDev) {
    showMLAlert(
      `🚨 ML Alert: Unusual typing pattern (${Math.round(currentDelay)} ms)`
    );
  }
}


/* ===============================
   ML ALERT UI
================================ */

function showMLAlert(message) {
  if (document.getElementById("ml-alert")) return;

  const box = document.createElement("div");
  box.id = "ml-alert";
  box.innerText = message;

  box.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff0033;
    color: white;
    padding: 14px 18px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 0 18px rgba(255,0,0,0.7);
  `;

  document.body.appendChild(box);
  setTimeout(() => box.remove(), 5000);
}


/* ===============================
   ML RISK SCORE UI
================================ */

function updateRiskUI(score) {
  let box = document.getElementById("risk-score");

  if (!box) {
    box = document.createElement("div");
    box.id = "risk-score";

    box.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #111;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      font-family: Arial;
    `;

    document.body.appendChild(box);
  }

  box.innerHTML = `<strong>ML Risk Score:</strong> ${score}/100`;
}
const socket = new WebSocket("ws://localhost:8765");

socket.onopen = () => {
  console.log("✅ Connected to Python backend");
};

socket.onerror = (e) => {
  console.error("❌ WebSocket error", e);
};

const searchInput = document.getElementById("searchBox");

searchInput.addEventListener("keyup", (e) => {
  socket.send(JSON.stringify({
    key: e.key,
    value: searchInput.value,
    time: Date.now()
  }));
});
// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  
  if (body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});
// Back to top
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
let charCount = 0;
let startTimeWPM = null;
let wpmDisplay = document.getElementById('typing-speed');

document.addEventListener('keydown', (e) => {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { // only letters/symbols
    charCount++;
    if (!startTimeWPM) startTimeWPM = performance.now();
  }
});

document.addEventListener('keyup', () => {
  if (charCount >= 5 && startTimeWPM) {
    const elapsed = (performance.now() - startTimeWPM) / 1000 / 60; // minutes
    const wpm = Math.round((charCount / 5) / elapsed);
    wpmDisplay.innerHTML = `Typing Speed: ${isNaN(wpm) ? '—' : wpm} WPM`;
  }
});
