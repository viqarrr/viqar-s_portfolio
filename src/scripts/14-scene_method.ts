// @ts-nocheck
queueMotion(() => {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const section = document.getElementById('method');
    const lane = section.querySelector('.method__lane');
    const carriage = section.querySelector('.method__carriage');
    const rows = [...section.querySelectorAll('.step')];
    if (!lane || !carriage || !rows.length) throw new Error('method: lane parts missing');
    const setY = gsap.quickSetter(carriage, 'y', 'px');
    let geometry = null;
    const measure = () => {
      setY(0);
      const top = lane.getBoundingClientRect().top;
      const size = carriage.offsetHeight;
      geometry = {
        size, travel: Math.max(0, lane.offsetHeight - size),
        rows: rows.map(row => { const box = row.getBoundingClientRect(); return box.top - top + Math.min(44, box.height / 2); })
      };
    };
    const render = progress => {
      if (!geometry) return;
      setY(-geometry.travel * (1 - progress));
      const centre = geometry.size / 2 + geometry.travel * progress;
      rows.forEach((row, index) => row.toggleAttribute('data-waiting', centre < geometry.rows[index]));
    };
    const trigger = ScrollTrigger.create({
      id: 'method', trigger: lane, start: 'top 62%', end: 'bottom 62%',
      onUpdate: self => render(self.progress),
      onRefresh: self => { measure(); render(self.progress); }
    });
    return () => {
      trigger.kill();
      gsap.set(carriage, { clearProps: 'transform' });
      rows.forEach(row => row.removeAttribute('data-waiting'));
    };
  });
}, { id: 'scene:method' });
