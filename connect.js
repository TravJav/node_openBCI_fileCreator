var net = require('net');
const Buffer = require('buffer').Buffer;
var json = require('json');
const _ = require('lodash');
const Ganglion = require('openbci-ganglion').Ganglion;
const ganglion = new Ganglion();
const PORT = 8500;




var server = net.createServer(function (socket) {
	//console.log(' \n CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
	ganglion.searchStart(); // start device search with ble

       pass_data(socket);

});

server.listen(8656, '127.0.0.1');

server.on('listening',function(){
    console.log('Server Is Running');
});






ganglion.once('ganglionFound', (peripheral) => {
	// Stop searching for BLE devices once a ganglion is found.
	 // start searching for the ganglion
	ganglion.searchStop();
	/*
	Use throttle to control the sample rate curently set for .2 of a second
	*/
	ganglion.on('sample', _.throttle(sample => {
		/** Work with sample */


		const transferdata = [];// array to hold our data 
		for (let i = 0; i < ganglion.numberOfChannels(); i++) {
			GanglionObjects = sample.channelData[i].toFixed(8);
			transferdata.push(GanglionObjects);

		}

		pass_data(transferdata);
	}, 200, { leading: true })) /// .2 of a second


	ganglion.once('ready', () => {
		ganglion.streamStart();
	});

	ganglion.connect(peripheral);

});





/*
Function to actually pass our data to the client side in C++

*/
function pass_data(transferdata, socket) {

		console.log(transferdata)
		var hardware_data = JSON.stringify(transferdata) // we need  put the data in JSON first 
		socket.write(hardware_data); // send the data out in the socket itself
		socket.pipe(socket);
	
}






