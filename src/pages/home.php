<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cockpit Express</title>
  <link rel="stylesheet" href="./assets/css/style.css">
  <script src="./assets/js/script.js" defer></script>
</head>
<body>

<header class="site-header">
  <div class="container">
    <h1 class="logo">SNCF DECOUVERTES</h1>

    <!-- Hamburger button -->
    <button class="hamburger" aria-label="Menu" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="main-nav">
      <ul>
        <li><a href="./home">Accueil</a></li>
        <li><a href="./cockpit">Cockpit</a></li>
        <li><a href="./data">Graphiques</a></li>
        <li><a href="#">à propos</a></li>
      </ul>
    </nav>

    <div class="language-switcher">
      <button id="langBtn" aria-label="Changer de langue">
        <img src="./assets/images/icons/fr.png" alt="Français" id="current-flag" />
      </button>
      <div id="langPopup" class="lang-popup hidden">
        <button class="lang-option" data-lang="fr">
          <img src="./assets/images/icons/fr.png" alt="Français" /> Français
        </button>
        <button class="lang-option" data-lang="en">
          <img src="./assets/images/icons/en.png" alt="English" /> English
        </button>
        <button class="lang-option" data-lang="es">
          <img src="./assets/images/icons/es.png" alt="Español" /> Español
        </button>
        <button class="lang-option" data-lang="de">
          <img src="./assets/images/icons/de.png" alt="Deutsch" /> Deutsch
        </button>
        <button class="lang-option" data-lang="it">
          <img src="./assets/images/icons/it.png" alt="Italiano" /> Italiano
        </button>
        <button class="lang-option" data-lang="jp">
          <img src="./assets/images/icons/jp.png" alt="日本語" /> 日本語
        </button>
      </div>
    </div>

    <div class="theme-switcher">
      <input type="checkbox" id="theme-toggle" />
      <label for="theme-toggle" class="switch">
        <span class="slider"></span>
      </label>
    </div>

  </div>
</header>

<div class="banner-wrapper">
  <div class="bannerimage" id="banner">
    <img src="./assets/images/illustrations/a-bord-de-ce-train-touristique-decouvrez-lAlsace-autrement-a-travers-des-paysages-dexception.jpg" alt="Bannière SNCF monuments" />
  </div>
  <button id="toggleBanner" aria-label="Masquer la bannière">✕ Fermer</button>
</div>

<section class="hero">
  <div class="container">
    <h2>Explorez les trésors qui bordent nos lignes ferroviaires</h2>
    <p>Des monuments emblématiques aux petits joyaux méconnus, laissez‑vous surprendre à chaque arrêt.</p>
  </div>
</section>

<section class="browse‑by‑style">
  <div class="container">
    <h3>Par type de découverte</h3>
    <div class="grid">
      <div class="grid‑item"><a href="#">Châteaux & forteresses</a></div>
      <div class="grid‑item"><a href="#">Cathédrales & églises</a></div>
      <div class="grid‑item"><a href="#">Ponts & infrastructures ferroviaires</a></div>
      <div class="grid‑item"><a href="#">Villes historiques</a></div>
      <div class="grid‑item"><a href="#">Monuments aux morts</a></div>
    </div>
  </div>
</section>

<footer class="site‑footer">
  <div class="container">
    <p>© 2025. Tous droits réservés.</p>
    <a href="#">Confidentialités</a>
  </div>
</footer>

</body>
</html>