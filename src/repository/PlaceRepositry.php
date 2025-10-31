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

    public static function countByRegionWithTypes(): array {
      $rows = Place::query()
        ->selectRaw('region_code, type, COUNT(*) as count')
        -> groupBy('region_code', 'type')
        ->get();
      
      $result = [];

      foreach($rows as $row) {
        $region = $row->region_code ?? 'unknown';
        $type = $row->type ?? 'unknown';
        $count = (int) $row->count;

        if (!isset($result[$region])) {
          $result[$region] = [
            'region_code' => $region,
            'total' => 0,
            'types' => []
          ];
        }

        $result[$region]['types'][$type] = $count;
        $result[$region]['total'] += $count;
      }

      $excludedCodes = ['98', '99', '', '01', '02', '03', '04', '05', '06', '07', '94'];

      $filtered = array_filter($result, function($region) use ($excludedCodes) {
        return !in_array($region['region_code'], $excludedCodes, true);
      });

      return array_values($filtered);
    }
  }