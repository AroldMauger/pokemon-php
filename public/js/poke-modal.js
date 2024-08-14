document.addEventListener('DOMContentLoaded', () => {
    const pokemonCards = document.querySelectorAll(".pokemon-card");
    let currentPokemonId = null;
    let pokemonIds = Array.from(pokemonCards).map(card => card.getAttribute('data-id'));

    const showPokemonDetails = (pokemonId) => {
        fetch(`/pokemon/${pokemonId}`)
            .then(response => response.json())
            .then(data => {
                const modal = document.getElementById('pokemonModal');
                const pokemonDetails = document.getElementById('pokemonDetails');
                pokemonDetails.innerHTML = '';

                currentPokemonId = pokemonId;

                const namePokemon = document.createElement('h2');
                namePokemon.textContent = data.name;
                namePokemon.className = "name-pokemon-modal";

                const imagePokemon = document.createElement("img");
                imagePokemon.src = data.image;
                imagePokemon.alt = data.name;

                const previousBtn = document.createElement("p");
                previousBtn.textContent = "<";
                previousBtn.className = "previous-btn";

                const nextBtn = document.createElement("p");
                nextBtn.textContent = ">";
                nextBtn.className = "next-btn";

                pokemonDetails.appendChild(previousBtn);
                pokemonDetails.appendChild(namePokemon);
                pokemonDetails.appendChild(imagePokemon);
                pokemonDetails.appendChild(nextBtn);

                const typesOfThePokemon = document.createElement("div");
                typesOfThePokemon.className = "types-container";
                pokemonDetails.appendChild(typesOfThePokemon);

                data.apiTypes.forEach(type => {
                    const typeContainer = document.createElement("div");
                    typeContainer.className = "type-container";

                    const typeName = document.createElement("p");
                    typeName.textContent = type.name;
                    typeName.className = "type-name";
                    typeContainer.appendChild(typeName);

                    const typeImage = document.createElement("img");
                    typeImage.src = type.image;
                    typeImage.className = "type-image";
                    typeContainer.appendChild(typeImage);

                    typesOfThePokemon.appendChild(typeContainer);
                });

                modal.style.display = 'flex';

                const closeButton = document.querySelector(".close-button");
                closeButton.addEventListener("click", () => {
                    modal.style.display = 'none';
                });

                previousBtn.addEventListener("click", () => {
                    const currentIndex = pokemonIds.indexOf(currentPokemonId);
                    const previousIndex = (currentIndex - 1 + pokemonIds.length) % pokemonIds.length;
                    showPokemonDetails(pokemonIds[previousIndex]);
                });

                nextBtn.addEventListener("click", () => {
                    const currentIndex = pokemonIds.indexOf(currentPokemonId);
                    const nextIndex = (currentIndex + 1) % pokemonIds.length;
                    showPokemonDetails(pokemonIds[nextIndex]);
                });
            });
    };

    pokemonCards.forEach(card => {
        card.addEventListener('click', event => {
            event.preventDefault();
            const pokemonId = card.getAttribute('data-id');
            showPokemonDetails(pokemonId);
        });
    });
});
