<?php
  namespace Repository;

  use Model\Place;

  class PlaceRepositry {
    public static function getMany(int $limit = 100, ?float $lat = null, ?float $lon = null): \Illuminate\Database\Eloquent\Collection {
      $query = Place::query();

      if ($lat !== null && $lon !== null) {
        $query->orderByRaw(
          '(POWER(latitude - ?, 2) + POWER(longitude - ?, 2)) ASC',
          [$lat, $lon]
        );
      }
      return $query->limit($limit)->get();
    }

    public static function getById(int $id): ?Place {
      return Place::find($id);
    }
  }