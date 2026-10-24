// @ts-nocheck
(() => {
  const hero = document.getElementById('hero');
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => hero.classList.toggle('is-offscreen', !entry.isIntersecting)).observe(hero);
})();
