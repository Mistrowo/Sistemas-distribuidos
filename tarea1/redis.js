const axios = require('axios');
const Redis = require('ioredis');

const redis1 = new Redis({
  port: 6379,
  host: 'localhost'
});

const redis2 = new Redis({
  port: 6380,
  host: 'localhost'
});

const redis3 = new Redis({
  port: 6381,
  host: 'localhost'
});

async function buscar(id) {
  try {
    let pokemon;
    let redisInstance;
    if (id <= 299) {
      redisInstance = redis1;
    } else if (id <= 598) {
      redisInstance = redis2;
    } else {
      redisInstance = redis3;
    }
    const cachedPokemon = await redisInstance.get(`pokemon:${id}`);
    if (cachedPokemon) {
      console.log(`Encontrado en cache redis ${id} en la instancia ${redisInstance.options.port}`);
      pokemon = JSON.parse(cachedPokemon);
    } else {
      console.log(`Cache miss for ${id}`);
      const respuesta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      pokemon = {
        name: respuesta.data.name,
        id: respuesta.data.id,
        types: respuesta.data.types.map(tipo => tipo.type.name)
      };
      const pokemonString = JSON.stringify(pokemon);
      await redisInstance.set(`pokemon:${id}`, pokemonString);
    }
    return pokemon;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

async function llamadas(n) {
  for (let i = 0; i < n; i++) {
    console.log(`Consulta ${i + 1}:`);
    const id = Math.floor(Math.random() * 898) + 1;
    const inicio = new Date();
    const pokemon = await buscar(id);
    const fin = new Date();
    console.log(`Nombre: ${pokemon.name}`);
    console.log(`Número de la Pokédex: ${pokemon.id}`);
    console.log(`Tipos: ${pokemon.types.join(', ')}`);
    console.log(`Tiempo de consulta: ${fin - inicio} ms`);
    console.log('--------------');
  }
}

const consultas = 200; 
llamadas(consultas)
  .catch(error => {
    console.error('Error al realizar consultas', error);
  });