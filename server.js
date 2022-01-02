// import/access node package
const express = require('express');
// getting function that creates database
const Datastore = require('nedb');
// create web app hole package comes as function
const app = express(); 
// listening for people to connect
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server is listening on port ${PORT}");
});
//app.set('port', process.env.PORT || 3000);
//app.listen(3000, () => console.log('listening')); 
// host webpage
app.use(express.static('public'));
// read data recieved in json
app.use(express.json({}));

// database is going to sit in a local file on the server 
const database = new Datastore('database.db');
// load existing data from previous time server ran into memory
database.loadDatabase();
// clear database
database.remove({ }, { multi: true }, function (err, numRemoved) {
  database.loadDatabase(function (err) {
    // done
  });
});

// set up route: expecting post request
var numOfMess = 0;
var number = 0;

app.post('/send', (request,response) => {
	numOfMess++;
	console.log('got a request');
	const data = request.body;
	// insert timestamp
	const timestamp = Date.now();	
	data.timestamp = timestamp; 
	// insert data into database
	data._id = numOfMess;
	console.log(data);
	database.insert(data);
	response.json(data);
});

app.get('/poll', (request, response) => {
	console.log('numOfMessages: ' + numOfMess);
	const headers = request.headers;

	number = headers.clientnum; 

	console.log(typeof number);
	console.log(parseInt(number));
	
	database.find({_id: {$gt: parseInt(number)}}, (err,data) => {
		//console.log('inside find callback');
		if (err) {
			console.log('error');
			response.end();
			return;
		}
 		//console.log('new data sent: ' + data._id);
		response.json(data);
		/*if (data.length != 0) {
			lastPollID = data._id;
		}*/
	});
	//console.log('find callback over');
});

