var PROTO_PATH = __dirname + '/../../protos/helloworld.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

const axios = require('axios'); 
const { join } = require('lodash');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;
let tiempos= [];
async function sayHello(call, callback) {
  
  const num = call.request.name;
  const inicio = new Date();
  let respuesta = await
  fetch(`https://pokeapi.co/api/v2/pokemon/${num}`);
  let pokemon = await respuesta.json()
  const fin = new Date();
  const tiempoConsulta = fin - inicio;
  tiempos.push(tiempoConsulta)
  callback(null, {message:  pokemon.name+" "+pokemon.id+" "+pokemon.types.map(tipo => tipo.type.name).join(',')+" ms "+(tiempoConsulta)});

  fs.writeFile('tiempos.txt', tiempos.join('\n'), (err) =>{
    if(err) throw err;
    console.log('Los tiempos de consulta han sido guardados en el archivo tiempos.txt')
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {sayHello: sayHello}); 
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();