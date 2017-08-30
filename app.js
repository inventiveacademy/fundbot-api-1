'use strict';
// require all the things
let restify = require('restify');
let server = restify.createServer();
let jsonParser = require("body-parser").json;
let logger = require("morgan");
let mongoose = require("mongoose");





	

//Inside a post 1) open a connection 2) reference the schema (student) 3) Pull the schema data from body 4) save it


// use the things
server.use(logger("dev"));
server.use(jsonParser());

server.post('/', function(req, res, next){
	mongoose.connect('mongodb://scottie.schneider:speje33ma*@ds161493.mlab.com:61493/fundbot-whiterabbit');
	// reference the connection object
	let db = mongoose.connection;
	db.on("error", function(error){
		console.log(`Oh noes! connection error ${error}`);
	});
	db.once("open", function(){
		console.log('The database connection is successful!');
		// All database communication goes here!
	
	
		// reference the schema constructor from the mongoose object
		let Schema = mongoose.Schema;
	
		// TODO: refactor this schema if we need to for different types (think form validation)
		let ApplicantSchema = new Schema({
			firstName: String,
			middleName: String,
			lastName: String,
			contactPhone: Number,
			email: String,
			address: String,
			zip: Number,
			city: String,
			state: String 
		});
		// create a model
		// BELOW, bring into post
		
		let Applicant = mongoose.model("Applicant", ApplicantSchema);
		// create a document
		let applicant1 = new Applicant({
			firstName: req.body.firstName,
			middleName: req.body.middleName,
			lastName: req.body.lastName,
			contactPhone: req.body.contactPhone,
			email: req.body.email,
			address: req.body.address,
			zip: req.body.zip,
			city: req.body.city,
			state: req.body.state 
		});
		// save
		applicant1.save(function(err) {
			if(err) console.error("save failed oh noes!", err);
			else console.log("Saved!");
			db.close(function(){
				console.log("db connection closed");
			});
		});
		
		console.log(req.body.firstName);
	});
	next();
})

server.get('/:name', function(req, res,next){
	res.send(`Hello, ${req.params.name}`);
	next();
})

// database test
server.post('/mango', function(req, res, next){

})
server.listen(3001, function(){
	console.log(`Server listening at port 3001`);
})
