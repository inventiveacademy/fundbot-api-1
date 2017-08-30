'use strict';
/*
Below, we're requiring everything we'll use in our application.
🐱 Restify, to statisfy project requirements and because "it's the future"
🐱 Actually creating our server instance
🐱 Adding jsonParser/body-parser to read the incoming requests off the body
🐱 Adding mongoose
🐱 Requiring our Applicant schema from Mongoose, see 'models.js'
*/
let restify = require('restify');
let server = restify.createServer();
let jsonParser = require("body-parser").json;
let mongoose = require("mongoose");
let Applicant = require("./models").Applicant;
/*
🐔 Calling the jsonParser/body-parser
*/
server.use(jsonParser());
/*
🙉 Connecting with mongoose to our mlab database
*/
mongoose.connect('mongodb://scottie.schneider:speje33ma*@ds161493.mlab.com:61493/fundbot-whiterabbit');
let db = mongoose.connection;
/*
🔔Mongo error handler🔔
*/
db.on("error", function(error){
	console.log(`Oh noes! connection error ${error}`);
});
/*
😎Event listener for mongodb, logging statement on successful connection to the db
*/
db.once("open", function(){
	console.log('The database connection is successful!');
});

/*
POST route, for creating new appliant documents in our database.
*/
server.post('/', function(req, res, next){
	var applicant = new Applicant(req.body);
	applicant.save(function(err, question){
		if(err) return next(err);
		res.status(201);
		res.json(applicant);
	});
});
/*
GET route, for TESTING. Needs refactoring.
*/
server.get('/:name', function(req, res,next){
	res.send(`Hello, ${req.params.name}`);
	next();
});

server.listen(3001, function(){
	console.log(`Server listening at port 3001`);
})
