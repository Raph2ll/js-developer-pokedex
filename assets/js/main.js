const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}" >
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <button onclick="showPokemonModal(${pokemon.number})">
                Details
            </button>
            <img src="${pokemon.photo}"
                alt="${pokemon.name}">
        </div>
    </li>
    `
}

function createPokemonModal(pokemon) {
    // Cria um novo elemento div para o modal
    const modal = document.createElement('div');
    modal.classList.add('pokemon-modal', pokemon.type);
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '1em';
    modal.style.borderRadius = '8px';
    modal.style.zIndex = '1001';

    // Cria uma lista de stats
    const statList = pokemon.stats.map(stat => `
 <li class="stat">
     <span class="stat-name">${stat.stat.name}</span>
     <span class="stat-value">${stat.base_stat}</span>
 </li>
`).join('');

    // Define o innerHTML do modal
    modal.innerHTML = `
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        
        <span class="stat-name">${pokemon.stats[0]}</span>

        <div class="detail">
        
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <ul class="stats">
                ${statList}
            </ul>
        </div> 
    `;

    // Cria um novo elemento div para a máscara
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    mask.style.zIndex = '1000';

    // Adiciona um evento de clique para remover o modal e a máscara quando a máscara for clicada
    mask.addEventListener('click', () => {
        modal.remove();
        mask.remove();
    });

    // Adiciona o modal e a máscara ao body
    document.body.appendChild(mask);
    document.body.appendChild(modal);
}

function showPokemonModal(number) {
    let url = `https://pokeapi.co/api/v2/pokemon/${number}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // Cria um objeto pokemon com as propriedades necessárias
            const pokemon = {
                number: data.id,
                name: data.name,
                photo: data.sprites.front_default,
                types: data.types.map(t => t.type.name),
                stats: data.stats,
            };

            // Cria o modal e adiciona ao body
            const modal = createPokemonModal(pokemon);
            document.body.appendChild(modal);
        })
        .catch((error) => console.log(error));
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})