<?php
  // DEV //
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  // DEV //

  header("Access-Control-Allow-Origin: *"); 
  header("Access-Control-Allow-Methods: GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); 
  header("Access-Control-Max-Age: 86400"); 

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
  }

  require __DIR__ . '/../vendor/autoload.php';
  require __DIR__ . '/../bootstrap.php';
  require_once __DIR__ . '/../src/core/Router.php';
  
  $router = require __DIR__ . '/../src/core/routes.php';
  $router->dispatch();