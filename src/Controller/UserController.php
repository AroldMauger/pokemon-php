<?php

namespace Pokedex\Controller;
use PDO;

class UserController
{
    private $twig;
    private $pdo;

    public function __construct($twig, PDO $pdo){
        $this->twig = $twig;
        $this->pdo = $pdo;
        session_start();
    }

    public function displayLogin(){
        echo $this->twig->render("login.html.twig", [
            'success_message' => $_SESSION['success_message'] ?? null,
            'error_message' => $_SESSION['error_message'] ?? null,
        ]);
        // Clear messages after display
        unset($_SESSION['success_message'], $_SESSION['error_message']);
    }

    public function signup() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'];
            $password = $_POST['password'];

            // Vérifiez si le nom d'utilisateur existe déjà
            $stmt = $this->pdo->prepare('SELECT * FROM users WHERE username = ?');
            $stmt->execute([$username]);
            if ($stmt->rowCount() > 0) {
                // Si le nom d'utilisateur existe déjà, stockez un message d'erreur
                $_SESSION['error_message'] = 'Nom d\'utilisateur déjà existant';
                header('Location: /');
                exit;
            } else {
                // Hachez le mot de passe
                $password_hash = password_hash($password, PASSWORD_DEFAULT);

                // Insérez l'utilisateur dans la base de données
                $stmt = $this->pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
                $stmt->execute([$username, $password_hash]);

                // Stockez un message de succès
                $_SESSION['success_message'] = 'Inscription réussie!';
                header('Location: /');
                exit;
            }
        }
    }

    public function login(){
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'];
            $password = $_POST['password'];

            // Recherchez l'utilisateur dans la base de données
            $stmt = $this->pdo->prepare('SELECT * FROM users WHERE username = ?');
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                // Connexion réussie, créez une session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];

                // Redirige vers la page d'accueil ou tableau de bord
                header('Location: /choice');
                exit;
            } else {
                $_SESSION['error_message'] = 'Nom d’utilisateur ou mot de passe incorrect.';
                header('Location: /');
                exit;
            }
        }
    }

    public function logout(){
        session_unset();
        session_destroy();
        header('Location: /');
        exit;
    }
}
