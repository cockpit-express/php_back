document.addEventListener('DOMContentLoaded', () => {
  // === BANNIÈRE ===
  const banner = document.getElementById('banner');
  const toggleButton = document.getElementById('toggleBanner');
  let isVisible = true;

  toggleButton.addEventListener('click', () => {
    isVisible = !isVisible;
    banner.classList.toggle('hidden', !isVisible);
    toggleButton.textContent = isVisible ? '✕ Fermer' : '▼ Ouvrir la bannière';
    toggleButton.setAttribute('aria-label', isVisible ? 'Masquer la bannière' : 'Afficher la bannière');
  });

  // === TOGGLE THEME JOUR/NUIT ===
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('night', themeToggle.checked);
    });
  }

  // === SWITCH LANGUE ===
  const langBtn = document.getElementById('langBtn');
  const langPopup = document.getElementById('langPopup');
  const currentFlag = document.getElementById('current-flag');
  const langOptions = langPopup.querySelectorAll('.lang-option');

  langBtn.addEventListener('click', () => {
    langPopup.classList.toggle('expanded');
  });

  langOptions.forEach(option => {
    option.addEventListener('click', () => {
      const img = option.querySelector('img');
      currentFlag.src = img.src;
      currentFlag.alt = img.alt;
      langPopup.classList.remove('expanded');
      // Ici, tu peux déclencher le changement de langue sur le serveur si besoin
    });
  });

  document.addEventListener('click', (e) => {
    if (!langBtn.contains(e.target) && !langPopup.contains(e.target)) {
      langPopup.classList.remove('expanded');
    }
  });

  // === HAMBURGER MENU MOBILE ===
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.site-header .main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');         // ouvre/ferme le menu
      hamburger.classList.toggle('active'); // transforme le hamburger en croix
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
    });
  }
});