<?php 
  $regionCountData = json_decode(file_get_contents('http://localhost/saews303d/public/api/places/count-by-region'), true); 
  $typeCountData = json_decode(file_get_contents('http://localhost/saews303d/public/api/places/count-by-type'), true); 
  $stationsData = json_decode(file_get_contents('http://localhost/saews303d/public/api/stations'), true); 
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device‑width, initial-scale=1.0">
    <title>Cockpit Express</title>

    <link rel="stylesheet" href="./assets/css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@1" rel="stylesheet" />
    <script src="https://d3js.org/d3.v7.min.js"></script>
  </head>

  <body>
    <?php include './components/navbar.php' ?>

    <main class="data-sec">
      <div class="header">
        <h1><span class="material-symbols-outlined">grouped_bar_chart</span> Données globales</h1>

         <p>Nous espérons que vous avez fait bon voyage à bord de notre cockpit ! Cette page supplémentaire vous fournira une visualisation générale des données open data utilisées. Consultez notre <a href="./a-propos">méthodologie</a> pour plus de détails.</p>
      </div>

      <div class="charts-box">
        <div class="chart-and-infos">
          <div class="infos-box">
            <h4>Répartition des lieux culturels en France, selon leur catégorie</h4>

            <p>La France, pays chargé d’histoire, possède une grande quantité de sites historiques emblématiques : 76,3% de monuments, 5% de lieux archéologiques et 1,5% de lieux de mémoire ; soit un total de 14.721 sites. Les lieux purement axés sur la culture ne sont tout de même pas en reste, avec un total de 2.343 musées, théâtres, centres d’art, centres culturels, scènes et opéras. A noter que ce graphique, comme l’ensemble de nos données filtrées, ne prend en compte que les régions françaises disposant de gares ferroviaires accueillant des voyageurs.</p>
          </div>

          <div class="chart-box" id="type-count-chart-box">
            <svg id="type-count-chart" class="chart"></svg>
          </div>
        </div>

        <div class="chart-and-infos">
          <div class="infos-box">
            <h4>Répartition des lieux culturels dans les régions françaises, selon leur catégorie</h4>

            <p>La répartition des types de lieux culturels selon chaque région française révèle des disparités et des informations intéressantes. En effet, on remarque une sur-représentation des théâtres en région Île de France et des espaces protégés dans les Hauts de France. Egalement, alors que la majorité des régions françaises présentent entre 1.000 et 1.350 sites culturels, 3 régions se démarquent fortement : la Nouvelle Aquitaine (2.461), l’Occitane (2.243) et l’Auvergne-Rhône-Alpes (2.062).</p>
          </div>

          <div class="chart-box">
            <svg id="region-count-chart" width="800" height="400" class="chart"></svg>
          </div>
        </div>

        <div class="chart-and-infos">
          <div class="infos-box">
            <h4>Répartition des gares ferroviaires dans les régions françaises, en comparaison avec le nombre de sites culturels</h4>

            <p>On compte actuellement 2762 gares SNCF en France. Certaines régions, plus grandes et/ou davantage connectées que d’autres, possèdent un plus grand nombre de ces infrastructures (notamment la région Île de France, les Hauts de France ou encore le Grand Est) - contrairement à des régions comme la Normandie, les Pays de la Loire et la Bretagne. Egalement, la quantité de sites culturels semble plus ou moins corrélée avec le nombre de gares (on retrouve ici la Nouvelle Aquitaine, l’Occitanie et l’Auvergne-Rhône-Alpes). On pourrait alors facilement émettre l’hypothèse que les régions avec le plus de lieux culturels tendent à être celles avec le plus de gares, c’est à dire avec le plus de zones urbaines.</p>
          </div>

          <div class="chart-box">
            <svg id="stations-by-regions-count" width="800" height="400" class="chart"></svg>
          </div>
        </div>
      </div>
    </main>

    <?php include './components/footer.php' ?>

    <script>
      window.regionCountData = <?php echo json_encode($regionCountData); ?>;
      window.typeCountData = <?php echo json_encode($typeCountData); ?>;
      window.stationsData = <?php echo json_encode($stationsData); ?>;
    </script>

    <script src="./assets/js/datapage.js"></script>
  </body>
</html>