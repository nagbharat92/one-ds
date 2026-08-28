(() => {
  const entries = [...document.querySelectorAll(".sidebar__toc-link[href^='#']")]
    .map((link) => ({ link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
    .filter((entry) => entry.target);

  if (!entries.length) {
    return;
  }

  // The host may serve the site under a <base> (subpath hosting), which makes a
  // bare "#id" link resolve against the base URL and reload the app root instead
  // of scrolling. Pin each link to this document and scroll to the target directly.
  for (const { link, target } of entries) {
    const hash = link.hash;
    link.setAttribute("href", location.pathname + hash);
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView();
      history.pushState(null, "", location.pathname + hash);
    });
  }

  const panel = entries[0].link.closest(".sidebar");
  let current = null;
  let queued = false;

  function currentEntry() {
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;

    if (atBottom) {
      return entries[entries.length - 1];
    }

    // A section counts as current once its heading crosses the upper quarter of the viewport.
    const line = window.innerHeight * 0.25;
    let found = entries[0];

    for (const entry of entries) {
      if (entry.target.getBoundingClientRect().top <= line) {
        found = entry;
      }
    }

    return found;
  }

  // scrollIntoView would also scroll the document, so move the panel directly.
  function keepVisible(link) {
    if (!panel) {
      return;
    }

    const linkBox = link.getBoundingClientRect();
    const panelBox = panel.getBoundingClientRect();

    if (linkBox.top < panelBox.top) {
      panel.scrollTop -= panelBox.top - linkBox.top;
    } else if (linkBox.bottom > panelBox.bottom) {
      panel.scrollTop += linkBox.bottom - panelBox.bottom;
    }
  }

  function update() {
    queued = false;
    const entry = currentEntry();

    if (entry === current) {
      return;
    }

    current?.link.removeAttribute("aria-current");
    entry.link.setAttribute("aria-current", "location");
    current = entry;
    keepVisible(entry.link);
  }

  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }

  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  update();
})();
