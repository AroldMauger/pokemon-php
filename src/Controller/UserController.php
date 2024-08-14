<?php

namespace Pokedex\Controller;

class UserController
{
    private $twig;

    public function __construct($twig){
        $this->twig = $twig;
    }

    public function displayLogin(){
        echo $this->twig->render("login.html.twig");
    }
}