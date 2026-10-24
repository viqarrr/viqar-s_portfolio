// @ts-nocheck
queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const section = document.getElementById('capabilities');
    const cards = [...section.querySelectorAll('.service')];
    section.classList.add('is-deck');
    cards.forEach((card, index) => card.style.setProperty('--i', index));
    cards.forEach((card, index) => {
      const next = cards[index + 1];
      if (!next) return;
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: `capabilities:${index}`, trigger: next, start: 'top bottom', end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`, scrub: true, invalidateOnRefresh: true } })
        .to(card, { scale: 0.9 }, 0)
        .to(card.querySelector('.service__shade'), { opacity: 0.55 }, 0);
    });
    return () => { section.classList.remove('is-deck'); cards.forEach(card => card.style.removeProperty('--i')); };
  });
}, { id: 'scene:capabilities' });
