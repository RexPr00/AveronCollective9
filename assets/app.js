const body = document.body;

function lockScroll(on) { body.style.overflow = on ? 'hidden' : ''; }

function trapFocus(container, closeFn) {
  const focusables = container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return () => {};
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  first.focus();
  const handler = (e) => {
    if (e.key === 'Escape') closeFn();
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

const lang = document.querySelector('.lang');
if (lang) {
  const btn = lang.querySelector('.lang-pill');
  btn.addEventListener('click', () => lang.classList.toggle('open'));
  document.addEventListener('click', (e) => { if (!lang.contains(e.target)) lang.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lang.classList.remove('open'); });
}

const drawer = document.querySelector('.mobile-drawer');
const overlay = document.querySelector('.drawer-overlay');
const openBtn = document.querySelector('.burger');
const closeBtn = document.querySelector('.drawer-close');
let untrapDrawer = null;
const openDrawer = () => {
  drawer.classList.add('open'); overlay.classList.add('show'); lockScroll(true);
  untrapDrawer = trapFocus(drawer, closeDrawer);
};
function closeDrawer() {
  drawer.classList.remove('open'); overlay.classList.remove('show'); lockScroll(false);
  if (untrapDrawer) untrapDrawer();
}
if (openBtn) {
  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
}

document.querySelectorAll('.faq-item button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    document.querySelectorAll('.faq-item').forEach((el) => { if (el !== item) el.classList.remove('open'); });
    item.classList.toggle('open');
  });
});

const modalWrap = document.querySelector('.modal-wrap');
if (modalWrap) {
  const openers = document.querySelectorAll('[data-open-privacy]');
  const closers = modalWrap.querySelectorAll('[data-close-modal]');
  const modal = modalWrap.querySelector('.modal');
  let untrapModal = null;
  const openModal = () => {
    modalWrap.classList.add('show'); lockScroll(true);
    untrapModal = trapFocus(modal, closeModal);
  };
  function closeModal() {
    modalWrap.classList.remove('show'); lockScroll(false);
    if (untrapModal) untrapModal();
  }
  openers.forEach((op) => op.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  closers.forEach((cl) => cl.addEventListener('click', closeModal));
  modalWrap.querySelector('.modal-bg').addEventListener('click', closeModal);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
