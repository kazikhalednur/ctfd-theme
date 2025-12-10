// Simple alert implementation - alerts can be dismissed via Alpine.js
export default () => {
  // Alert dismiss functionality can be handled via Alpine.js
  // This ensures alerts with data-bs-dismiss work
  const alertList = [].slice.call(document.querySelectorAll(".alert"));
  alertList.forEach(function (element) {
    const dismissBtn = element.querySelector('[data-bs-dismiss="alert"]');
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        element.style.transition = "opacity 0.15s linear";
        element.style.opacity = "0";
        setTimeout(() => {
          element.remove();
        }, 150);
      });
    }
  });
};
