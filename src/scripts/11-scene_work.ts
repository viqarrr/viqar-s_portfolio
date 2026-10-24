// @ts-nocheck
queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const work = document.getElementById('work');
    const track = work.querySelector('.work__track');
    const frame = work.querySelector('.work__window');
    work.classList.add('is-track');
    const stage = work.querySelector('.work__stage');
    const run = () => Math.max(0, track.offsetWidth - (work.clientWidth - 2 * parseFloat(getComputedStyle(stage).paddingLeft)));
    const setRun = () => work.style.setProperty('--run', `${Math.round(run())}px`);
    setRun();
    ScrollTrigger.addEventListener('refreshInit', setRun);
    gsap.fromTo(work.querySelector('.work__plate'), { clipPath: 'inset(0% 3.2% 0% 3.2% round 44px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.out', scrollTrigger: { id: 'work:plate', trigger: work, start: 'top bottom', end: 'top 15%', scrub: true } });
    const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'work', trigger: work, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });
    timeline.to(track, { x: () => -run() }, 0);
    work.querySelectorAll('.case__img').forEach(image => timeline.fromTo(image, { xPercent: -5 }, { xPercent: 5 }, 0));
    if (adjacent('work', 'again')) {
      const cases = [...track.querySelectorAll('.case')];
      const radius = () => (innerWidth < 700 ? innerWidth * 2.1 : innerWidth * 0.95);
      const bend = card => {
        const offset = layoutBox(frame).x + card.offsetLeft + card.offsetWidth / 2 - run() - innerWidth / 2;
        const angle = offset / radius();
        return { x: radius() * Math.sin(angle) - offset, y: radius() * (1 - Math.cos(angle)), rotation: angle * 180 / Math.PI };
      };
      const exit = gsap.timeline({ defaults: { ease: 'power1.in' }, scrollTrigger: { id: 'work:exit', trigger: work, start: 'bottom bottom', end: 'bottom 30%', scrub: true, invalidateOnRefresh: true } });
      exit.to(frame, { x: () => -innerWidth * 0.2, duration: 1 }, 0);
      cases.forEach(card => exit.to(card, { x: () => bend(card).x, y: () => bend(card).y, rotation: () => bend(card).rotation, duration: 1 }, 0));
    }
    return () => { work.classList.remove('is-track'); work.style.removeProperty('--run'); ScrollTrigger.removeEventListener('refreshInit', setRun); };
  });
}, { id: 'scene:work' });
