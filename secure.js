/******************** CONFIG ********************/
const API = "https://script.google.com/macros/s/AKfycbwwOhhkig1m-JXJ1XFEt6socZENmHbxD6jUj6XZzqxq46_LYSoAxaQuODTrYOjHCNfWWw/exec";
const PAGE = document.body.getAttribute("data-page"); // p1, p2...

/******************** TEAM LOAD ********************/
let team = localStorage.getItem("team");
if (!team) {
  document.body.innerHTML = "<h1>❌ INVALID ACCESS</h1>";
  throw new Error("No team");
}
team = team.trim().toUpperCase();

/******************** DEVICE ID ********************/
let device = localStorage.getItem("device_id");
if (!device) {
  device = "dvc_" + Math.random().toString(36).substring(2, 10);
  localStorage.setItem("device_id", device);
}

/******************** DISQUALIFY FUNCTION ********************/
function disqualify(reason) {
  fetch(`${API}?action=disqualify&team=${team}&page=${PAGE}&reason=${reason}`);
  document.body.innerHTML = "<h1>❌ DISQUALIFIED</h1>";
  throw new Error("Disqualified");
}

/******************** STATUS CHECK ********************/
fetch(`${API}?action=check&team=${team}`)
  .then(r => r.text())
  .then(status => {
    if (status !== "ACTIVE") disqualify("STATUS");
  });

/******************** CONNECT DEVICE ********************/
fetch(`${API}?action=connect&team=${team}&device=${device}&page=${PAGE}`);

/******************** HEARTBEAT ********************/
setInterval(() => {
  fetch(`${API}?action=heartbeat&team=${team}&device=${device}`);
}, 10000);

/******************** PROTECTION ********************/
let protectionActive = false;

function enableProtection() {
  protectionActive = true;

  window._ctx = e => e.preventDefault();
  window._sel = e => e.preventDefault();
  window._copy = e => e.preventDefault();
  window._key = e => {
    if (e.ctrlKey && ["c", "a", "s", "p"].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };
  window._vis = () => {
    if (document.hidden && protectionActive) {
      disqualify("TAB_SWITCH");
    }
  };

  document.addEventListener("contextmenu", window._ctx);
  document.addEventListener("selectstart", window._sel);
  document.addEventListener("copy", window._copy);
  document.addEventListener("keydown", window._key);
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

/******************** START PROTECTION ON LOAD ********************/
window.addEventListener("load", () => {
  enableProtection();
});
