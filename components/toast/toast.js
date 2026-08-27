/* Toast lifecycle: dismiss on the close button and, optionally, after a set duration.
   The CSS owns the entrance and exit motion; this only removes the node once it has left. */
(() => {
  const EXIT_MS = 220;

  function dismiss(toast) {
    if (!toast || toast.dataset.state === "closing") return;
    toast.dataset.state = "closing";
    setTimeout(() => toast.remove(), EXIT_MS);
  }

  document.addEventListener("click", (event) => {
    const close = event.target.closest(".toast__close");
    if (close) dismiss(close.closest(".toast"));
  });

  document.querySelectorAll(".toast[data-toast-duration]").forEach((toast) => {
    const ms = Number(toast.dataset.toastDuration);
    if (ms > 0) setTimeout(() => dismiss(toast), ms);
  });
})();
