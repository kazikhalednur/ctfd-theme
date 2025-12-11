// Simple Modal implementation compatible with Bootstrap API
export class Modal {
  constructor(element, options = {}) {
    this._element =
      typeof element === "string" ? document.querySelector(element) : element;
    this._options = options;
    this._isShown = false;
    this._backdrop = null;
  }

  static getOrCreateInstance(element, options = {}) {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return null;

    if (!el._modalInstance) {
      el._modalInstance = new Modal(el, options);
    }
    return el._modalInstance;
  }

  show() {
    if (this._isShown) return;

    this._isShown = true;
    this._element.classList.remove("hidden");
    this._element.classList.add("show");
    this._element.style.display = "block";
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";

    // Create backdrop
    this._backdrop = document.createElement("div");
    this._backdrop.className = "fixed inset-0 bg-black bg-opacity-50 z-40";
    this._backdrop.style.transition = "opacity 0.15s linear";
    document.body.appendChild(this._backdrop);

    // Trigger shown event
    this._element.dispatchEvent(new Event("shown.modal", { bubbles: true }));
  }

  hide() {
    if (!this._isShown) return;

    this._isShown = false;
    this._element.classList.remove("show");
    this._element.style.display = "none";
    this._element.classList.add("hidden");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";

    // Remove backdrop
    if (this._backdrop) {
      this._backdrop.remove();
      this._backdrop = null;
    }

    // Trigger hidden event
    this._element.dispatchEvent(new Event("hidden.modal", { bubbles: true }));
  }

  toggle() {
    if (this._isShown) {
      this.hide();
    } else {
      this.show();
    }
  }
}
