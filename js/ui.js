/* ============================================================
   UI – Navigation, Tabs, Modals, Scroll-Reveal, Touch-Feedback
   ============================================================ */

// Touch-Feedback für Karten (Mobile)
const touchCards = document.querySelectorAll('.cat-card, .helfer-card, .step-card');
touchCards.forEach(card => {
  card.addEventListener('touchstart', () => card.classList.add('touched'), { passive: true });
  card.addEventListener('touchend', () => setTimeout(() => card.classList.remove('touched'), 250), { passive: true });
  card.addEventListener('touchcancel', () => card.classList.remove('touched'), { passive: true });
});
document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY)?.closest('.cat-card, .helfer-card, .step-card');
  touchCards.forEach(c => c.classList.toggle('touched', c === el));
}, { passive: true });

// Mobile Nav – Burger-Menü
const navBurger = document.getElementById('nav-burger');
const navLinks  = document.getElementById('nav-links');
const burgerIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
const closeIcon  = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

navBurger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navBurger.innerHTML = isOpen ? closeIcon : burgerIcon;
  navBurger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
});

document.querySelectorAll('#nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navBurger.innerHTML = burgerIcon;
    navBurger.setAttribute('aria-label', 'Menü öffnen');
  });
});

// Schließt Burger-Menü bei Klick außerhalb
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== navBurger && !navBurger.contains(e.target)) {
    navLinks.classList.remove('open');
    navBurger.innerHTML = burgerIcon;
    navBurger.setAttribute('aria-label', 'Menü öffnen');
  }
});

// Tab-Umschaltung via data-tab Attribut (kein inline onclick)
function switchTab(type, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('steps-heim').classList.toggle('hidden', type !== 'heim');
  document.getElementById('steps-helfer').classList.toggle('hidden', type !== 'helfer');
}

document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', function() {
    switchTab(this.dataset.tab, this);
  });
});

// Modal-Handling (kein inline onclick)
document.querySelectorAll('[data-opens]').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const modal = document.getElementById(trigger.dataset.opens);
    if (modal) modal.classList.remove('hidden');
  });
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('[id$="-modal"]').classList.add('hidden');
  });
});

document.querySelectorAll('[id$="-modal"]').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});

// Escape-Taste schließt offene Modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('[id$="-modal"]:not(.hidden)').forEach(m => m.classList.add('hidden'));
  }
});

// Scroll-Reveal via IntersectionObserver
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
