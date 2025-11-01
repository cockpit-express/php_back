<?php
  require_once __DIR__ . '/../core/Router.php';

  use Core\Router;

  $router = new Router();

  $pages = __DIR__ . '/../pages/';
  $controllers = __DIR__ . '/../controller/';

  // Pages

  $router
    ->get('/', fn() => require "{$pages}cockpit.php")
    ->get('/home', fn() => require "{$pages}cockpit.php")
    ->get('/cockpit', fn() => require "{$pages}cockpit.php")
    ->get('/test', fn() => require "{$pages}test.php")
    ->get('/data', fn() => require "{$pages}data.php")
    ->get('/a-propos', fn() => require "{$pages}about.php")
    ->get('/api', fn() => require "{$pages}api.php");

  // API REST

  $router
    // Stations
    ->get('/api/stations', function() use ($controllers) {
      require_once "{$controllers}StationController.php"; 
      \Controller\StationController::getMany();
    })
    ->get('/api/stations/{id}', function($id) use ($controllers) {
      require_once "{$controllers}StationController.php"; 
      \Controller\StationController::getById($id);
    })

    // Places
    ->get('/api/places', function() use ($controllers) {
      require_once "{$controllers}PlaceController.php"; 
      \Controller\PlaceController::getMany();
    })
    ->get('/api/places/count-by-type', function() use ($controllers): void {
      require_once "{$controllers}PlaceController.php";
      \Controller\PlaceController::countByType();
    })
    ->get('/api/places/count-by-region', function() use ($controllers): void {
      require_once "{$controllers}PlaceController.php";
      \Controller\PlaceController::countByRegion();
    })
    ->get('/api/places/{id}', function($id) use ($controllers) {
      require_once "{$controllers}PlaceController.php"; 
      \Controller\PlaceController::getById($id);
    });

  return $router;