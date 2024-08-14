<?php

namespace Pokedex\Controller;
class PokemonController
{
    private $twig;

    public function __construct($twig){
        $this->twig = $twig;
    }

    public function showGenerationChoice(){
        echo $this->twig->render("gen_choice.html.twig");
    }

    public function getPokemonsFromAPI($gen){
        $pokemonsData = file_get_contents("https://pokebuildapi.fr/api/v1/pokemon/generation/$gen");
        $pokemons = json_decode($pokemonsData);

        echo $this->twig->render("pokedex.html.twig", ["pokemons"=> $pokemons, "gen"=>$gen]);
    }

    public function getPokemonDetails($id) {
        $pokemonData = file_get_contents("https://pokebuildapi.fr/api/v1/pokemon/$id");
        echo $pokemonData;
    }

}