import Alpine from "alpinejs";
import { Modal } from "../modal";

import CTFd from "../../index";

export default () => {
  Alpine.store("modal", { title: "", html: "" });

  CTFd._functions.events.eventAlert = data => {
    Alpine.store("modal", data);
    let modal = Modal.getOrCreateInstance(document.querySelector("[x-ref='modal']"));
    if (modal) {
      modal._element.addEventListener(
        "hidden.modal",
        event => {
          CTFd._functions.events.eventRead(data.id);
        },
        { once: true },
      );
      modal.show();
    }
  };
};
