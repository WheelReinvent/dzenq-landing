// Gentle reveal on scroll. Without JS everything is simply visible.
document.documentElement.classList.add('js');
addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  els.forEach(e => io.observe(e));
});

// Moon button: light by default, dark only when chosen; remembered per browser.
addEventListener('DOMContentLoaded', () => {
  const b = document.querySelector('.theme');
  if (!b) return;
  b.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    if (dark) document.documentElement.dataset.theme = 'dark'; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });
});

// The computer button: the installer for this computer's system (none on phones).
addEventListener('DOMContentLoaded', () => {
  const b = document.querySelector('.btn.desktop');
  if (!b) return;
  const ua = navigator.userAgent, base = b.href.replace(/[^/]*$/, '');
  if (/Android|iPhone|iPad/i.test(ua)) return;
  if (/Windows/i.test(ua)) { b.href = base + 'DzenQ-Windows.msi'; b.textContent = 'Windows'; }
  else if (/Mac/i.test(ua)) { b.href = base + 'DzenQ-macOS.dmg'; b.textContent = 'Mac'; }
  else if (/Linux/i.test(ua)) { b.href = base + 'DzenQ-Linux.deb'; b.textContent = 'Linux'; }
  else return;
  b.hidden = false;
});
