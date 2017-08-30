'use strict';
// require all the things
let restify = require('restify');
let server = restify.createServer();
let jsonParser = require("body-parser").json;
let logger = require("morgan");
let mongoose = require("mongoose");
let Applicant = require("./models").Applicant;

// use the things
server.use(logger("dev"));
server.use(jsonParser());

mongoose.connect('mongodb://scottie.schneider:speje33ma*@ds161493.mlab.com:61493/fundbot-whiterabbit');
let db = mongoose.connection;

db.on("error", function(error){
		console.log(`Oh noes! connection error ${error}`);
	});
db.once("open", function(){
	console.log('The database connection is successful!');
	});
// POST /applicant
// Route for creating new applicants
server.post('/', function(req, res, next){
	var applicant = new Applicant(req.body);
	applicant.save(function(err, question){
		if(err) return next(err);
		res.status(201);
		res.json(applicant);
	});
});

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
