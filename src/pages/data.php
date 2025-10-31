<?php 
  $regionCountData = json_decode(file_get_contents('http://localhost/saews303d/public/api/places/count-by-region'), true); 
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

    <svg id="region-count-chart" width="800" height="400"></svg>

    <script>
      window.regionCountData = <?php echo json_encode($regionCountData); ?>;
    </script>

    <script src="./assets/js/datapage.js"></script>
  </body>
</html>