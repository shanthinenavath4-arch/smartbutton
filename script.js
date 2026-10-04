/* =========================================
   SMARTBUTTON — FINAL INTERACTION ENGINE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const smartButton = document.getElementById("smartButton");
const buttonIcon = document.getElementById("buttonIcon");
const buttonText = document.getElementById("buttonText");
const buttonSmall = document.getElementById("buttonSmall");

const clickCount = document.getElementById("clickCount");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const status = document.getElementById("status");
const lastClick = document.getElementById("lastClick");

const activityList = document.getElementById("activityList");

const resetButton = document.getElementById("resetButton");
const themeButton = document.getElementById("themeButton");
const clearHistory = document.getElementById("clearHistory");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* =========================================
   STATE
========================================= */

let count =
  Number(localStorage.getItem("smart-count")) || 0;

let history =
  JSON.parse(
    localStorage.getItem("smart-history")
  ) || [];


/* =========================================
   TIME
========================================= */

function getTime() {

  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

}


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

  localStorage.setItem(
    "smart-count",
    count
  );

  localStorage.setItem(
    "smart-history",
    JSON.stringify(history)
  );

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

  toastMessage.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 1800);

}


/* =========================================
   ADD ACTIVITY
========================================= */

function addHistory(action) {

  history.unshift({

    action: action,

    time: getTime()

  });

  /*
    Keep only the latest 5 activities
  */

  history = history.slice(0, 5);

  saveData();

  renderHistory();

}


/* =========================================
   RENDER ACTIVITY
========================================= */

function renderHistory() {

  if (history.length === 0) {

    activityList.innerHTML = `
      <div class="empty">
        No interactions yet
      </div>
    `;

    return;
  }


  activityList.innerHTML = history
    .map(item => {

      return `
        <div class="activity-item">

          <span class="activity-dot"></span>

          <span class="activity-name">
            ${item.action}
          </span>

          <span class="activity-time">
            ${item.time}
          </span>

        </div>
      `;

    })
    .join("");

}


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

  const percentage =
    Math.min((count / 10) * 100, 100);


  clickCount.textContent = count;

  progressText.textContent =
    `${percentage}%`;

  progressBar.style.width =
    `${percentage}%`;


  if (count === 0) {

    status.textContent = "Ready";

  } else if (count < 10) {

    status.textContent = "Active";

  } else {

    status.textContent = "Limit";

  }


  renderHistory();

}


/* =========================================
   MAIN ACTION
========================================= */

function runAction(action) {

  /*
    Prevent actions after 10 clicks
  */

  if (count >= 10) {

    showToast(
      "10 click limit reached"
    );

    status.textContent = "Limit";

    return;
  }


  /* Increase counter */

  count++;

  saveData();

  updateUI();


  /* Save interaction */

  addHistory(action);


  /* Loading state */

  smartButton.classList.add("loading");

  buttonIcon.textContent = "◌";

  buttonText.textContent = "WAIT";

  buttonSmall.textContent = "";

  status.textContent = "Processing";


  /*
    Simulated processing
  */

  setTimeout(() => {

    smartButton.classList.remove("loading");

    smartButton.classList.add("completed");


    buttonIcon.textContent = "✓";

    buttonText.textContent = "DONE";

    buttonSmall.textContent = "";


    status.textContent = "Completed";


    lastClick.textContent =
      getTime();


    showToast(
      `${action} completed`
    );


    /*
      Return to normal state
    */

    setTimeout(() => {

      smartButton.classList.remove(
        "completed"
      );


      buttonIcon.textContent = "✦";

      buttonText.textContent = "RUN";

      buttonSmall.textContent = "→";


      status.textContent =
        count >= 10
          ? "Limit"
          : "Active";

    }, 900);

  }, 600);

}


/* =========================================
   SINGLE CLICK
========================================= */

smartButton.addEventListener(
  "click",
  () => {

    runAction(
      "Button clicked"
    );

  }
);


/* =========================================
   DOUBLE CLICK
========================================= */

smartButton.addEventListener(
  "dblclick",
  () => {

    /*
      Double click is tracked
      separately as an interaction.
    */

    addHistory(
      "Double click"
    );

    showToast(
      "Double click detected"
    );

  }
);


/* =========================================
   HOVER
========================================= */

smartButton.addEventListener(
  "mouseenter",
  () => {

    if (
      !smartButton.classList.contains(
        "loading"
      )
    ) {

      status.textContent =
        "Hovering";

    }

  }
);


smartButton.addEventListener(
  "mouseleave",
  () => {

    if (
      !smartButton.classList.contains(
        "loading"
      )
    ) {

      status.textContent =
        count === 0
          ? "Ready"
          : count >= 10
            ? "Limit"
            : "Active";

    }

  }
);


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
  "keydown",
  (event) => {

    /*
      Space and Enter trigger
      the SmartButton.
    */

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();


      const keyName =
        event.key === " "
          ? "Space"
          : "Enter";


      runAction(
        `Keyboard — ${keyName}`
      );

    }

  }
);


/* =========================================
   RESET
========================================= */

resetButton.addEventListener(
  "click",
  () => {

    count = 0;

    history = [];


    localStorage.removeItem(
      "smart-count"
    );

    localStorage.removeItem(
      "smart-history"
    );


    smartButton.classList.remove(
      "loading",
      "completed"
    );


    buttonIcon.textContent = "✦";

    buttonText.textContent = "RUN";

    buttonSmall.textContent = "→";


    lastClick.textContent = "—";

    status.textContent = "Ready";


    updateUI();


    showToast(
      "SmartButton reset"
    );

  }
);


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistory.addEventListener(
  "click",
  () => {

    history = [];

    saveData();

    renderHistory();


    showToast(
      "Activity history cleared"
    );

  }
);


/* =========================================
   DARK / LIGHT THEME
========================================= */

function loadTheme() {

  const savedTheme =
    localStorage.getItem(
      "smart-theme"
    );


  if (savedTheme === "dark") {

    document.body.classList.add(
      "dark"
    );

  }

}


themeButton.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );


    const isDark =
      document.body.classList.contains(
        "dark"
      );


    localStorage.setItem(
      "smart-theme",
      isDark
        ? "dark"
        : "light"
    );


    showToast(
      isDark
        ? "Dark mode enabled"
        : "Light mode enabled"
    );

  }
);


/* =========================================
   START APPLICATION
========================================= */

loadTheme();

updateUI();