document.querySelectorAll("button[data-token]").forEach((control) => {
  const token = control.dataset.token;
  const label = control.textContent;

  if (!token) return;

  control.setAttribute("aria-label", `Copy ${token}`);

  control.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(token);
      control.textContent = "Copied";
    } catch {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(control);
      selection.removeAllRanges();
      selection.addRange(range);

      if (document.execCommand("copy")) {
        control.textContent = "Copied";
      } else {
        control.textContent = "Copy failed";
      }

      selection.removeAllRanges();
    }
  });

  control.addEventListener("blur", () => {
    control.textContent = label;
  });
});
