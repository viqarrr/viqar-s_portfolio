// @ts-nocheck
(() => {
  const nav = document.getElementById('navigation');
  const toggle = nav.querySelector('.nav__toggle');
  const toggleDot = toggle.querySelector('.m-icon-btn__dot');
  const menu = nav.querySelector('.menu');
  const close = menu.querySelector('.menu__close');
  const closeDot = close.querySelector('.m-icon-btn__dot');
  const menuBrand = menu.querySelector('.menu__brand');
  const links = [...menu.querySelectorAll('.menu__list a')];
  const foot = menu.querySelector('.menu__foot');
  let tween = null;

  const origin = () => {
    const box = toggle.getBoundingClientRect();
    return `${Math.round(box.left + box.width / 2)}px ${Math.round(box.top + box.height / 2)}px`;
  };

  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    tween?.kill();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap;
    const at = origin();

    if (open) {
      menu.hidden = false;
      window.lenis?.stop();
      if (reduce) { close.focus(); return; }
      tween = gsap.timeline({ onComplete: () => close.focus() })
        .fromTo(toggle, { rotation: 0, scale: 1 }, { rotation: 90, scale: 0.85, duration: 0.35, ease: 'power2.inOut' }, 0)
        .fromTo(menu, { clipPath: `circle(0px at ${at})` }, { clipPath: `circle(150vmax at ${at})`, duration: 0.65, ease: 'expo.inOut' }, 0)
        .fromTo(close, { rotation: -90, scale: 0.5, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)', clearProps: 'transform,opacity' }, 0.2)
        .fromTo(closeDot, { y: 0 }, { y: 16, duration: 0.4, ease: 'back.out(2)', clearProps: 'transform' }, 0.22)
        .fromTo(menuBrand, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.22)
        .fromTo(links, { yPercent: 105 }, { yPercent: 0, duration: 0.6, stagger: 0.055, ease: 'expo.out' }, 0.18)
        .fromTo(foot, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.35);
    } else {
      window.lenis?.start();
      if (reduce) { menu.hidden = true; toggle.focus(); return; }
      tween = gsap.timeline({
        onComplete: () => {
          menu.hidden = true;
          gsap.set([menu, close, closeDot], { clearProps: 'all' });
          toggle.focus();
        }
      })
        .to(closeDot, { y: 0, duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(close, { rotation: -90, scale: 0.6, opacity: 0, duration: 0.35, ease: 'back.in(2)' }, 0)
        .to(menuBrand, { y: -12, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
        .to(links, { yPercent: 105, duration: 0.35, stagger: -0.035, ease: 'power3.in' }, 0)
        .to(foot, { y: 12, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
        .fromTo(menu, { clipPath: `circle(150vmax at ${at})` }, { clipPath: `circle(0px at ${at})`, duration: 0.58, ease: 'expo.inOut' }, 0.08)
        .fromTo(toggle, { rotation: 90, scale: 0.8 }, { rotation: 0, scale: 1, duration: 0.45, ease: 'back.out(2)', clearProps: 'transform' }, 0.32)
        .fromTo(toggleDot, { y: 16 }, { y: 0, duration: 0.4, ease: 'back.out(2)', clearProps: 'transform' }, 0.32);
    }
  };

  toggle.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
    if (event.key !== 'Tab') return;
    const items = [...menu.querySelectorAll('a, button')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
})();
