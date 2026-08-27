// Spinner motion lab — drives the live SVG preview from the OneDS controls.
(function () {
  const TAU = Math.PI * 2;
  // Cumulative angle (deg); velocity ∝ 1 - s·cos(2πx): slow at the top, fast at the bottom.
  const theta = (x, s) => 360 * (x - (s / TAU) * Math.sin(TAU * x));

  const byId = (id) => document.getElementById(id);
  const spinner = byId('lab-spinner');
  if (!spinner) return;

  const arcs = [...document.querySelectorAll('.lab-arc')];
  const svgs = [...document.querySelectorAll('.lab-spinner')];
  const mHead = byId('lab-head');
  const mTail = byId('lab-tail');
  const caps = byId('lab-caps');
  const reverse = byId('lab-reverse');
  const points = byId('lab-points');

  const keys = ['duration', 'phi', 'exag', 'size', 'thick', 'rail'];
  const fmt = {
    duration: (v) => v + ' ms',
    phi: (v) => Math.round(v) + '%',
    exag: (v) => (+v).toFixed(2),
    size: (v) => v + ' px',
    thick: (v) => String(+v),
    rail: (v) => (+v).toFixed(2)
  };
  const defaults = { duration: 1000, phi: 20, exag: 0.65, size: 128, thick: 4, rail: 0.2, caps: true, reverse: false, points: false };

  const state = {};

  function syncFill(key) {
    const input = byId('lab-' + key);
    const min = +input.min, max = +input.max, v = +input.value;
    input.closest('.slider').style.setProperty('--slider-value', (v - min) / (max - min) * 100);
    byId('lab-' + key + '-value').textContent = fmt[key](input.value);
  }

  function read() {
    keys.forEach(syncFill);
    state.duration = +byId('lab-duration').value;
    state.phi = +byId('lab-phi').value / 100;
    state.s = +byId('lab-exag').value;
    state.size = +byId('lab-size').value;
    state.thick = +byId('lab-thick').value;
    state.rail = +byId('lab-rail').value;
    state.caps = caps.checked;
    state.reverse = reverse.checked;
    state.points = points.checked;

    spinner.setAttribute('width', state.size);
    spinner.setAttribute('height', state.size);
    document.documentElement.style.setProperty('--lab-rail', state.rail);

    byId('lab-arc').setAttribute('stroke-width', state.thick);
    spinner.querySelector('.lab-track').setAttribute('stroke-width', state.thick);
    const cap = state.caps ? 'round' : 'butt';
    byId('lab-arc').setAttribute('stroke-linecap', cap);
    document.querySelectorAll('.lab-arc--sync').forEach((a) => a.setAttribute('stroke-linecap', cap));

    svgs.forEach((svg) => svg.classList.toggle('lab-spinner--reverse', state.reverse));
    mHead.classList.toggle('hidden', !state.points);
    mTail.classList.toggle('hidden', !state.points);

    let lo = 999, hi = -999;
    for (let i = 0; i < 200; i++) {
      const p = i / 200;
      const a = theta(p + state.phi, state.s) - theta(p, state.s);
      lo = Math.min(lo, a); hi = Math.max(hi, a);
    }
    const ratio = (1 + state.s) / (1 - state.s || 1e-6);
    byId('lab-arc-badge').textContent = 'arc ' + Math.round(lo) + '°–' + Math.round(hi) + '°';
    byId('lab-ratio-badge').textContent = ratio.toFixed(1) + '× top to bottom';
    byId('lab-readout').textContent =
      'cycle       ' + state.duration + ' ms\n' +
      'gap/delay   ' + Math.round(state.phi * 100) + '%  (φ = ' + state.phi.toFixed(2) + ')\n' +
      'exaggerate  ' + state.s.toFixed(2) + '  (ratio ' + ratio.toFixed(1) + '×)\n' +
      'arc length  ' + Math.round(lo) + '° – ' + Math.round(hi) + '°\n' +
      'thickness   ' + state.thick + '\n' +
      'rail        ' + state.rail.toFixed(2);
  }

  const R = 42;
  const pointAt = (deg) => {
    const rad = (deg - 90) * Math.PI / 180;
    return [50 + R * Math.cos(rad), 50 + R * Math.sin(rad)];
  };

  const startTime = performance.now();
  function frame(now) {
    const p = (now - startTime) / state.duration;
    const trail = theta(p, state.s);
    const head = theta(p + state.phi, state.s);
    const len = Math.max(2, Math.min(358, head - trail));
    const trailMod = ((trail % 360) + 360) % 360;
    const dash = len + ' ' + (360 - len);
    const rot = 'rotate(' + (trailMod - 90) + 'deg)';
    arcs.forEach((a) => {
      a.setAttribute('stroke-dasharray', dash);
      a.style.transformOrigin = '50% 50%';
      a.style.transform = rot;
    });
    if (state.points) {
      const [hx, hy] = pointAt(trailMod + len);
      const [tx, ty] = pointAt(trailMod);
      mHead.setAttribute('cx', hx); mHead.setAttribute('cy', hy);
      mTail.setAttribute('cx', tx); mTail.setAttribute('cy', ty);
    }
    requestAnimationFrame(frame);
  }

  keys.forEach((k) => byId('lab-' + k).addEventListener('input', read));
  [caps, reverse, points].forEach((el) => el.addEventListener('change', read));

  byId('lab-copy').addEventListener('click', () => {
    const btn = byId('lab-copy');
    navigator.clipboard.writeText(byId('lab-readout').textContent);
    const prev = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = prev; }, 1200);
  });
  byId('lab-reset').addEventListener('click', () => {
    keys.forEach((k) => { byId('lab-' + k).value = defaults[k]; });
    caps.checked = defaults.caps;
    reverse.checked = defaults.reverse;
    points.checked = defaults.points;
    read();
  });

  read();
  requestAnimationFrame(frame);
})();
