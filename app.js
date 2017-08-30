'use strict';
// require all the things
let restify = require('restify');
let server = restify.createServer();
let jsonParser = require("body-parser").json;
let logger = require("morgan");
let mongoose = require("mongoose");
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
	let StudentSchema = new Schema({
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
	let Student = mongoose.model("Student", StudentSchema);
	// create a document
	let student1 = new Student({
		firstName: "Laurence",
		middleName: "Peabody",
		lastName: "Herman",
		contactPhone: 5650988383,
		email: "hermanpeabodythethird@yahoo.com",
		address: "50 herman way",
		zip: 26593,
		city: "Austin",
		state: "Texas", 
	});
	// save
	student1.save(function(err) {
		if(err) console.error("save failed oh noes!", err);
		else console.log("Saved!");
		db.close(function(){
			console.log("db connection closed");
		});
	});
});


// use the things
server.use(logger("dev"));
server.use(jsonParser());

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
