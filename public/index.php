<?php

require_once "../vendor/autoload.php";

use Pokedex\Controller\PokemonController;
use Pokedex\Controller\UserController;

$loader = new \Twig\Loader\FilesystemLoader('../src/Views');
$twig = new \Twig\Environment($loader);

$router = new AltoRouter();

$pokemonController = new PokemonController($twig);
$userController = new UserController($twig);

$router->map('GET', '/', function() use ($userController) {
    $userController->displayLogin();
});

$router->map('GET', '/choice', function() use ($pokemonController) {
    $pokemonController->showGenerationChoice();
});



$router->map('GET', '/generation/[i:gen]', function($gen) use ($pokemonController) {
    $pokemonController->getPokemonsFromAPI($gen);
});

$router->map('GET', '/pokemon/[i:id]', function($id) use ($pokemonController) {
    $pokemonController->getPokemonDetails($id);
});


$match = $router->match();

if ($match && is_callable($match['target'])) {
    call_user_func_array($match['target'], $match['params']);
} else {
    // Aucune route trouvée
    header($_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
    echo '404 Not Found';
}