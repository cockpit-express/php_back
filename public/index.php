<?php
  // DEV //
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  // DEV //
  
  require __DIR__ . '/../vendor/autoload.php';
  require __DIR__ . '/../bootstrap.php';
  require_once __DIR__ . '/../src/core/Router.php';
  
  $router = require __DIR__ . '/../src/core/routes.php';
  $router->dispatch();