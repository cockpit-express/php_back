<?php
  namespace Controller;

  use Repository\StationRepository;

  class StationController {
    public static function getMany(): void { 
      $defaultLimit = 2762;
      $maxlimit = 2762;
      $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : $defaultLimit;
      $lat = isset($_GET['lat']) ? (float) $_GET['lat'] : null;
      $lon = isset($_GET['lon']) ? (float) $_GET['lon'] : null;

      if ($limit <= 0 || $limit > $maxlimit) $limit = $defaultLimit;

      $stations = StationRepository::getMany($limit, $lat, $lon);

      header('Content-Type: application/json; charset=utf-8');
      echo json_encode($stations);
    }

    public static function getById(string $id): void {
      $station = StationRepository::getById($id);
      header('Content-Type: application/json; charset=utf-8');

      if ($station) {
        echo json_encode($station);
      } else {
        http_response_code(404);
        echo json_encode(['error' => "Station {$id} not found"]);
      }
    }
  }