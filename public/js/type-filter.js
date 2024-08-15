document.addEventListener('DOMContentLoaded', () => {
    const typeFilter = document.getElementById('typeFilter');

    fetch('https://pokebuildapi.fr/api/v1/types')
        .then(response => response.json())
        .then(types => {
            types.sort((a, b) => a.name.localeCompare(b.name));

            types.forEach(type => {

                const option = document.createElement('option');
                option.value = type.name;
                option.innerHTML = `<img src="${type.image}" alt="${type.name}"> ${type.name}`;
                typeFilter.appendChild(option);
            });
        });

    const pokemonCards = document.querySelectorAll('.pokemon-card');
    let filteredPokemonCards = Array.from(pokemonCards);

    typeFilter.addEventListener('change', () => {
        const selectedType = typeFilter.value;
        filteredPokemonCards = Array.from(pokemonCards).filter(card => {
            const pokemonTypes = card.getAttribute('data-types').split(', ');
            return selectedType === '' || pokemonTypes.includes(selectedType);
        });

        pokemonCards.forEach(card => {
            card.style.display = filteredPokemonCards.includes(card) ? 'block' : 'none';
        });
    });

    function showPokemonDetails(pokemonId) {
        fetch(`/pokemon/${pokemonId}`)
            .then(response => response.json())
            .then(data => {
                const modal = document.getElementById('pokemonModal');
                const pokemonDetails = document.getElementById('pokemonDetails');
                pokemonDetails.innerHTML = '';

                const addPokemon = document.createElement("span")
                addPokemon.textContent = "Ajouter"
                addPokemon.className = "add-pokemon"

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

                pokemonDetails.appendChild(addPokemon);
                pokemonDetails.appendChild(namePokemon);
                pokemonDetails.appendChild(imagePokemon);
                pokemonDetails.appendChild(previousBtn);
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

                previousBtn.addEventListener('click', () => navigatePokemon(data.id, -1));
                nextBtn.addEventListener('click', () => navigatePokemon(data.id, 1));
            });
    }

    function navigatePokemon(currentPokemonId, direction) {
        const currentIndex = filteredPokemonCards.findIndex(card => card.getAttribute('data-id') == currentPokemonId);
        const newIndex = (currentIndex + direction + filteredPokemonCards.length) % filteredPokemonCards.length;
        const newPokemonId = filteredPokemonCards[newIndex].getAttribute('data-id');
        showPokemonDetails(newPokemonId);
    }

    pokemonCards.forEach(card => {
        card.addEventListener('click', event => {
            event.preventDefault();
            const pokemonId = card.getAttribute('data-id');
            showPokemonDetails(pokemonId);
        });
    });
});
