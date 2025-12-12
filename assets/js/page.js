import Alpine from "alpinejs";
import CTFd from "./index";

window.CTFd = CTFd;
window.Alpine = Alpine;

Alpine.start();

// Countdown implementation (no Bootstrap dependency)
// You can manually set these to override dates without touching HTML.
// Format: ISO 8601 string in local time or with timezone offset.
const PRELIMINARY_TARGET = "2025-12-16T10:00:00"; // 16 Dec 2025, 10:00 PM
const FINAL_TARGET = "2025-12-20T09:00:00"; // 20 Dec 2025, 09:00 PM

function setupCountdown() {
  const cards = document.querySelectorAll(".countdown-card");
  if (!cards.length) return;

  const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
  const timeFormatter = new Intl.DateTimeFormat(undefined, { timeStyle: "short" });

  const startCfg = window.init?.start ? new Date(window.init.start * 1000) : null;
  const endCfg = window.init?.end ? new Date(window.init.end * 1000) : null;

  cards.forEach(card => {
    const round = card.dataset.round;
    const fallback = card.dataset.target;

    let target = null;
    const isValid = d => d instanceof Date && !Number.isNaN(d.getTime());

    if (round === "preliminary") {
      const manual = new Date(PRELIMINARY_TARGET);
      if (isValid(manual)) target = manual;
      if (!target && isValid(startCfg)) target = startCfg;
    } else if (round === "final") {
      const manual = new Date(FINAL_TARGET);
      if (isValid(manual)) target = manual;
      if (!target && isValid(endCfg)) target = endCfg;
    }

    if (!target && fallback) {
      const fb = new Date(fallback);
      if (isValid(fb)) target = fb;
    }

    if (!(target instanceof Date) || Number.isNaN(target.getTime())) return;

    const dateEl = card.querySelector(".event-date");
    const timeEl = card.querySelector(".event-time");
    const statusEl = card.querySelector(".round-status");
    const daysEl = card.querySelector(".time-value.days");
    const hoursEl = card.querySelector(".time-value.hours");
    const minutesEl = card.querySelector(".time-value.minutes");
    const secondsEl = card.querySelector(".time-value.seconds");

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

document.addEventListener("DOMContentLoaded", setupCountdown);
