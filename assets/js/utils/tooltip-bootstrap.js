// Simple Tooltip implementation compatible with Bootstrap API
export class Tooltip {
  constructor(element, options = {}) {
    this._element =
      typeof element === "string" ? document.querySelector(element) : element;
    this._options = { ...options };
    this._tooltip = null;
    this._isEnabled = true;
  }

  static getOrCreateInstance(element, options = {}) {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return null;

    if (!el._tooltipInstance) {
      el._tooltipInstance = new Tooltip(el, options);
    }
    return el._tooltipInstance;
  }

  show() {
    if (!this._isEnabled || !this._element) return;

    const title =
      this._options.title ||
      this._element.getAttribute("data-bs-original-title") ||
      this._element.getAttribute("title");
    if (!title) return;

    // Remove title to prevent native tooltip
    this._element.setAttribute("data-bs-original-title", title);
    this._element.removeAttribute("title");

    // Create tooltip element
    this._tooltip = document.createElement("div");
    this._tooltip.className =
      "fixed bg-gray-900 text-white px-2 py-1 rounded text-sm z-50 pointer-events-none";
    this._tooltip.textContent = title;
    this._tooltip.style.opacity = "0";
    this._tooltip.style.transition = "opacity 0.15s";
    document.body.appendChild(this._tooltip);

    // Position tooltip
    const rect = this._element.getBoundingClientRect();
    this._tooltip.style.top = `${rect.top - this._tooltip.offsetHeight - 5}px`;
    this._tooltip.style.left = `${rect.left + rect.width / 2 - this._tooltip.offsetWidth / 2}px`;

    // Show with animation
    setTimeout(() => {
      if (this._tooltip) {
        this._tooltip.style.opacity = "1";
      }
    }, 10);
  }

  hide() {
    if (this._tooltip) {
      this._tooltip.style.opacity = "0";
      setTimeout(() => {
        if (this._tooltip) {
          this._tooltip.remove();
          this._tooltip = null;
        }
      }, 150);
    }
  }

  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
    this.hide();
  }
}
