// @ts-nocheck
(() => {
  const mainEl = document.getElementById('main');
  const detailEl = document.getElementById('project-detail');
  const navEl = document.getElementById('navigation');
  const backBtn = document.getElementById('pdetail-back');
  const darkLayer = document.querySelector('.page-curtain__layer--dark');
  const accentLayer = document.querySelector('.page-curtain__layer--accent');

  if (!detailEl || !mainEl) return;

  let projectsData: any[] = [];
  const scriptTag = document.getElementById('projects-data');
  if (scriptTag?.textContent) {
    try {
      projectsData = JSON.parse(scriptTag.textContent);
    } catch (e) {
      console.error('Failed to parse projects data', e);
    }
  }

  let savedScrollY = 0;
  let isAnimating = false;

  const populateProject = (project: any) => {
    const img = document.getElementById('pdetail-img');
    const hero = document.getElementById('pdetail-hero');
    const nameEl = document.getElementById('pdetail-name');
    const tagEl = document.getElementById('pdetail-tag');
    const descEl = document.getElementById('pdetail-desc');

    if (hero && project.image_bg) {
      hero.style.background = project.image_bg;
    }
    if (img) {
      img.src = project.image_src || '';
      img.srcset = project.image_srcset || '';
      img.sizes = project.image_sizes || '(max-width: 900px) 94vw, 78rem';
      img.alt = project.image_alt || project.name || '';
      if (project.image_width) img.width = project.image_width;
      if (project.image_height) img.height = project.image_height;
    }
    if (nameEl) nameEl.textContent = project.name || '';
    if (tagEl) tagEl.textContent = project.tag || '';
    if (descEl) descEl.textContent = project.line || '';
  };

  const openProject = (slug: string, pushState = true) => {
    const project = projectsData.find(p => p.slug === slug);
    if (!project || isAnimating) return;
    isAnimating = true;

    savedScrollY = window.scrollY;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap;

    if (pushState) {
      history.pushState({ projectSlug: slug }, '', `/work/${slug}`);
    }

    if (reduce) {
      populateProject(project);
      mainEl.hidden = true;
      detailEl.hidden = false;
      navEl?.classList.add('is-scrolled');
      window.lenis?.stop();
      window.scrollTo(0, 0);
      isAnimating = false;
      return;
    }

    const animBlocks = detailEl.querySelectorAll('[data-pdetail-anim]');
    const heroBox = document.getElementById('pdetail-hero');
    const heroImg = document.getElementById('pdetail-img');

    window.gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        window.ScrollTrigger?.refresh();
      }
    })
      // 1. Sweep layers up from the bottom (transformOrigin: 'bottom')
      .set([darkLayer, accentLayer], { transformOrigin: 'bottom' })
      .fromTo(darkLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0)
      .fromTo(accentLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0.08)
      // 2. Swap content and reset scroll position to top (pausing Lenis)
      .add(() => {
        populateProject(project);
        mainEl.hidden = true;
        detailEl.hidden = false;
        navEl?.classList.add('is-scrolled');
        window.lenis?.stop();
        window.scrollTo(0, 0);
      })
      // 3. Sweep layers away to the top (transformOrigin: 'top')
      .set([darkLayer, accentLayer], { transformOrigin: 'top' })
      .to(accentLayer, { scaleY: 0, duration: 0.52, ease: 'expo.inOut' })
      .to(darkLayer, { scaleY: 0, duration: 0.52, ease: 'expo.inOut' }, '-=0.44')
      // 4. Reveal hero image (clipPath expand) and animate text elements (translateY + opacity)
      .fromTo(heroBox, { clipPath: 'inset(12% 4% 12% 4% round 28px)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1, duration: 0.85, ease: 'expo.out', clearProps: 'clipPath' }, '-=0.35')
      .fromTo(heroImg, { scale: 1.15 }, { scale: 1, duration: 1.1, ease: 'expo.out' }, '<')
      .fromTo(animBlocks, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, ease: 'power3.out', clearProps: 'all' }, '-=0.7');
  };

  const closeProject = (pushState = true) => {
    if (detailEl.hidden || isAnimating) return;
    isAnimating = true;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap;

    if (pushState) {
      history.pushState(null, '', '/');
    }

    if (reduce) {
      detailEl.hidden = true;
      mainEl.hidden = false;
      window.lenis?.start();
      window.ScrollTrigger?.refresh();
      const workEl = document.getElementById('work');
      if (savedScrollY > 0) {
        window.scrollTo(0, savedScrollY);
      } else if (workEl) {
        workEl.scrollIntoView();
      }
      isAnimating = false;
      return;
    }

    window.gsap.timeline({
      onComplete: () => {
        isAnimating = false;
      }
    })
      // 1. Sweep layers up from the bottom (accent and dark)
      .set([accentLayer, darkLayer], { transformOrigin: 'bottom' })
      .fromTo(accentLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0)
      .fromTo(darkLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0.07)
      // 2. Restore main page view and restore previous scroll position at #work
      .add(() => {
        detailEl.hidden = true;
        mainEl.hidden = false;
        window.lenis?.start();
        window.ScrollTrigger?.refresh();
        const workEl = document.getElementById('work');
        if (savedScrollY > 0) {
          window.lenis ? window.lenis.scrollTo(savedScrollY, { immediate: true }) : window.scrollTo(0, savedScrollY);
        } else if (workEl) {
          window.lenis ? window.lenis.scrollTo(workEl, { immediate: true }) : workEl.scrollIntoView();
        }
      })
      // 3. Sweep layers away to the top and resume Lenis / refresh ScrollTrigger
      .set([darkLayer, accentLayer], { transformOrigin: 'top' })
      .to(darkLayer, { scaleY: 0, duration: 0.5, ease: 'expo.inOut' })
      .to(accentLayer, { scaleY: 0, duration: 0.55, ease: 'expo.inOut' }, '-=0.42');
  };

  // Event Listeners for each Card in #work
  document.querySelectorAll('#work .case[data-project-slug]').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-project-slug');
      if (slug) openProject(slug, true);
    });
    card.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const slug = card.getAttribute('data-project-slug');
        if (slug) openProject(slug, true);
      }
    });
  });

  // Event Listener for Back to projects button
  backBtn?.addEventListener('click', () => closeProject(true));

  // If user clicks anchor nav while in detail view (e.g. #contact, #work), close detail first then scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (!detailEl.hidden && targetId && !targetId.startsWith('#project/')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          closeProject(true);
          setTimeout(() => {
            window.lenis ? window.lenis.scrollTo(targetEl) : targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 520);
        }
      }
    });
  });

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    const workMatch = path.match(/^\/work\/([a-zA-Z0-9_-]+)/);
    const targetSlug = workMatch ? workMatch[1] : (hash.startsWith('#project/') ? hash.replace('#project/', '') : null);

    if (targetSlug) {
      openProject(targetSlug, false);
    } else if (!detailEl.hidden) {
      closeProject(false);
    }
  });

  // Handle initial page load if URL has /work/:slug or #project/:slug
  const initialPath = window.location.pathname;
  const initialHash = window.location.hash;
  const initialWorkMatch = initialPath.match(/^\/work\/([a-zA-Z0-9_-]+)/);
  const initialSlug = initialWorkMatch ? initialWorkMatch[1] : (initialHash.startsWith('#project/') ? initialHash.replace('#project/', '') : null);

  if (initialSlug && detailEl.hidden) {
    if (document.readyState === 'complete') {
      openProject(initialSlug, false);
    } else {
      window.addEventListener('load', () => openProject(initialSlug, false), { once: true });
    }
  }
})();
