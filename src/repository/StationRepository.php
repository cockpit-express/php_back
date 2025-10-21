<?php
  namespace Repository;

  use Model\Station;

  class StationRepository {
    public static function getAll(): \Illuminate\Database\Eloquent\Collection {
      return Station::all();
    }

    public static function getById(int $id): ?Station {
      return Station::find($id);
    }
  }