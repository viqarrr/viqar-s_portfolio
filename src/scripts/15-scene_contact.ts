// @ts-nocheck
queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const contact = document.getElementById('contact');
    const voice = contact.querySelector('.contact__voice');
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'contact', trigger: contact, start: 'top bottom', end: 'top 15%', scrub: true } })
      .fromTo(voice, { fontWeight: 400, scale: 0.82, transformOrigin: '0% 100%' }, { fontWeight: 800, scale: 1, duration: 1 }, 0)
      .fromTo(contact.querySelector('.contact__title .m-dot'), { scale: 0, yPercent: -400 }, { scale: 1, yPercent: 0, duration: 0.25, ease: 'power2.in' }, 0.75);
  });
}, { id: 'scene:contact' });
