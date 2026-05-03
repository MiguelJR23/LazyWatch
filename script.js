const zones = [
  { name: "Brasil (São Paulo)", tz: "America/Sao_Paulo", flag: "br.png" },
  { name: "EUA (Nova York)", tz: "America/New_York", flag: "us.png" },
  { name: "Reino Unido (Londres)", tz: "Europe/London", flag: "gb.png" },
  { name: "França (Paris)", tz: "Europe/Paris", flag: "fr.png" },
  { name: "Japão (Tóquio)", tz: "Asia/Tokyo", flag: "jp.png" },
  { name: "Austrália (Sydney)", tz: "Australia/Sydney", flag: "au.png" }
];

function populate(id) {
  const select = document.getElementById(id);

  zones.forEach(z => {
    const option = document.createElement("option");
    option.value = z.tz;
    option.textContent = z.name;
    select.appendChild(option);
  });
}

populate("tz1");
populate("tz2");

const saved1 = localStorage.getItem("tz1");
const saved2 = localStorage.getItem("tz2");

if (saved1) document.getElementById("tz1").value = saved1;
if (saved2) document.getElementById("tz2").value = saved2;

// função relógio
function getTime(tz) {
  return new Date().toLocaleTimeString("pt-BR", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// atualiza a bandeira
function updateFlag(selectId, imgId) {
  const tz = document.getElementById(selectId).value;
  const zone = zones.find(z => z.tz === tz);
  document.getElementById(imgId).src = "flags/" + zone.flag;
}

// diferença horário
function getOffset(tz) {
  const now = new Date();
  const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  return (local - now) / (1000 * 60 * 60);
}

// loop
setInterval(() => {
  const tz1 = document.getElementById("tz1").value;
  const tz2 = document.getElementById("tz2").value;

  document.getElementById("clock1").textContent = getTime(tz1);
  document.getElementById("clock2").textContent = getTime(tz2);

  updateFlag("tz1", "flag1");
  updateFlag("tz2", "flag2");

  const diff = getOffset(tz2) - getOffset(tz1);
  document.getElementById("difference").textContent =
    "Diferença: " + diff + "h";

}, 1000);

// salva
document.getElementById("tz1").addEventListener("change", e => {
  localStorage.setItem("tz1", e.target.value);
});

document.getElementById("tz2").addEventListener("change", e => {
  localStorage.setItem("tz2", e.target.value);
});

// Cronomêtro
let time = 0;
let interval = null;

function format(ms) {
  let total = Math.floor(ms / 1000);
  let h = String(Math.floor(total / 3600)).padStart(2, '0');
  let m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  let s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function start() {
  if (interval) return;
  interval = setInterval(() => {
    time += 1000;
    document.getElementById("display").textContent = format(time);
  }, 1000);
}

function pause() {
  clearInterval(interval);
  interval = null;
}

function reset() {
  pause();
  time = 0;
  document.getElementById("display").textContent = "00:00:00";
}
