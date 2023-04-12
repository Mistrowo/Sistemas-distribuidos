const axios = require('axios');


function Random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function buscar(num) {
  try {
    const respuesta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${num}`);
    const pokemon = respuesta.data;


    return pokemon;
  } catch (error) {
    
    console.error('Error', error);
    throw error;
  }
}


function dormir(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function llamadas(n) {
  for (let i = 0; i < n; i++) {
    console.log(`Consulta ${i + 1}:`);
    const num = Random(1, 898);
    const inicio = new Date();
    const pokemon = await buscar(num);
    const fin = new Date();
    console.log(`Nombre: ${pokemon.name}`);
    console.log(`Número de la Pokédex: ${pokemon.id}`);
    console.log(`Tipos: ${pokemon.types.map(tipo => tipo.type.name).join(', ')}`);
    console.log(`Tiempo de consulta: ${fin - inicio} ms`);
    console.log('----------------');
    //await dormir(1000); 
  }
}

async function guardarEnRedis(datos, redis) {
  const client = redis.createClient({ host: 'localhost', port: 6379 });
  client.set(`pokemon:${datos.id}`, JSON.stringify(datos));
  client.quit();
}



const consultas = 100; 
llamadas(consultas)
  .catch(error => {
    
    console.error('Error al realizar consultas', error);
  });
