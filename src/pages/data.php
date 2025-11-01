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

         <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.</p>
      </div>

      <div class="charts-box">
        <div class="chart-and-infos">
          <div class="infos-box">
            <h4>Répartition des lieux culturels en France, selon leur catégorie</h4>

            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          </div>

          <div class="chart-box" id="type-count-chart-box">
            <svg id="type-count-chart" class="chart"></svg>
          </div>
        </div>

        <div class="chart-and-infos">
          <div class="infos-box">
            <h4>Répartition des lieux culturels dans les régions françaises, selon leur catégorie</h4>

            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          </div>

          <div class="chart-box">
            <svg id="region-count-chart" width="800" height="400" class="chart"></svg>
          </div>
        </div>

        <div class="chart-and-infos">
          <div class="infos-box">
            <h4>Répartition des gares féroviaires dans les régions françaises</h4>

            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
          </div>

          <div class="chart-box">
            <svg id="stations-by-regions-count" width="800" height="400" class="chart"></svg>
          </div>
        </div>
      </div>
    </main>

    <script>
      window.regionCountData = <?php echo json_encode($regionCountData); ?>;
      window.typeCountData = <?php echo json_encode($typeCountData); ?>;
      window.stationsData = <?php echo json_encode($stationsData); ?>;
    </script>

    <script src="./assets/js/datapage.js"></script>
  </body>
</html>