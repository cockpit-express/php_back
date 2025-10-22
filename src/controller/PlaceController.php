<?php
  namespace Controller;

  use Repository\PlaceRepositry;

  class PlaceController {
    public static function getMany(): void { 
      $defaultLimit = 150;
      $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : $defaultLimit;
      $lat = isset($_GET['lat']) ? (float) $_GET['lat'] : null;
      $lon = isset($_GET['lon']) ? (float) $_GET['lon'] : null;

      if ($limit <= 0 || $limit > 250) $limit = $defaultLimit;

      $places = PlaceRepositry::getMany($limit, $lat, $lon);

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
  }