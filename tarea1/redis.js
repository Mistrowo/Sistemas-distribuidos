const fs = require('fs');
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
    let ttl;
    if (id <= 299) {
      redisInstance = redis1;
      ttl = 3600; // 1 hour TTL for pokemon <= 299
    } else if (id <= 598) {
      redisInstance = redis2;
      ttl = 1800; // 30 minutes TTL for pokemon <= 598
    } else {
      redisInstance = redis3;
      ttl = 900; // 15 minutes TTL for pokemon > 598
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
      await redisInstance.set(`pokemon:${id}`, pokemonString, 'EX', ttl);
     
    }
    return pokemon;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

async function llamadas(n) {
  const hola = [];
  
  for (let i = 0; i < n; i++) {
    console.log(`Consulta ${i + 1}:`);
    const id = Math.floor(Math.random() * 898) + 1;
    const inicio = Date.now();
    const pokemon = await buscar(id);
    const fin = Date.now();
    const tiempofinal=fin-inicio
    hola.push(tiempofinal)
    console.log(`Nombre: ${pokemon.name}`);
    console.log(`Número de la Pokédex: ${pokemon.id}`);
    console.log(`Tipos: ${pokemon.types.join(', ')}`);
    console.log(`Tiempo de consulta: ${fin - inicio} ms`);
    
    console.log('--------------');
  }
  fs.writeFile('tiemposredis.txt', hola.join('\n'), (err) => {
    if (err) throw err;
    console.log('Los tiempos de consulta han sido guardados en el archivo tiempos.txt');
  });
}

const consultas = 200;
llamadas(consultas)
  .catch(error => {
    console.error('Error al realizar consultas', error);
  });
