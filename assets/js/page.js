import Alpine from "alpinejs";
import CTFd from "./index";

window.CTFd = CTFd;
window.Alpine = Alpine;

Alpine.start();

// Countdown implementation using server-provided contest times
// Times come from window.init.start and window.init.end (Unix timestamps in seconds)
const BANGLADESH_TZ = "Asia/Dhaka"; // UTC+6

function setupCountdown() {
  const cards = document.querySelectorAll(".countdown-card");
  if (!cards.length) return;

  // Get contest times from server configuration
  const startTime = window.init?.start ? new Date(window.init.start * 1000) : null;
  const endTime = window.init?.end ? new Date(window.init.end * 1000) : null;

  // Debug: log server times
  console.log("Contest times from server:", {
    startRaw: window.init?.start,
    endRaw: window.init?.end,
    startTime: startTime?.toISOString(),
    endTime: endTime?.toISOString(),
  });

  // Format dates in Bangladesh timezone for display
  let dateFormatter;
  let timeFormatter;
  try {
    dateFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeZone: BANGLADESH_TZ,
    });
    timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
      timeZone: BANGLADESH_TZ,
    });
  } catch (e) {
    // Fallback: use the browser's local timezone
    dateFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    });
    timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
    });
  }

  const isValid = d => d instanceof Date && !Number.isNaN(d.getTime());

  cards.forEach(card => {
    const round = card.dataset.round;

    let target = null;

    // Use server times based on round type
    if (round === "start") {
      if (isValid(startTime)) target = startTime;
    } else if (round === "end") {
      if (isValid(endTime)) target = endTime;
    }

    // Skip if no valid target time
    if (!isValid(target)) {
      console.warn(`No valid ${round} time configured on server`);
      return;
    }

    const dateEl = card.querySelector(".event-date");
    const timeEl = card.querySelector(".event-time");
    const statusEl = card.querySelector(".round-status");
    const daysEl = card.querySelector(".time-value.days");
    const hoursEl = card.querySelector(".time-value.hours");
    const minutesEl = card.querySelector(".time-value.minutes");
    const secondsEl = card.querySelector(".time-value.seconds");

    // Display formatted date and time
    if (dateEl) dateEl.textContent = dateFormatter.format(target);
    if (timeEl) timeEl.textContent = timeFormatter.format(target);

    const tick = () => {
      const now = new Date();
      let diff = target - now;

      if (diff <= 0) {
        diff = 0;
        if (statusEl) {
          statusEl.textContent = "Completed";
          statusEl.classList.remove("bg-yellow-100", "text-yellow-800");
          statusEl.classList.add("bg-green-100", "text-green-800");
        }
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    };

    tick();
    setInterval(tick, 1000);
  });
}

function setupTimeline() {
  const startTime = window.init?.start ? new Date(window.init.start * 1000) : null;
  const endTime = window.init?.end ? new Date(window.init.end * 1000) : null;

  // Format with date and time in Bangladesh timezone
  let dateTimeFormatter;
  try {
    dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: BANGLADESH_TZ,
    });
  } catch (e) {
    dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  const isValid = d => d instanceof Date && !Number.isNaN(d.getTime());

  // Update timeline start elements
  const startEls = document.querySelectorAll(".timeline-start");
  startEls.forEach(el => {
    if (isValid(startTime)) {
      el.textContent = dateTimeFormatter.format(startTime);
    }
  });

  // Update timeline end elements
  const endEls = document.querySelectorAll(".timeline-end");
  endEls.forEach(el => {
    if (isValid(endTime)) {
      el.textContent = dateTimeFormatter.format(endTime);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupCountdown();
  setupTimeline();
});
