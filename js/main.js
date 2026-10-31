// menú móvil
const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');
if (burger) burger.addEventListener('click', () => nav.classList.toggle('open'));

// revelado al hacer scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// contadores
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const step = t => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  co.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

// formulario de prototipo: abre WhatsApp con el mensaje escrito
const form = document.querySelector('#contact-form');
if (form) form.addEventListener('submit', ev => {
  ev.preventDefault();
  const d = new FormData(form);
  const msg = `Hola Carlos, soy ${d.get('nombre')}. Me interesa: ${d.get('interes')}. ${d.get('mensaje') || ''}`;
  window.open('https://wa.me/34629734646?text=' + encodeURIComponent(msg), '_blank');
});

// jugada de fútbol dibujada con el scroll
(() => {
  const sec = document.querySelector('.play'); if (!sec) return;
  const stick = sec.querySelector('.stick');
  const segs = [...sec.querySelectorAll('.seg')], pls = [...sec.querySelectorAll('.pl')];
  const ball = sec.querySelector('.ball'), net = sec.querySelector('.net'), lis = [...sec.querySelectorAll('.steps li')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
  const draw = p => {
    const n = segs.length, k = Math.min(Math.floor(p * n), n - 1), local = ease(Math.min(Math.max(p * n - k, 0), 1));
    segs.forEach((s, i) => s.style.strokeDashoffset = i < k ? 0 : i === k ? 1 - local : 1);
    const s = segs[k], pt = s.getPointAtLength(local * s.getTotalLength());
    ball.setAttribute('cx', pt.x); ball.setAttribute('cy', pt.y);
    pls.forEach((d, i) => d.classList.toggle('on', i <= k && (i < k || local > 0.02)));
    net.classList.toggle('on', p >= 0.97);
    lis.forEach((l, i) => l.classList.toggle('on', i === k));
  };
  if (reduce) {
    sec.classList.add('static');
    segs.forEach(s => s.style.strokeDashoffset = 0);
    lis.forEach(l => l.classList.add('on')); pls.forEach(d => d.classList.add('on')); net.classList.add('on');
    const e = segs[segs.length - 1], q = e.getPointAtLength(e.getTotalLength());
    ball.setAttribute('cx', q.x); ball.setAttribute('cy', q.y);
    return;
  }
  let tick = false;
  const upd = () => {
    tick = false;
    const r = sec.getBoundingClientRect(), total = r.height - stick.clientHeight;
    draw(Math.min(Math.max((72 - r.top) / total, 0), 1));
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener('resize', upd); upd();
})();
