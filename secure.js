// ================= CONFIG =================
const API = "https://script.google.com/macros/s/AKfycbwwOhhkig1m-JXJ1XFEt6socZENmHbxD6jUj6XZzqxq46_LYSoAxaQuODTrYOjHCNfWWw/exec";
const PAGE = document.body.getAttribute("data-page"); // p1, p2, etc.

// ================= TEAM LOAD =================
let team = localStorage.getItem("team");

if (!team) {
  document.body.innerHTML = "<h1>❌ INVALID ACCESS</h1>";
  throw new Error("No team");
}

team = team.trim().toUpperCase();

// ================= STATUS CHECK =================
fetch(`${API}?action=check&team=${team}`)
  .then(r => r.text())
  .then(status => {
    if (status !== "ACTIVE") {
      document.body.innerHTML = "<h1>❌ DISQUALIFIED</h1>";
      throw new Error("Disqualified");
    }
  });

// ================= DISQUALIFY FUNCTION =================


// ================= TAB / APP SWITCH =================
document.addEventListener("visibilitychange", () => {
  if (document.hidden) disqualify("TAB_SWITCH");
});

// ================= ANTI COPY =================
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());

document.addEventListener("keydown", e => {
  if (e.ctrlKey && ["c", "a", "s", "p"].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});

