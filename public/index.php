<?php

require_once "../vendor/autoload.php";

use Pokedex\Controller\PokemonController;
use Pokedex\Controller\UserController;

// Config. TWIG
$loader = new \Twig\Loader\FilesystemLoader('../src/Views');
$twig = new \Twig\Environment($loader);

// Config. PDO
$config = require '../src/config.php';

$host = $config['db']['host'];
$db = $config['db']['name'];
$user = $config['db']['user'];
$pass = $config['db']['pass'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Erreur de connexion : ' . $e->getMessage());
}

// Configurez ROUTER
$router = new AltoRouter();

$pokemonController = new PokemonController($twig);
$userController = new UserController($twig, $pdo);

$router->map('GET', '/', function() use ($userController) {
    $userController->displayLogin();
});

$router->map('POST', '/signup', function() use ($userController) {
    $userController->signup();
});

$router->map('POST', '/choice', function() use ($userController) {
    $userController->login();
});

$router->map('GET', '/choice', function() use ($twig) {
    $username = isset($_SESSION['username']) ? $_SESSION['username'] : '';
    echo $twig->render("gen_choice.html.twig", ['username' => $username]);
});

$router->map('GET', '/logout', function() use ($userController) {
    $userController->logout();
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
