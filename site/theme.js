const root = document.documentElement;
const themeControls = [...document.querySelectorAll("[data-theme-value]")];
const themeStorageKey = "oneds-theme";

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem(themeStorageKey, theme);

  themeControls.forEach((control) => {
    control.setAttribute("aria-pressed", String(control.dataset.themeValue === theme));
  });
}

themeControls.forEach((control) => {
  control.addEventListener("click", () => setTheme(control.dataset.themeValue));
});

setTheme(localStorage.getItem(themeStorageKey) || "light");