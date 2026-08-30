// Sync a slider's fill to its input(s). CSS cannot read a range value, so the
// filled track is driven by the custom properties this script keeps up to date:
// --slider-value on a basic .slider, --slider-min / --slider-max on .slider--range.
(function () {
  function percent(input) {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value);
    return max === min ? 0 : ((value - min) / (max - min)) * 100;
  }

  function initBasic(slider) {
    const input = slider.querySelector(".slider__input");
    if (!input) return;

    // Optional value readout in an enclosing .slider-field; keep its unit suffix.
    const output = slider.closest(".slider-field")?.querySelector(".slider-field__value");
    const suffix = output ? output.textContent.replace(/[\d.\s]/g, "") : "";

    const update = () => {
      slider.style.setProperty("--slider-value", percent(input));
      if (output) output.textContent = input.value + suffix;
    };
    input.addEventListener("input", update);
    update();
  }

  function initRange(slider) {
    const inputs = slider.querySelectorAll(".slider__input");
    if (inputs.length < 2) return;

    const [lower, upper] = inputs;

    const update = () => {
      // Keep the thumbs from crossing: push the idle handle to the active one.
      if (Number(lower.value) > Number(upper.value)) {
        if (document.activeElement === lower) upper.value = lower.value;
        else lower.value = upper.value;
      }
      slider.style.setProperty("--slider-min", percent(lower));
      slider.style.setProperty("--slider-max", percent(upper));
    };

    lower.addEventListener("input", update);
    upper.addEventListener("input", update);
    update();
  }

  document.querySelectorAll(".slider").forEach((slider) => {
    if (slider.classList.contains("slider--range")) initRange(slider);
    else initBasic(slider);
  });
})();
