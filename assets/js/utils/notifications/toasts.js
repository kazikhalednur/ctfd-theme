import Alpine from "alpinejs";
import { Toast } from "../toast";
import CTFd from "../../index";

export default () => {
  Alpine.store("toast", { title: "", html: "" });

  CTFd._functions.events.eventToast = data => {
    Alpine.store("toast", data);
    let toast = Toast.getOrCreateInstance(document.querySelector("[x-ref='toast']"));
    if (toast) {
      let close = toast._element.querySelector("[data-bs-dismiss='toast']");
      if (close) {
        let handler = event => {
          CTFd._functions.events.eventRead(data.id);
        };
        close.addEventListener("click", handler, { once: true });
        toast._element.addEventListener(
          "hidden.toast",
          event => {
            close.removeEventListener("click", handler);
          },
          { once: true },
        );
      }
      toast.show();
    }
  };
};
