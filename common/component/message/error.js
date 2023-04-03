import { BACKENDMEDIAURL } from "../../store";

export const errorMessage = (message) => {
  const clearMessage = () => {
    const msg = document.querySelector(".notification-message");
    if (!msg) return;
    msg.remove();
  };

  setTimeout(clearMessage, 5000);

  const markup = `<div class="notification-message">
                    <p class="message message__warning"><img src="${BACKENDMEDIAURL}/loaders/warning.svg"> ${message}</p>
                  </div>`;

  clearMessage();
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
};
