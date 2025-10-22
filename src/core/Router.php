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
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = str_replace('/saews303d/public', '', $uri);

    foreach ($this->routes[$method] ?? [] as $path => $handler) {

      $pattern = preg_replace('#\{[a-zA-Z_][a-zA-Z0-9_]*\}#', '([^/]+)', $path);
      $pattern = "#^{$pattern}$#";

      if (preg_match($pattern, $uri, $matches)) {
        array_shift($matches);
        call_user_func_array($handler, $matches);
        return;
      }
    }

    http_response_code(404);
    echo "404 - Page non trouvée";
  }
}