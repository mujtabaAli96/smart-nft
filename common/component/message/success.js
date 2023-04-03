import { BACKENDMEDIAURL } from "../../store";

export const successMessage = (message) => {
  const clearMessage = () => {
    console.log("clearing the notification");
    const msg = document.querySelector(".notification-message");
    if (!msg) return;
    msg.remove();
  };

  setTimeout(clearMessage, 5000);

  const markup = `<div class="notification-message">
                    <p class="message message__success"><img src="${BACKENDMEDIAURL}/loaders/success.svg"> ${message}</p>
                  </div>`;

  clearMessage();
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
};
