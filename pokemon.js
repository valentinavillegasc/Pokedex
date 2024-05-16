const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
  });

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
        response.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(
        (response) => response.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("failed to fetch pokemon data before redirect");
  }
}

function displayPokemons(pokemon) {
  listWrapper.innerHTML = "";
  pokemon.forEach((pokemon) => {
    const pokemonId = pokemon.url.split("/")[6]; //after the 6 slash
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
    <div class="number-wrap">
    <p class="caption-fonts"> #${pokemonId} </p>
    </div>
    <div class="imp-wrap">
    <img src="http://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemon.name}" />
    </div>
    <div class="name-wrap">
    <p class="body3-fonts"> #${pokemon.name} </p>
    </div>
    `;
    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonDataBeforeRedirect(pokemonId);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonId}`;
      }
    });
    listWrapper.appendChild(listItem);
  });
}

//Search pokemons

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  let filteredPokemons;

  if (numberFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) => {
      const pokemonId = pokemon.url.split("/")[6];
      return pokemonId.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

//Clear search
const closeButton = document.querySelector(".search-close-icon");

closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}
