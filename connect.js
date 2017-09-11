var net = require('net');
const Buffer = require('buffer').Buffer;
var json = require('json');

var server = net.createServer(function (socket) {
	console.log(' \n CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
	



	var obj = { "name":"John", "age":30, "city":"New York"};
	var myJSON = JSON.stringify(obj)
	socket.write(myJSON);
	socket.pipe(socket);
});

server.listen(6008, '127.0.0.1');