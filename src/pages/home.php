<?php
  require_once __DIR__ . '/../repository/stationRepository.php';

  use Repository\StationRepository;

  echo StationRepository::getAll();
?>

<main>
  <h1>Home</h1>
</main>