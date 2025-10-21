<?php
  require_once __DIR__ . '/../repository/stationRepository.php';

  use Repository\StationRepository;

  echo StationRepository::getAll();
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>Cockpit Express</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/css/style.css">
  </head>

  <body>
    <main>
      <h1>Home</h1>
    </main>

    <script src="./assets/js/script.js"></script>
  </body>
</html>