<?php
  require_once __DIR__ . '/../repository/stationRepository.php';

  use Repository\StationRepository;

  echo StationRepository::getMany(5);