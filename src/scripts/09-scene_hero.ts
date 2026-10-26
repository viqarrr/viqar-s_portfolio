// @ts-nocheck
queueMotion(() => {
  const hero = document.getElementById('hero');
  const nav = document.getElementById('navigation');
  const brandWord = nav.querySelector('.nav__brand');
  const word = hero.querySelector('.hero__word');
  const stage = hero.querySelector('.hero__stage');

  let wordDot = word.querySelector('.hero__word-dot');
  if (!wordDot) {
    wordDot = document.createElement('span');
    wordDot.className = 'm-dot hero__word-dot';
    wordDot.setAttribute('aria-hidden', 'true');
    word.append(wordDot);
  }

  const updateStagePosition = () => {
    if (!hero || !stage) return;
    if (window.matchMedia('(min-width: 900px) and (orientation: landscape)').matches) {
      stage.style.top = '';
      return;
    }
    const intro = hero.querySelector('.hero__intro');
    const title = hero.querySelector('.hero__title');
    const link = intro?.querySelector('.hero__link');
    if (!intro || !title) return;

    const heroRect = hero.getBoundingClientRect();
    const linkRect = (link || intro).getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();

    const introBottom = linkRect.bottom - heroRect.top;
    const titleTop = titleRect.top - heroRect.top;
    const center = introBottom + (titleTop - introBottom) / 2;
    const ap = stage.offsetHeight || stage.offsetWidth;
    stage.style.top = `${Math.round(center - ap / 2)}px`;
  };

  updateStagePosition();
  window.addEventListener('resize', updateStagePosition, { passive: true });

  gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > hero.offsetHeight * 0.35);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  });

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    if (!adjacent('hero', 'statement')) return;
    const target = document.getElementById('statement').querySelector('.statement__dot');
    const aperture = hero.querySelector('.hero__aperture');

    ScrollTrigger.addEventListener('refreshInit', updateStagePosition);

    const geometry = () => {
      const from = layoutBox(aperture), to = layoutBox(target);
      return { x: to.cx - from.cx, y: to.cy - from.cy, scale: to.w / from.w };
    };

    const wordGeometry = () => {
      const from = layoutBox(word);
      const to = layoutBox(nav.querySelector('.nav__brand-word'));
      const endScroll = layoutBox(hero).y + hero.offsetHeight - innerHeight * 0.3;
      return {
        x: to.x - from.x,
        y: to.y - from.y + endScroll,
        scale: to.w / Math.max(1, from.w)
      };
    };

    const syncBrand = docked => {
      nav.classList.toggle('is-scrolled', docked);
      gsap.set(word, { autoAlpha: docked ? 0 : 1 });
    };

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        id: 'hero:exit',
        trigger: hero,
        start: 'bottom bottom',
        end: 'bottom 30%',
        scrub: true,
        invalidateOnRefresh: true,
        onLeave: () => syncBrand(true),
        onEnterBack: () => syncBrand(false),
        onRefresh: self => syncBrand(self.progress >= 1)
      }
    })
      .to(aperture, { x: () => geometry().x, y: () => geometry().y, ease: 'power1.inOut', duration: 1 }, 0)
      .to(aperture, { scale: () => geometry().scale, ease: 'power3.in', duration: 1 }, 0)
      .to(hero.querySelector('.hero__tint'), { opacity: 1, ease: 'power2.in', duration: 0.6 }, 0.4)
      .to(hero.querySelector('.hero__orbit'), { opacity: 0, duration: 0.3 }, 0)
      // Menerbangkan kata Viqar bersama titik kuningnya (.hero__word-dot) langsung ke logo navbar atas
      .to(word, {
        x: () => wordGeometry().x,
        y: () => wordGeometry().y,
        scale: () => wordGeometry().scale,
        ease: 'none',
        duration: 1
      }, 0)
      .to(hero.querySelector('.hero__intro'), { y: -70, ease: 'power1.in', duration: 1 }, 0);

    return () => {
      nav.classList.remove('is-scrolled');
      gsap.set([word, wordDot], { clearProps: 'all' });
      ScrollTrigger.removeEventListener('refreshInit', updateStagePosition);
    };
  });
}, { first: true, id: 'scene:hero' });
