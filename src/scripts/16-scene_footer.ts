// @ts-nocheck
queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const footer = document.getElementById('footer');
    const plates = footer.querySelectorAll('[data-8b-motion~="register"]');
    plates.forEach((element, index) => {
      const registerEnd = () => {
        const top = element.getBoundingClientRect().top + window.scrollY;
        return Math.min(top - innerHeight * 0.55, ScrollTrigger.maxScroll(window) - 1);
      };
      ScrollTrigger.create({
        id: `effect:register:footer:${index}`,
        trigger: element,
        start: 'top 95%',
        end: () => registerEnd(),
        scrub: 0.5,
        animation: gsap.fromTo(element,
          { '--register-x': '0.11em', '--register-y': '0.06em', '--register-a': 1 },
          { '--register-x': '0em', '--register-y': '0em', '--register-a': 0, ease: 'power2.out' }
        )
      });
    });
  });
}, { id: 'scene:footer' });
