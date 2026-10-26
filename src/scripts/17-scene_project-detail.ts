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
    if (descEl) descEl.innerHTML = project.line || '';
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
      mainEl.setAttribute('hidden', '');
      detailEl.hidden = false;
      detailEl.removeAttribute('hidden');
      navEl?.classList.add('is-scrolled');

      window.scrollTo(0, 0);
      window.lenis?.scrollTo(0, { immediate: true });
      window.lenis?.start();
      window.lenis?.resize();
      window.ScrollTrigger?.refresh();

      isAnimating = false;
      return;
    }

    const animBlocks = detailEl.querySelectorAll('[data-pdetail-anim]');
    const heroBox = document.getElementById('pdetail-hero');
    const heroImg = document.getElementById('pdetail-img');

    // Pause smooth scroll during sweep
    window.lenis?.stop();

    window.gsap.timeline({
      onComplete: () => {
        // Resume Lenis, recalculate dimensions and update ScrollTrigger
        window.lenis?.start();
        window.lenis?.resize();
        window.ScrollTrigger?.refresh();
        isAnimating = false;
      }
    })
      // 1. Sweep layers up from bottom
      .set([darkLayer, accentLayer], { transformOrigin: 'bottom' })
      .fromTo(darkLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0)
      .fromTo(accentLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0.08)
      // 2. Unhide detail, hide main, reset scroll to top
      .add(() => {
        populateProject(project);
        mainEl.hidden = true;
        mainEl.setAttribute('hidden', '');
        detailEl.hidden = false;
        detailEl.removeAttribute('hidden');
        navEl?.classList.add('is-scrolled');

        window.scrollTo(0, 0);
        window.lenis?.scrollTo(0, { immediate: true });
        window.lenis?.resize();
        window.ScrollTrigger?.refresh();
      })
      // 3. Sweep layers away to top
      .set([darkLayer, accentLayer], { transformOrigin: 'top' })
      .to(accentLayer, { scaleY: 0, duration: 0.52, ease: 'expo.inOut' })
      .to(darkLayer, { scaleY: 0, duration: 0.52, ease: 'expo.inOut' }, '-=0.44')
      // 4. Reveal hero image & anim blocks
      .fromTo(heroBox, { clipPath: 'inset(12% 4% 12% 4% round 28px)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1, duration: 0.85, ease: 'expo.out', clearProps: 'clipPath' }, '-=0.35')
      .fromTo(heroImg, { scale: 1.15 }, { scale: 1, duration: 1.1, ease: 'expo.out' }, '<')
      .fromTo(animBlocks, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, ease: 'power3.out', clearProps: 'all' }, '-=0.7');
  };

  const closeProject = (pushState = true, targetAnchor: string | null = null) => {
    if (detailEl.hidden || isAnimating) return;
    isAnimating = true;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap;

    if (pushState) {
      if (targetAnchor) {
        history.pushState(null, '', `/${targetAnchor}`);
      } else {
        history.pushState(null, '', '/');
      }
    }

    const restoreMain = () => {
      detailEl.hidden = true;
      detailEl.setAttribute('hidden', '');
      mainEl.hidden = false;
      mainEl.removeAttribute('hidden');

      window.lenis?.resize();
      window.ScrollTrigger?.refresh();

      if (targetAnchor) {
        const targetEl = document.querySelector(targetAnchor);
        if (targetEl) {
          const navOffset = navEl ? navEl.offsetHeight : 0;
          if (window.lenis) {
            window.lenis.scrollTo(targetEl, { offset: -navOffset, immediate: true });
          } else {
            targetEl.scrollIntoView();
          }
          return;
        }
      }

      const workEl = document.getElementById('work');
      if (savedScrollY > 0) {
        window.lenis ? window.lenis.scrollTo(savedScrollY, { immediate: true }) : window.scrollTo(0, savedScrollY);
      } else if (workEl) {
        window.lenis ? window.lenis.scrollTo(workEl, { immediate: true }) : workEl.scrollIntoView();
      }
    };

    if (reduce) {
      restoreMain();
      window.lenis?.start();
      window.lenis?.resize();
      window.ScrollTrigger?.refresh();
      isAnimating = false;
      return;
    }

    window.lenis?.stop();

    window.gsap.timeline({
      onComplete: () => {
        window.lenis?.start();
        window.lenis?.resize();
        window.ScrollTrigger?.refresh();
        isAnimating = false;
      }
    })
      // 1. Sweep layers up from bottom
      .set([accentLayer, darkLayer], { transformOrigin: 'bottom' })
      .fromTo(accentLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0)
      .fromTo(darkLayer, { scaleY: 0 }, { scaleY: 1, duration: 0.48, ease: 'expo.inOut' }, 0.07)
      // 2. Restore main page view and restore scroll position
      .add(() => {
        restoreMain();
      })
      // 3. Sweep layers away to top
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

  // Seamless cross-view anchor navigation from detail view
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      let targetId = anchor.getAttribute('href');
      if (!targetId) return;
      if (targetId.startsWith('/#')) {
        targetId = targetId.slice(1);
      }

      if (!detailEl.hidden && targetId.startsWith('#') && !targetId.startsWith('#project/')) {
        e.preventDefault();

        // Close mobile drawer if open
        const closeBtn = document.querySelector('#navigation .menu__close');
        const menuEl = document.getElementById('menu');
        if (menuEl && !menuEl.hidden && closeBtn) {
          closeBtn.click();
        }

        // Close project detail view and scroll to target section
        closeProject(true, targetId);
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

  // Ensure scroll is ready if direct load on /work/:slug
  if (!detailEl.hidden) {
    window.lenis?.start();
    window.lenis?.resize();
    window.ScrollTrigger?.refresh();
  }

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
