import Alpine from "alpinejs";
import { Modal } from "./utils/modal";
import { serializeJSON } from "@ctfdio/ctfd-js/forms";

import CTFd from "./index";
import { copyToClipboard } from "./utils/clipboard";

window.Alpine = Alpine;

Alpine.data("SettingsForm", () => ({
  success: null,
  error: null,
  initial: null,
  errors: [],

  init() {
    this.initial = serializeJSON(this.$el);
  },

  async updateProfile() {
    this.success = null;
    this.error = null;
    this.errors = [];

    let data = serializeJSON(this.$el, this.initial, true);

    // Process fields[id] to fields: {}
    data.fields = [];
    for (const property in data) {
      if (property.match(/fields\[\d+\]/)) {
        let field = {};
        let id = parseInt(property.slice(7, -1));
        field["field_id"] = id;
        field["value"] = data[property];
        data.fields.push(field);
        delete data[property];
      }
    }

    // Send API request
    const response = await CTFd.pages.settings.updateSettings(data);
    if (response.success) {
      this.success = true;
      this.error = false;

      setTimeout(() => {
        this.success = null;
        this.error = null;
      }, 3000);
    } else {
      this.success = false;
      this.error = true;

      Object.keys(response.errors).map(error => {
        const error_msg = response.errors[error];
        this.errors.push(error_msg);
      });
    }
  },
}));

Alpine.data("TokensForm", () => ({
  token: null,

  async generateToken() {
    const data = serializeJSON(this.$el);

    if (!data.expiration) {
      delete data.expiration;
    }
    const response = await CTFd.pages.settings.generateToken(data);
    this.token = response.data.value;

    const modal = Modal.getOrCreateInstance(this.$refs.tokenModal);
    modal?.show();
  },

  closeTokenModal() {
    const modal = Modal.getOrCreateInstance(this.$refs.tokenModal);
    modal?.hide();
    window.dispatchEvent(new CustomEvent("tokens:refresh"));
  },

  copyToken() {
    copyToClipboard(this.$refs.token);
  },
}));

Alpine.data("Tokens", () => ({
  selectedTokenId: null,
  tokensTbody: null,

  init() {
    this.tokensTbody = this.$root.querySelector("tbody");
    this._onRefresh = this.refreshTokens.bind(this);
    window.addEventListener("tokens:refresh", this._onRefresh);
  },

  destroy() {
    if (this._onRefresh) {
      window.removeEventListener("tokens:refresh", this._onRefresh);
    }
  },

  renderTokens(tokens = []) {
    if (!this.tokensTbody) return;
    this.tokensTbody.innerHTML = tokens
      .map(
        token => `
          <tr x-ref="token-${token.id}" class="border-b border-gray-200 hover:bg-blue-50 transition">
            <td class="text-center px-4 py-3">
              <span data-time="${token.created}"></span>
            </td>
            <td class="px-4 py-3">
              <span data-time="${token.expiration}"></span>
            </td>
            <td class="px-4 py-3">
              <span class="text-gray-700">${token.description || ""}</span>
            </td>
            <td class="text-center px-4 py-3">
              <button
                  class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105 text-sm font-semibold"
                  @click="deleteTokenModal(${token.id})"
                  title="${CTFd._("Delete token")}"
              >
                <i class="fas fa-trash-alt mr-1"></i>${CTFd._("Delete")}
              </button>
            </td>
          </tr>
        `,
      )
      .join("");
  },

  async refreshTokens() {
    try {
      const res = await fetch("/api/v1/tokens", { credentials: "same-origin" });
      const data = await res.json();
      const tokens = data?.data || data?.tokens || data?.results || [];
      this.renderTokens(tokens);
    } catch (err) {
      console.error("Failed to refresh tokens", err);
    }
  },

  async deleteTokenModal(tokenId) {
    this.selectedTokenId = tokenId;
    const modal = Modal.getOrCreateInstance(this.$refs.confirmModal);
    modal?.show();
  },

  async deleteSelectedToken() {
    await CTFd.pages.settings.deleteToken(this.selectedTokenId);
    const $token = this.$refs[`token-${this.selectedTokenId}`];

    if ($token) {
      $token.remove();
    }
  },

  hideConfirmModal() {
    const modal = Modal.getOrCreateInstance(this.$refs.confirmModal);
    modal?.hide();
  },

  closeConfirmModal() {
    this.hideConfirmModal();
  },
}));

Alpine.start();
