// Pair any [data-sidebar-toggle="<id>"] control to its .app-sidebar and flip the
// data-state attribute the CSS reads. Ctrl/Cmd+B toggles the first sidebar.
document.querySelectorAll("[data-sidebar-toggle]").forEach((trigger) => {
  const sidebar = document.getElementById(trigger.dataset.sidebarToggle);

  if (!sidebar) return;

  const sync = () => {
    trigger.setAttribute("aria-expanded", String(sidebar.dataset.state !== "collapsed"));
  };

  const toggle = () => {
    sidebar.dataset.state = sidebar.dataset.state === "collapsed" ? "expanded" : "collapsed";
    sync();
  };

  sync();
  trigger.addEventListener("click", toggle);

  window.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      toggle();
    }
  });
});
