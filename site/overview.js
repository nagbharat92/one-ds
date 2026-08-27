document.querySelectorAll("[data-copy-target]").forEach((copyButton) => {
  const labelElement = copyButton.querySelector("[data-copy-label]");
  const copyIcon = copyButton.querySelector('[data-copy-icon="copy"]');
  const successIcon = copyButton.querySelector('[data-copy-icon="success"]');
  const idleLabel = labelElement.textContent;
  let restoreLabel;

  function setState(label, state) {
    labelElement.textContent = label;
    copyIcon.toggleAttribute("hidden", state === "success");
    successIcon.toggleAttribute("hidden", state !== "success");
  }

  copyButton.addEventListener("click", async () => {
    const target = document.getElementById(copyButton.dataset.copyTarget);

    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent);
      setState("Copied", "success");
    } catch {
      const range = document.createRange();

      range.selectNodeContents(target);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      setState("Press Command+C");
    }

    clearTimeout(restoreLabel);
    restoreLabel = setTimeout(() => {
      setState(idleLabel);
    }, 2400);
  });
});