(() => {
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = Array.from(list.querySelectorAll(':scope > [role="tab"]'));
    if (!tabs.length) return;

    const perSlot = parseFloat(getComputedStyle(list).getPropertyValue('--oneds-component-tabs-selection-motion-duration')) || 220;

    const select = (tab, focus) => {
      // Scale the slide duration by distance so the pill travels at a constant speed, not a constant time.
      const from = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      const to = tabs.indexOf(tab);
      const slots = from === -1 ? 1 : Math.max(1, Math.abs(to - from));
      list.style.setProperty('--tabs-move-duration', perSlot * slots + 'ms');
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
        const panel = t.getAttribute('aria-controls') && document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };

    list.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab && tabs.includes(tab) && !tab.disabled) select(tab, false);
    });

    list.addEventListener('keydown', (event) => {
      if (!tabs.includes(document.activeElement)) return;
      const enabled = tabs.filter((t) => !t.disabled);
      const index = enabled.indexOf(document.activeElement);
      let target;
      if (event.key === 'ArrowRight') target = enabled[(index + 1) % enabled.length];
      else if (event.key === 'ArrowLeft') target = enabled[(index - 1 + enabled.length) % enabled.length];
      else if (event.key === 'Home') target = enabled[0];
      else if (event.key === 'End') target = enabled[enabled.length - 1];
      if (target) {
        event.preventDefault();
        select(target, true);
      }
    });
  });
})();
