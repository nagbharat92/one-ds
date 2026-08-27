document.querySelectorAll("[data-drawer-trigger]").forEach((trigger) => {
  const drawer = document.getElementById(trigger.dataset.drawerTrigger);

  if (!(drawer instanceof HTMLDialogElement)) return;

  trigger.addEventListener("click", () => drawer.showModal());
});
