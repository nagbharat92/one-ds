// Drives the resizable panel groups: dragging a handle, or nudging it with the
// arrow keys, moves flex weight between the two panels it sits between. Weights
// are proportional, so panels keep their ratio when the group itself resizes.
(() => {
  const MIN_FALLBACK = 48;
  const KEYBOARD_STEP = 16;

  const isHorizontal = (group) => group.classList.contains("resizable-group--horizontal");

  const panelSize = (panel, horizontal) => {
    const rect = panel.getBoundingClientRect();
    return horizontal ? rect.width : rect.height;
  };

  const minSize = (group) => {
    const raw = getComputedStyle(group).getPropertyValue("--oneds-component-resizable-panel-min-size");
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : MIN_FALLBACK;
  };

  // Move `deltaPx` of size from the next panel to the previous one (or back).
  const resizeBy = (handle, deltaPx) => {
    const group = handle.parentElement;
    const prev = handle.previousElementSibling;
    const next = handle.nextElementSibling;

    if (!group || !prev || !next) return;

    const horizontal = isHorizontal(group);
    const prevSize = panelSize(prev, horizontal);
    const nextSize = panelSize(next, horizontal);
    const combinedSize = prevSize + nextSize;

    if (combinedSize === 0) return;

    const min = minSize(group);
    const newPrevSize = Math.max(min, Math.min(prevSize + deltaPx, combinedSize - min));

    const prevGrow = Number.parseFloat(getComputedStyle(prev).flexGrow) || 1;
    const nextGrow = Number.parseFloat(getComputedStyle(next).flexGrow) || 1;
    const combinedGrow = prevGrow + nextGrow;
    const newPrevGrow = combinedGrow * (newPrevSize / combinedSize);

    prev.style.flexGrow = String(newPrevGrow);
    next.style.flexGrow = String(combinedGrow - newPrevGrow);

    handle.setAttribute("aria-valuenow", String(Math.round((newPrevSize / combinedSize) * 100)));
  };

  document.querySelectorAll(".resizable-handle").forEach((handle) => {
    const group = handle.parentElement;

    if (!group) return;

    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      const horizontal = isHorizontal(group);
      let last = horizontal ? event.clientX : event.clientY;

      try {
        handle.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is a nicety; dragging still works through the window listeners below.
      }

      handle.classList.add("resizable-handle--active");
      document.documentElement.style.cursor = horizontal ? "col-resize" : "row-resize";
      document.documentElement.style.userSelect = "none";
      event.preventDefault();

      const onMove = (moveEvent) => {
        const current = horizontal ? moveEvent.clientX : moveEvent.clientY;
        resizeBy(handle, current - last);
        last = current;
      };

      const onUp = () => {
        handle.classList.remove("resizable-handle--active");
        document.documentElement.style.cursor = "";
        document.documentElement.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });

    handle.addEventListener("keydown", (event) => {
      const horizontal = isHorizontal(group);
      const decrease = horizontal ? "ArrowLeft" : "ArrowUp";
      const increase = horizontal ? "ArrowRight" : "ArrowDown";

      if (event.key === decrease) {
        resizeBy(handle, -KEYBOARD_STEP);
      } else if (event.key === increase) {
        resizeBy(handle, KEYBOARD_STEP);
      } else {
        return;
      }

      event.preventDefault();
    });
  });
})();
