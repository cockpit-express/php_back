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

    <main class="about-sec">
      <header>
        <h1><span class="material-symbols-outlined">developer_guide</span> A propos</h1>

        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.</p>
      </header>

      <div class="articles">
        <div class="article">
          <h2>Cadre du projet</h2>

          <p>Description</p>
        </div>

        <div class="article">
          <h2>Equipe</h2>

          <p>Description</p>
        </div>

        <div class="article">
          <h2>Notre méthodologie</h2>

          <p>Description</p>
        </div>
      </div>
    </main>

    <?php include './components/footer.php' ?>
  </body>
</html>