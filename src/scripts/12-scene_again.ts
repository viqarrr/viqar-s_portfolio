// @ts-nocheck
queueMotion(() => {
  const again = document.getElementById('again');
  if (!again) return;
  const categoryEl = again.querySelector('.again__category');
  const wheel = again.querySelector('.again__wheel');
  const cards = [...wheel.querySelectorAll('.partner')];
  if (!cards.length) return;

  // Reduced motion: static grid with center-based active card detection
  gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
    let currentCat = cards[0]?.getAttribute('data-category') || 'Languages';
    if (categoryEl) categoryEl.textContent = currentCat;
    const syncReduced = () => {
      const centerY = innerHeight / 2;
      let minDiff = Infinity;
      let activeCat = currentCat;
      cards.forEach(card => {
        const cardBox = card.querySelector('.partner__card') || card;
        const rect = cardBox.getBoundingClientRect();
        const diff = Math.abs(rect.top + rect.height / 2 - centerY);
        if (diff < minDiff) {
          minDiff = diff;
          activeCat = card.getAttribute('data-category');
        }
      });
      if (activeCat && activeCat !== currentCat && categoryEl) {
        currentCat = activeCat;
        categoryEl.textContent = activeCat;
      }
    };
    window.addEventListener('scroll', syncReduced, { passive: true });
    syncReduced();
    return () => window.removeEventListener('scroll', syncReduced);
  });

  // Motion preference: rotating wheel with apex detection and smooth category transitions
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const stage = again.querySelector('.again__stage');
    const head = again.querySelector('.again__head');
    const swing = again.querySelector('.again__swing');
    again.classList.add('is-wheel');
    cards.forEach((card, index) => card.style.setProperty('--i', index));
    let step = 0, arcTop = 0, radius = 1;
    let currentCat = cards[0]?.getAttribute('data-category') || 'Languages';
    let isTransitioning = false;

    const setHeadingCategory = (newCat) => {
      if (!newCat || newCat === currentCat || !categoryEl || isTransitioning) return;
      currentCat = newCat;
      isTransitioning = true;
      gsap.to(categoryEl, {
        opacity: 0,
        y: -6,
        duration: 0.12,
        ease: 'power1.in',
        onComplete: () => {
          categoryEl.textContent = newCat;
          gsap.to(categoryEl, {
            opacity: 1,
            y: 0,
            duration: 0.16,
            ease: 'power2.out',
            onComplete: () => { isTransitioning = false; }
          });
        }
      });
    };

    const syncFromRotation = (rot) => {
      if (!step) return;
      // Index of card closest to top apex (rot + i * step = 0 => i = -rot / step)
      const targetIdx = Math.max(0, Math.min(cards.length - 1, Math.round(-rot / step)));
      const cat = cards[targetIdx]?.getAttribute('data-category');
      if (cat) setHeadingCategory(cat);
    };

    const measure = () => {
      const width = innerWidth, height = stage.offsetHeight;
      const headBottom = head.offsetTop + head.offsetHeight;
      const room = height - headBottom - innerHeight * 0.04;
      const card = Math.max(180, Math.min(width * (width < 700 ? 0.7 : 0.28), (room - 32) / 1.25));
      arcTop = headBottom + Math.max(28, (room - card * 1.25) * 0.4);
      radius = Math.max(width * 0.95, card * 3.3);
      step = 2 * Math.asin((card + Math.max(18, width * 0.024)) / (2 * radius)) * 180 / Math.PI;
      again.style.setProperty('--card', `${card.toFixed(1)}px`);
      again.style.setProperty('--radius', `${radius.toFixed(1)}px`);
      again.style.setProperty('--step', `${step.toFixed(3)}deg`);
      again.style.setProperty('--arc-top', `${arcTop.toFixed(1)}px`);
      again.style.setProperty('--spin', `${Math.round(cards.length * innerHeight * 0.42)}px`);
    };
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);

    gsap.fromTo(wheel,
      { rotation: () => step * 0.55 },
      {
        rotation: () => -(cards.length - 0.45) * step,
        ease: 'none',
        scrollTrigger: {
          id: 'again',
          trigger: again,
          start: 'top 30%',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const rot = gsap.getProperty(wheel, 'rotation');
            syncFromRotation(rot);
          }
        }
      }
    );

    if (adjacent('work', 'again')) {
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'again:entry', trigger: again, start: 'top bottom', end: 'top 30%', scrub: true, invalidateOnRefresh: true } })
        .fromTo(swing, { rotation: () => Math.max(4, Math.asin(Math.min(1, innerWidth * 0.3 / radius)) * 180 / Math.PI - step * 0.55) }, { rotation: 0, ease: 'power1.out' }, 0)
        .fromTo(swing, { y: () => -(arcTop - 40) }, { y: 0, ease: 'power2.in' }, 0)
        .fromTo(head, { yPercent: 45 }, { yPercent: 0, ease: 'power2.out' }, 0);
    }

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', measure);
      again.classList.remove('is-wheel');
      ['--card', '--radius', '--step', '--arc-top', '--spin'].forEach(name => again.style.removeProperty(name));
      cards.forEach(card => card.style.removeProperty('--i'));
    };
  });
}, { id: 'scene:again' });
