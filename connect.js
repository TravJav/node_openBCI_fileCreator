var fs = require('file-system');
var fs = require('fs');
var json = require('json');
var prompt = require('prompt');
const Ganglion = require('openbci-ganglion').Ganglion;
const ganglion = new Ganglion();


var FILENAME = "/Users/travishaycock/Desktop/exam.csv";



		
	ganglion.searchStart(); // start device search with ble
	ganglion.once('ganglionFound', (peripheral) => {
		// Stop searching for BLE devices once a ganglion is found.
		// start searching for the ganglion
		ganglion.searchStop();
		/*
		Use throttle to control the sample rate curently set for .2 of a second
		*/
		ganglion.on('sample', (sample => {
			/** Work with sample */


			const transferdata = [];// array to hold our data 
			for (let i = 0; i < ganglion.numberOfChannels(); i++) {
				GanglionObjects = sample.channelData[i].toFixed(8);
				transferdata.push(GanglionObjects);

			}


			console.log(transferdata)
			fs.appendFileSync(FILENAME, transferdata);




		}));


		ganglion.once('ready', () => {
			ganglion.streamStart();
		});

		ganglion.connect(peripheral);

	});


