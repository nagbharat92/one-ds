document.querySelectorAll("[data-alert-dialog-trigger]").forEach((trigger) => {
  const dialog = document.getElementById(trigger.dataset.alertDialogTrigger);

  if (!(dialog instanceof HTMLDialogElement)) return;

  trigger.addEventListener("click", () => dialog.showModal());
});
