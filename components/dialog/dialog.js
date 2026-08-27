document.querySelectorAll("[data-dialog-trigger]").forEach((trigger) => {
  const dialog = document.getElementById(trigger.dataset.dialogTrigger);

  if (!(dialog instanceof HTMLDialogElement)) return;

  trigger.addEventListener("click", () => dialog.showModal());
});
