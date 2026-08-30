// Native <details> gives open/close but no selection; this wires option choice
// (update the trigger value, move the check, close) plus outside-click, Escape,
// and single-open dismissal.
function chooseOption(select, option) {
  select.querySelectorAll(".select__option").forEach((candidate) => {
    candidate.setAttribute("aria-selected", candidate === option ? "true" : "false");
  });

  const value = select.querySelector(".select__value");
  const label = option.querySelector(".select__option-label");

  if (value && label) {
    value.textContent = label.textContent;
    value.classList.remove("select__value--placeholder");
  }

  select.open = false;
  select.querySelector(".select__trigger")?.focus();
}

document.addEventListener("click", (event) => {
  const option = event.target.closest(".select__option");

  if (option && !option.disabled) {
    const select = option.closest("details.select");

    if (select) {
      chooseOption(select, option);
      return;
    }
  }

  document.querySelectorAll("details.select[open]").forEach((select) => {
    if (!select.contains(event.target)) {
      select.open = false;
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  document.querySelectorAll("details.select[open]").forEach((select) => {
    select.open = false;
  });
});

document.querySelectorAll("details.select").forEach((select) => {
  select.addEventListener("toggle", () => {
    if (!select.open) return;

    document.querySelectorAll("details.select[open]").forEach((other) => {
      if (other !== select) {
        other.open = false;
      }
    });
  });
});
