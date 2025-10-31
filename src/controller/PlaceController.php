<?php
  namespace Controller;

  use Repository\PlaceRepositry;

  class PlaceController {
    public static function getMany(): void { 
      $defaultLimit = 150;
      $maxLimit = 600;
      $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : $defaultLimit;
      $lat = isset($_GET['lat']) ? (float) $_GET['lat'] : null;
      $lon = isset($_GET['lon']) ? (float) $_GET['lon'] : null;
      $radiusKm = isset($_GET['radiusKm']) ? (float) $_GET['radiusKm'] : null;

      if ($limit <= 0 || $limit > $maxLimit) $limit = $defaultLimit;

      $places = PlaceRepositry::getMany($limit, $lat, $lon, $radiusKm);

      header('Content-Type: application/json; charset=utf-8');
      echo json_encode($places);
    }

    public static function getById(string $id): void {
      $place = PlaceRepositry::getById($id);
      header('Content-Type: application/json; charset=utf-8');

      if ($place) {
        echo json_encode($place);
      } else {
        http_response_code(404);
        echo json_encode(['error' => "Place {$id} not found"]);
      }
    }

    public static function countByRegion(): void {
      $counts = PlaceRepositry::countByRegionWithTypes();
      header('Content-Type: application/json; charset=utf-8');
      echo json_encode($counts);
    }
  }