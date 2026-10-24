// @ts-nocheck
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
function refreshScroll() {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
window.refreshScroll = refreshScroll;
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const nav = document.getElementById('navigation');
  const lenis = window.lenis = new Lenis({ lerp: 0.09, anchors: { offset: -(nav ? nav.offsetHeight : 0) } });
  const tick = time => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); lenis.destroy(); window.lenis = null; };
});
