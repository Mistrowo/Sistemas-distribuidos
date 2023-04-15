var PROTO_PATH = __dirname + '/../../protos/helloworld.proto';

var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function Random(min, max){ // funcion random para elegir pokemon
  return Math.floor(Math.random()* (max - min + 1)) + 1;
}

function main() {
  var argv = parseArgs(process.argv.slice(2), {
    string: 'target'
  });
  var target;
  if (argv.target) {
    target = argv.target;
  } else {
    target = 'localhost:50051';
  }
  var client = new hello_proto.Greeter(target,
                                       grpc.credentials.createInsecure());
  var user;
  if (argv._.length > 0) {
    user = argv._[0]; 
  } else {
    user = Random(1,898)/*'mundo'*/; // numero que se genera para hacer la peticion al server
  }
  client.sayHello({name: user}, function(err, response) {
    console.log('Greeting:', response.message);
  });
}

for(let i = 0; i<10;i++){
  main();
}

