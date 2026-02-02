/******************** CONFIG ********************/
const API = "https://script.google.com/macros/s/AKfycbwwOhhkig1m-JXJ1XFEt6socZENmHbxD6jUj6XZzqxq46_LYSoAxaQuODTrYOjHCNfWWw/exec";
const PAGE = document.body.getAttribute("data-page"); // p1, p2, ...
const TIME_LIMIT = 4 * 60; // ⏱️ 4 minutes (change to 3*60 or 5*60)

/******************** TEAM LOAD ********************/
let team = localStorage.getItem("team");

if (!team) {
  document.body.innerHTML = "<h1>❌ INVALID ACCESS</h1>";
  throw new Error("No team");
}

team = team.trim().toUpperCase();
let protectionActive = false;

function enableProtection(team, page) {
  protectionActive = true;

  // Right click
  window._ctx = e => e.preventDefault();
  document.addEventListener("contextmenu", window._ctx);

  // Text selection
  window._sel = e => e.preventDefault();
  document.addEventListener("selectstart", window._sel);

  // Copy
  window._copy = e => e.preventDefault();
  document.addEventListener("copy", window._copy);

  // Ctrl keys
  window._key = e => {
    if (e.ctrlKey && ["c", "a", "s", "p"].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };
  document.addEventListener("keydown", window._key);

  // Tab / app switch
  window._vis = () => {
    if (document.hidden && protectionActive) {
      fetch(`${API}?action=disqualify&team=${team}&page=${page}`);
      document.body.innerHTML = "<h1>❌ DISQUALIFIED</h1>";
    }
  };
  document.addEventListener("visibilitychange", window._vis);
}

function disableProtection() {
  protectionActive = false;

  document.removeEventListener("contextmenu", window._ctx);
  document.removeEventListener("selectstart", window._sel);
  document.removeEventListener("copy", window._copy);
  document.removeEventListener("keydown", window._key);
  document.removeEventListener("visibilitychange", window._vis);
}

/******************** DEVICE ID ********************/
let device = localStorage.getItem("device_id");
if (!device) {
  device = "dvc_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("device_id", device);
}

/******************** STATUS CHECK ********************/
fetch(`${API}?action=check&team=${team}`)
  .then(r => r.text())
  .then(status => {
    if (status !== "ACTIVE") {
      document.body.innerHTML = "<h1>❌ DISQUALIFIED</h1>";
      throw new Error("Disqualified");
    }
  });

/******************** CONNECT DEVICE ********************/
fetch(`${API}?action=connect&team=${team}&device=${device}&page=${PAGE}`);

/******************** HEARTBEAT ********************/
setInterval(() => {
  fetch(`${API}?action=heartbeat&team=${team}&device=${device}`);
}, 10000);

/******************** TIMER ********************/
// ================= TIMER CONFIG =================
const TOTAL_TIME = 30; // seconds per page
let timeLeft = TOTAL_TIME;

// ================= TIMER DISPLAY =================
const timerEl = document.getElementById("timer");

const timerInterval = setInterval(() => {
  timeLeft--;

  if (timerEl) {
    timerEl.innerText = `⏳ Time left: ${timeLeft}s`;
  }

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    disqualify("TIME_OVER");
  }
}, 1000);

/******************** ANSWER LOCK (ON LOAD) ********************/
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem(solvedKey) === "true") {
    document.getElementById("ans").disabled = true;
    document.querySelector("button").disabled = true;
    document.getElementById("msg").innerText =
      "✅ Answer already accepted. Go to next location.";
  }};
});
/******************** BASIC ANTI-COPY ********************/
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());

document.addEventListener("keydown", e => {
  if (e.ctrlKey && ["c", "a", "s", "p"].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});
window.addEventListener("load", () => {
  enableProtection(team, PAGE);
});

