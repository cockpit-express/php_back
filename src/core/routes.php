<?php
  require_once __DIR__ . '/../core/Router.php';

  use Core\Router;

  $router = new Router();

  $pages = __DIR__ . '/../pages/';
  $controllers = __DIR__ . '/../controller/';

  // Pages

  $router
    ->get('/', fn() => require "{$pages}home.php")
    ->get('/home', fn() => require "{$pages}home.php")
    ->get('/cockpit', fn() => require "{$pages}cockpit.php")
    ->get('/test', fn() => require "{$pages}test.php");

  // API REST

  $router
    ->get('/api/stations', function() use ($controllers) {
      require_once "{$controllers}StationController.php"; 
      \Controller\StationController::getMany();
    })
    ->get('/api/stations/{id}', function($id) use ($controllers) {
      require_once "{$controllers}StationController.php"; 
      \Controller\StationController::getById($id);
    })

    ->get('/api/places', function() use ($controllers) {
      require_once "{$controllers}PlaceController.php"; 
      \Controller\PlaceController::getMany();
    })
    ->get('/api/places/{id}', function($id) use ($controllers) {
      require_once "{$controllers}PlaceController.php"; 
      \Controller\PlaceController::getById($id);
    });

  return $router;