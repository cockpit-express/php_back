<?php
  namespace Repository;

  use Model\Place;

  class PlaceRepositry {
    public static function getMany(
      int $limit = 100, 
      ?float $lat = null, 
      ?float $lon = null,
      ?float $radiusKm = null
    ): \Illuminate\Database\Eloquent\Collection {

      $query = Place::query();

      if ($lat !== null && $lon !== null) {
        $haversine = "(6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        ))";

        if ($radiusKm !== null && $radiusKm > 0) {
          $query->selectRaw("*, {$haversine} AS distance", [$lat, $lon, $lat])
          ->having('distance', '<=', $radiusKm)
          ->orderBy('distance', 'asc');

        } else {
          $query->orderByRaw("{$haversine} ASC", [$lat, $lon, $lat]);
        }
      }
      return $query->limit($limit)->get();
    }

    public static function getById(int $id): ?Place {
      return Place::find($id);
    }
  }