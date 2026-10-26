// @ts-nocheck
const effects = {
  rise(element, vars = {}) {
    const dot = element.querySelector('.m-dot');
    const timeline = gsap.timeline(vars);
    timeline.fromTo(element, { yPercent: 38, clipPath: 'inset(0% -6% 100% -6%)' }, { yPercent: 0, clipPath: 'inset(-30% -6% -30% -6%)', duration: 0.95, ease: 'expo.out', clearProps: 'clipPath,transform' }, 0);
    if (dot) timeline.fromTo(dot, { scale: 0, yPercent: -260 }, { scale: 1, yPercent: 0, duration: 0.75, ease: 'back.out(2.2)', clearProps: 'transform' }, 0.42);
    return timeline;
  },
  ink(element, vars = {}) {
    const words = element.querySelectorAll('.ink__word');
    return gsap.timeline(vars).fromTo(words, { opacity: 0.16 }, { opacity: 1, duration: 0.3, stagger: 0.06, ease: 'none' });
  },
  iris(element, vars = {}) {
    const image = element.querySelector('img');
    const timeline = gsap.timeline(vars);
    timeline.fromTo(element, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.15, ease: 'expo.inOut', clearProps: 'clipPath' }, 0);
    if (image) timeline.fromTo(image, { scale: 1.2 }, { scale: 1, duration: 1.5, ease: 'expo.out', clearProps: 'transform' }, 0.15);
    return timeline;
  }
};
function layoutBox(element) {
  const rect = element.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  const gx = (window as any).gsap ? ((window as any).gsap.getProperty(element, 'x') || 0) : 0;
  const gy = (window as any).gsap ? ((window as any).gsap.getProperty(element, 'y') || 0) : 0;
  const x = rect.left + scrollX - Number(gx);
  const y = rect.top + scrollY - Number(gy);
  return { x, y, w: rect.width, h: rect.height, cx: x + rect.width / 2, cy: y + rect.height / 2 };
}
(window as any).layoutBox = layoutBox;
function splitWords(element) {
  const original = element.innerHTML;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { fragment.append(part); return; }
      const word = document.createElement('span');
      word.className = 'ink__word';
      word.textContent = part;
      fragment.append(word);
    });
    node.replaceWith(fragment);
  });
  return () => { element.innerHTML = original; };
}
document.querySelectorAll('[data-8b-section]').forEach(section => {
  const bound = name => [...section.querySelectorAll(`[data-8b-motion~="${name}"]`)];
  const rise = bound('rise'), ink = bound('ink'), iris = bound('iris');
  if (!rise.length && !ink.length && !iris.length) return;
  const first = section.getBoundingClientRect().top < innerHeight;
  if (rise.length) queueMotion(() => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    rise.forEach((element, index) => ScrollTrigger.create({ id: `effect:rise:${section.id}:${index}`, trigger: element, start: 'top 88%', once: true, animation: effects.rise(element, { paused: true }) }));
  }), { first, id: `effect:rise:${section.id}` });
  if (ink.length) queueMotion(() => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const reverts = ink.map(splitWords);
    ink.forEach((element, index) => ScrollTrigger.create({ id: `effect:ink:${section.id}:${index}`, trigger: element, start: 'top 88%', end: 'bottom 68%', scrub: 0.4, animation: effects.ink(element) }));
    return () => reverts.forEach(revert => revert());
  }), { first, id: `effect:ink:${section.id}` });
  if (iris.length) queueMotion(() => gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    iris.forEach((element, index) => ScrollTrigger.create({ id: `effect:iris:${section.id}:${index}`, trigger: element, start: 'top 86%', once: true, animation: effects.iris(element, { paused: true }) }));
  }), { first, id: `effect:iris:${section.id}` });
});
