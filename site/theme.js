const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");

function setTheme(theme) {
  root.dataset.onedsTheme = theme;
  const dark = theme === "dark";
  themeToggle.textContent = dark ? "Use light theme" : "Use dark theme";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.onedsTheme === "dark" ? "light" : "dark");
});

setTheme(root.dataset.onedsTheme || "light");