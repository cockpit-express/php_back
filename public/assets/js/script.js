document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('banner');
  const toggleButton = document.getElementById('toggleBanner');

  let isVisible = true;

  toggleButton.addEventListener('click', () => {
    isVisible = !isVisible;
    banner.classList.toggle('hidden', !isVisible);

    // Change le texte du bouton
    toggleButton.textContent = isVisible ? '✕ Fermer' : '▼ Ouvrir la bannière';
    toggleButton.setAttribute('aria-label', isVisible ? 'Masquer la bannière' : 'Afficher la bannière');
  });
});