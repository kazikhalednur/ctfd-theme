// Simple Tab implementation compatible with Bootstrap API
export class Tab {
  constructor(element) {
    this._element =
      typeof element === "string" ? document.querySelector(element) : element;
  }

  static getOrCreateInstance(element) {
    const el = typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return null;
    return new Tab(el);
  }

  show() {
    if (!this._element) return;

    // Find the tab button that triggers this tab
    const tabId = this._element.getAttribute("id");
    const tabButton = document.querySelector(
      `[data-bs-target="#${tabId}"], [href="#${tabId}"]`,
    );

    if (tabButton) {
      // Remove active from all tabs in the same tab list
      const tabList = tabButton.closest('.nav-tabs, .nav-pills, [role="tablist"]');
      if (tabList) {
        tabList.querySelectorAll('.nav-link, [role="tab"]').forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });
        tabButton.classList.add("active");
        tabButton.setAttribute("aria-selected", "true");
      }
    }

    // Hide all tab panes in the same container
    const tabContainer = this._element.closest('.tab-content, [role="tabpanel"]');
    if (tabContainer) {
      tabContainer.querySelectorAll('.tab-pane, [role="tabpanel"]').forEach(pane => {
        pane.classList.remove("show", "active");
        pane.style.display = "none";
      });
    }

    // Show this tab pane
    this._element.classList.add("show", "active");
    this._element.style.display = "block";

    // Trigger shown event
    this._element.dispatchEvent(new Event("shown.tab", { bubbles: true }));
  }
}
