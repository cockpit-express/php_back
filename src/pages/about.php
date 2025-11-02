<?php 
  $regionCountData = json_decode(file_get_contents('https://ws303d.mmi24c16.mmi-troyes.fr/api/places/count-by-region'), true); 
  $typeCountData = json_decode(file_get_contents('https://ws303d.mmi24c16.mmi-troyes.fr/api/places/count-by-type'), true); 
  $stationsData = json_decode(file_get_contents('https://ws303d.mmi24c16.mmi-troyes.fr/api/stations'), true); 
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device‑width, initial-scale=1.0">
    <title>Cockpit.io</title>

    <link rel="stylesheet" href="./assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@1" rel="stylesheet" />
    <script src="https://d3js.org/d3.v7.min.js"></script>
  </head>

  <body>
    <?php include './components/navbar.php' ?>

    <main class="about-sec">
      <header>
        <h1><span class="material-symbols-outlined">developer_guide</span> A propos</h1>

        <p>Le code source du projet est <a href="https://github.com/cockpit-express" target="_blank">disponible sur Github</a> via 2 repositories : le site web PHP et le script permettant de filtrer et d'insérer les données CSV dans la base SQL. Contact : <a href="mailto:cockpit.io.troyes@gmail.com">cockpit.io.troyes@gmail.com</a>.</p>
      </header>

      <div class="articles">
        <div class="article">
          <h2>Cadre du projet</h2>

          <p>Ce projet web a été réalisé dans le cadre d’un module d’évaluation à <a href="https://www.univ-reims.fr/iut-troyes/" target="_blank">l’IUT de Troyes</a>, au sein du département des Métiers du Multimédia et de l’Internet (MMI). Le projet répond également à un des défis de <a href="https://www.data.gouv.fr" target="_blank">data.gouv.fr</a> (manipulation de données open data) ; le sujet choisi a été <a href="https://defis.data.gouv.fr/defis/tourisme-en-train" target="_blank">le "tourisme en train"</a> (proposé par la <a href="https://www.groupe-sncf.com/fr/engagements/mecenat-sponsoring/fondation" target="_blank">Fondation SNCF</a>). Notre objectif : redonner le goût pour la culture tout en encourageant la mobilité en train.</p>
        </div>

        <div class="article">
          <h2>Equipe</h2>

          <p><a href="https://ws303d.mmi24c16.mmi-troyes.fr/api" target="_blank">Cockpit.io</a> a été réalisé par une équipe de 4 étudiants. <a href="https://github.com/ugravis" target="_blank">Ulysse Pennetier</a> (conception back-end, API, design et intégration frontend, interactivité du cockpit), <a href="http://mmi24a04.mmi-troyes.fr/portfolio/" target="_blank">Valentin Babic</a> (conception du front-end statique), <a href="https://www.linkedin.com/in/tristan-legrand-280339351" target="_blank">Tristan Legrand</a> (manipulation de graphiques) et <a href="https://www.linkedin.com/in/thomas-hervet-6235a6395/" target="_blank">Thomas Hervet</a> (manipulation de graphiques).</p>
        </div>

        <div class="article">
          <h2>Notre méthodologie</h2>
          
          <div class="article">
            <h4>Origine des données</h4>

            <p>Les données analysées proviennent de datasets issus de l’open data. Deux d’entre eux ont été mis à contribution dans ce projet : <a href="https://defis.data.gouv.fr/datasets/65d81858179dc96581d981db" target="_blank">les gares de voyageurs en France</a> (SNCF, 2.769 entrées) ainsi que <a href="https://defis.data.gouv.fr/datasets/61777ddaa9101d073e5506cd" target="_blank">la base des lieux et équipement culturels</a> (Ministère de la Culture, 88.037 entrées). </p>
          </div>
          
          <div class="article">
            <h4>Traitement des données</h4>

            <p>Les datasets, initialement en format XLXS et/ou CSV, ont été entrés dans une base de données SQL, afin de pouvoir construire une API propre et de proposer des requêtes HTTP fluides.</p>

            <p>Les données ont été nettoyées avant leur entrée en base de données. Ainsi, les stations (gares) comportent 5 champs (initialement 6) : id, name, latitude, longitude, postal_code. Les places (lieux culturels) en comportent 11 (initialement 55) : id, name, address, postal_code, type, label, attitude, longitude, region_code, departement_code.</p>
            
            <p>Cependant, parmi les quelques 88.000 lieux et équipements culturels, beaucoup ne sont pas pertinents pour les utilisateurs de notre projet. Nous avons donc décidé de créer un algorithme de tri : nous avons éliminé certaines catégories de lieux (par exemple les établissements d’enseignement supérieurs et les librairies) et filtré le nom des lieux appartenants à la catégorie "monument" via un système de mots clés (par exemple, les éléments contenant dans leur nom "cathédrale", "citadelle", "phare" ou encore "beffroi" sont gardés d’emblée, tandis que ceux contenant par exemple "fontaine", "cimetière", "puit" ou encore "borne" sont éliminés).</p>
          
            <p>Au final, grâce à un script PHP réalisant ces actions, nous avons conservé environ 16.000 lieux culturels jugés pertinents.</p>
          </div>

          <div class="article">
            <h4>Elaboration du back-end</h4>

            <p><a href="#">Cockpit.io</a> repose sur une structure back-end MVC, programmée en PHP. La base de donnée est basée sur Mysql et est servie grâce à la page <a href="https://ws303d.mmi24c16.mmi-troyes.fr/api" target="_blank">cockpit.io/api</a> (la documentation de l’API est présente sur la page). Le projet utilise l’ORM illuminate (de Laravel) et est fortement typé POO (router, controllers, repositories).</p>
          </div>
        
          <div class="article">
            <h4>Elaboration du front-end</h4>

            <p>Le front-end ainsi que l’intégralité des assets (images, JS) sont servis depuis le dossier public du projet. Le style a été programmé en SCSS afin d’accélérer le développement. Le code JS est de type module et les requêtes à l’API sont faites grâce à fetch.</p>
          </div>

          <div class="article">
            <h4>Elaboration du cockpit interactif</h4>

            <p>Le cockpit interactif utilise la bibliothèque JS <a href="https://leafletjs.com/" target="_blank">Leaflet</a> pour la carte interactive, et <a href="https://d3js.org/" target="_blank">d3js</a> pour les graphiques (utilisé également sur la page <a href="https://ws303d.mmi24c16.mmi-troyes.fr/data" target="_blank">cockpit.io/data</a>). Les images utilisées pour illustrer les sites culturels proviennent de l’API de <a href="https://www.wikimedia.org/" target="_blank">Wikimedia</a> (accès libre à l’API). A noter que les tuiles de la carte interactive proviennent de <a href="https://www.thunderforest.com/maps/pioneer/" target="_blank">la carte Pioneer de Thunderforest</a>.</p>
          </div>
        </div>

        <div class="article">
          <h2>Futurs axes d’amélioration</h2>

          <p><a href="#">Cockpit.io</a> a été élaboré selon une contrainte de temps de deux semaines, dont trois jours à temps complet. Par conséquent, un grand nombre d’éléments n’ont pas pu être réalisés. Voici une liste exhaustive des axes d’amélioration possibles :</p>

          <ul>
            <li><b>Gamification du cockpit</b> : faire défiler le paysage et les rails via une vidéo en boucle. Inclure des sons d'ambiance. Rendre fonctionnel les boutons et la manette située au milieu du tableau de bord (afin de permettre à l’utilisateur de régler la vitesse du train ou encore d’émettre un bruit de klaxon).</li>
            <li><b>Expérience utilisateur</b> : barre de recherche sur la carte interactive. Possibilité d’afficher un historique des gares visitées.</li>
            <li><b>Filtrage des données</b> : améliorer l’algorithme de sélection des lieux culturels pertinents.</li>
            <li><b>Accessibilité</b> : ajouter un mode sombre.</li>
          </ul>
        </div>
      </div>
    </main>

    <?php include './components/footer.php' ?>
  </body>
</html>