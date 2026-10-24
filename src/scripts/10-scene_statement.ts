// @ts-nocheck
queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const statement = document.getElementById('statement');
    const lines = statement.querySelectorAll('.statement__line');
    if (adjacent('hero', 'statement')) {
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'statement:entry', trigger: statement, start: 'top bottom', end: 'top 30%', scrub: true } })
        .fromTo(lines, { yPercent: 85, xPercent: index => (index ? 9 : -6) }, { yPercent: 0, xPercent: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, 0)
        .fromTo(statement.querySelector('.statement__dot'), { scale: 0 }, { scale: 1, duration: 0.1 }, 0.9);
    }
    const items = statement.querySelectorAll('.statement__index li');
    gsap.from(items, { yPercent: 70, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', scrollTrigger: { id: 'statement:index', trigger: statement.querySelector('.statement__index'), start: 'top 85%', once: true } });
  });
}, { id: 'scene:statement' });
