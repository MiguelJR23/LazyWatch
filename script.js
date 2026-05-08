const zones = [
  {
    city: "São Paulo",
    country: "Brasil",
    tz: "America/Sao_Paulo",
    flag: "flags/br.png"
  },

  {
    city: "Nova York",
    country: "EUA",
    tz: "America/New_York",
    flag: "flags/us.png"
  },

  {
    city: "Londres",
    country: "Reino Unido",
    tz: "Europe/London",
    flag: "flags/gb.png"
  },

  {
    city: "Paris",
    country: "França",
    tz: "Europe/Paris",
    flag: "flags/fr.png"
  },

  {
    city: "Tóquio",
    country: "Japão",
    tz: "Asia/Tokyo",
    flag: "flags/jp.png"
  },

  {
    city: "Sydney",
    country: "Austrália",
    tz: "Australia/Sydney",
    flag: "flags/au.png"
  }
];

const container =
  document.getElementById("clockContainer");

const addClockBtn =
  document.getElementById("addClock");

let clocks = [];

function createClock(savedZone = zones[0].tz) {

  const id = Date.now();

  clocks.push({
    id,
    tz: savedZone
  });

  renderClocks();

  saveClocks();
}

function renderClocks() {

  container.innerHTML = "";

  clocks.forEach(clock => {

    const zone =
      zones.find(z => z.tz === clock.tz);

    const card =
      document.createElement("div");

    card.className = "clock-card";

    card.innerHTML = `
      <div class="clock-top">

        <img src="${zone.flag}">

        <div>
          <div class="clock-city">
            ${zone.city}
          </div>

          <div class="clock-extra">
            ${zone.country}
          </div>
        </div>

      </div>

      <div class="clock-time"
        id="time-${clock.id}">
      </div>

      <div class="clock-extra"
        id="extra-${clock.id}">
      </div>

      <select onchange="changeZone(${clock.id}, this.value)">
        ${zones.map(z => `
          <option
            value="${z.tz}"
            ${z.tz === clock.tz ? "selected" : ""}
          >
            ${z.city}
          </option>
        `).join("")}
      </select>
    `;

    container.appendChild(card);
  });

}

function changeZone(id, tz) {

  const clock =
    clocks.find(c => c.id === id);

  clock.tz = tz;

  renderClocks();

  saveClocks();
}

function getTimeData(tz) {

  const now = new Date();

  const formatter =
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

  const hour =
    Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "numeric",
        hour12: false
      }).format(now)
    );

  let period = "Noite";

  if(hour >= 6 && hour < 12)
    period = "Manhã";

  else if(hour >= 12 && hour < 18)
    period = "Tarde";

  return {
    time: formatter.format(now),
    hour,
    period
  };
}

function updateClocks() {

  clocks.forEach(clock => {

    const data =
      getTimeData(clock.tz);

    const timeEl =
      document.getElementById(`time-${clock.id}`);

    const extraEl =
      document.getElementById(`extra-${clock.id}`);

    if(timeEl) {

      timeEl.textContent =
        data.time;

      extraEl.textContent =
        data.period;
    }
  });

  updateComparison();
}

function updateComparison() {

  const text =
    document.getElementById("comparisonText");

  if(clocks.length < 2) {

    text.textContent =
      "Adicione ao menos dois relógios.";

    return;
  }

  const first =
    getTimeData(clocks[0].tz);

  const second =
    getTimeData(clocks[1].tz);

  let diff =
    second.hour - first.hour;

  if(diff > 0)
    diff = `+${diff}`;

  text.textContent =
    `Diferença entre os dois primeiros relógios: ${diff}h`;
}

function saveClocks() {

  localStorage.setItem(
    "lazywatch-clocks",
    JSON.stringify(clocks)
  );
}

function loadClocks() {

  const saved =
    localStorage.getItem(
      "lazywatch-clocks"
    );

  if(saved) {

    clocks = JSON.parse(saved);

    renderClocks();

  } else {

    createClock(zones[0].tz);

    createClock(zones[4].tz);
  }
}

addClockBtn.addEventListener(
  "click",
  () => createClock(zones[0].tz)
);

loadClocks();

setInterval(updateClocks, 1000);

updateClocks();


// =========================
// CRONÔMETRO
// =========================

let stopwatchTime = 0;
let stopwatchInterval = null;

function formatTime(ms) {

  const total =
    Math.floor(ms / 1000);

  const h =
    String(
      Math.floor(total / 3600)
    ).padStart(2, "0");

  const m =
    String(
      Math.floor((total % 3600) / 60)
    ).padStart(2, "0");

  const s =
    String(total % 60)
    .padStart(2, "0");

  return `${h}:${m}:${s}`;
}

function startStopwatch() {

  if(stopwatchInterval)
    return;

  stopwatchInterval =
    setInterval(() => {

      stopwatchTime += 1000;

      document.getElementById(
        "stopwatchDisplay"
      ).textContent =
        formatTime(stopwatchTime);

    }, 1000);
}

function pauseStopwatch() {

  clearInterval(stopwatchInterval);

  stopwatchInterval = null;
}

function resetStopwatch() {

  pauseStopwatch();

  stopwatchTime = 0;

  document.getElementById(
    "stopwatchDisplay"
  ).textContent = "00:00:00";
}


// =========================
// TIMER
// =========================

let timer = 0;
let timerInterval = null;

function updateTimerDisplay() {

  const m =
    String(Math.floor(timer / 60))
    .padStart(2, "0");

  const s =
    String(timer % 60)
    .padStart(2, "0");

  document.getElementById(
    "timerDisplay"
  ).textContent =
    `${m}:${s}`;
}

function startTimer() {

  if(timerInterval)
    return;

  if(timer <= 0) {

    const min =
      Number(
        document.getElementById(
          "minutesInput"
        ).value
      ) || 0;

    const sec =
      Number(
        document.getElementById(
          "secondsInput"
        ).value
      ) || 0;

    timer = (min * 60) + sec;
  }

  updateTimerDisplay();

  timerInterval =
    setInterval(() => {

      timer--;

      updateTimerDisplay();

      if(timer <= 0) {

        clearInterval(timerInterval);

        timerInterval = null;

        alert("Tempo encerrado!");
      }

    }, 1000);
}

function pauseTimer() {

  clearInterval(timerInterval);

  timerInterval = null;
}

function resetTimer() {

  pauseTimer();

  timer = 0;

  updateTimerDisplay();
}