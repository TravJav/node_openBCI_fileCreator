var net = require('net');
const Buffer = require('buffer').Buffer;
var json = require('json');
const _ = require('lodash');
const Ganglion = require('openbci-ganglion').Ganglion;
const ganglion = new  Ganglion();


// fix this to make socket global
var server = net.createServer(function (socket) {
	console.log(' \n CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
  ganglion.searchStart(); // start searching for the ganglion
  console.log("Finished Searching For BLE");

});


/*
Once the device has been found

*/ 

ganglion.once('ganglionFound', (peripheral) => {
	// Stop searching for BLE devices once a ganglion is found.
	ganglion.searchStop();
	
	
	/*
	Use throttle to control the sample rate
	*/
	ganglion.on('sample', _.throttle(sample => {
	/** Work with sample */
	
	
	const transferdata = [];
		for (let i = 0; i < ganglion.numberOfChannels(); i++) {
			GanglionObjects = sample.channelData[i].toFixed(8);
			transferdata.push(GanglionObjects);
		   
		}
	
		pass_data(transferdata);    
	  }, 200, {leading:true}))
		
	
	
	
	ganglion.once('ready', () => {
	  ganglion.streamStart();
	  });
	
	  ganglion.connect(peripheral);
	
	});






	function pass_data(transferdata){
		

		var hardware_data = JSON.stringify(transferdata)
		socket.write(hardware_data);
		socket.pipe(socket);
		
		}









// Listen for client C++ Ganglion application
server.listen(6003, '127.0.0.1');