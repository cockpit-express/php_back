<?php
  use Illuminate\Database\Capsule\Manager as Capsule;

  require_once __DIR__ . '/vendor/autoload.php';

  $capsule = new Capsule;

  $capsule->addConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'database' => 'sae_ws303d',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci'
  ]);

  $capsule->setAsGlobal();
  $capsule->bootEloquent();