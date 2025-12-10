// Simple Toast implementation compatible with Bootstrap API
export class Toast {
  constructor(element, options = {}) {
    this._element =
      typeof element === "string" ? document.querySelector(element) : element;
    this._options = { ...options };
    this._isShown = false;
  }

  static getOrCreateInstance(element, options = {}) {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return null;

    if (!el._toastInstance) {
      el._toastInstance = new Toast(el, options);
    }
    return el._toastInstance;
  }

  show() {
    if (this._isShown || !this._element) return;

    this._isShown = true;
    this._element.classList.add("show");
    this._element.style.display = "block";
    this._element.style.opacity = "1";

    // Trigger shown event
    this._element.dispatchEvent(new Event("shown.toast", { bubbles: true }));

    // Auto hide if autohide is enabled
    const autohide = this._options.autohide !== false;
    const delay = this._options.delay || 5000;

    if (autohide) {
      setTimeout(() => {
        this.hide();
      }, delay);
    }
  }

  hide() {
    if (!this._isShown) return;

    this._isShown = false;
    this._element.style.opacity = "0";
    this._element.style.transition = "opacity 0.15s linear";

    setTimeout(() => {
      this._element.classList.remove("show");
      this._element.style.display = "none";
      // Trigger hidden event
      this._element.dispatchEvent(new Event("hidden.toast", { bubbles: true }));
    }, 150);
  }
}
