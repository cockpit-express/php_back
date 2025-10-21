<?php
namespace Core;

class Router {
  private array $routes = [];

  public function get(string $path, callable $handler): self {
    $this->routes['GET'][$path] = $handler;
    return $this; 
  }

  public function post(string $path, callable $handler): self {
    $this->routes['POST'][$path] = $handler;
    return $this;
  }

  public function dispatch(): void {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = str_replace('/saews303d/public', '', $path); 

    $handler = $this->routes[$method][$path] ?? null;

    if ($handler) {
      call_user_func($handler);
    } else {
      http_response_code(404);
      echo "404 — Page non trouvée";
    }
  }
}