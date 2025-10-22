<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device‑width, initial-scale=1.0">
    <title>Cockpit Express</title>
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css">
  </head>

  <body class="datapage">
    <header class="site-header">
      <div class="container">
        <h1 class="logo">Découvertes proches de vos gares</h1>
        <nav class="main-nav">
          <ul>
            <li><a href="./home">Accueil</a></li>
          <li><a href="./cockpit">Cockpit</a></li>
          <li><a href="./data">Graphiques</a></li>
          <li><a href="#">à propos</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <div id="map" style="height:55vh"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
    <script src="https://d3js.org/d3.v7.min.js"></script>

    <script src="./assets/js/datapage.js"></script>

    <footer class="site‑footer">
      <div class="container">
        <p>© 2025. Tous droits réservés.</p>
      <a href="https://www.example.com">Confidentialités</a>
      </div>
    </footer>
  </body>
</html>