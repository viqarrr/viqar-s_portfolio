// @ts-nocheck
(() => {
  'use strict';
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const parsed = document.readyState === 'loading' ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true })) : Promise.resolve();
  const ready = () => Promise.all([fonts, parsed]).then(() => firsts);
  const nextTask = () => window.scheduler?.yield?.() ?? new Promise(resolve => setTimeout(resolve));
  const refresh = () => {
    if (typeof window.refreshScroll === 'function') return window.refreshScroll();
    window.ScrollTrigger?.sort(); window.ScrollTrigger?.refresh();
  };
  const run = (setup, name) => {
    for (const trigger of window.ScrollTrigger?.getAll() || []) if (!trigger.end && window.ScrollTrigger.getAll().includes(trigger)) trigger.refresh(0, 1);
    const context = window.gsap.context(() => {});
    const log = new MutationObserver(() => {});
    log.observe(document.documentElement, { attributes: true, attributeOldValue: true, subtree: true });
    let failure = null, records;
    try { context.add(() => { try { setup(); } catch (error) { failure = error; } }); }
    finally { records = log.takeRecords(); log.disconnect(); }
    if (!failure) return true;
    try { context.revert(); } catch (error) { console.error(name, 'revert failed', error); }
    for (const { target, attributeName, oldValue } of records.reverse()) {
      const now = target.getAttribute(attributeName);
      if (oldValue == null) { if (now != null) target.removeAttribute(attributeName); }
      else if (now !== oldValue) target.setAttribute(attributeName, oldValue);
    }
    console.error(name, failure);
    return false;
  };
  let firsts = Promise.resolve(), tail = null, pending = 0, lazy = null, building = 0;
  window.queueMotion = (setup, { first = false, near, id } = {}) => {
    if (!window.gsap || typeof setup !== 'function') return;
    const name = id || document.currentScript?.getAttribute('data-8b-part') || 'motion';
    if (near instanceof Element && window.IntersectionObserver) {
      const watch = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        watch.disconnect();
        building++;
        lazy = (lazy || ready()).then(nextTask).then(() => run(setup, name)).finally(() => { if (!--building) refresh(); });
      }, { rootMargin: '100% 0px' });
      watch.observe(near);
      return;
    }
    if (first) firsts = firsts.then(() => fonts).then(() => { if (!run(setup, name)) refresh(); });
    else {
      pending++;
      tail = (tail || ready()).then(nextTask).then(() => run(setup, name))
        .finally(() => { if (!--pending) refresh(); });
    }
    window.motionReady = Promise.all([firsts, tail]);
  };
  window.adjacent = (a, b) => {
    const order = [...document.querySelectorAll('[data-8b-section]')].filter(section => section.getAttribute('data-8b-section') !== 'navigation').map(section => section.id);
    return order.indexOf(a) >= 0 && order[order.indexOf(a) + 1] === b;
  };
})();
