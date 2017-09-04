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
let mongoose = require("mongoose");
let Applicants = require("./models").Applicants;
let plugins = require("restify").plugins;
let session = require('express-session');
/*
returns a server object, by calling the createServer() function
*/ 
let server = restify.createServer();
/*
🐔 Calling the jsonParser/body-parser
*/
// Use sessions for tracking logins
server.use(session({
	secret: 'scottie loves you',
	resave: true,
	saveUninitialized: false
}));
/*
Uses cors middleware
*/

var corsMiddleware = require('restify-cors-middleware');
// *** To get started type corsproxy in the terminal

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  //origins: ['http://localhost'],
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.use(cors.actual);


server.use(plugins.queryParser()); 
server.use(plugins.bodyParser());

/*
🙉 Connecting with mongoose to our mlab database
*/
mongoose.connect('mongodb://scottie.schneider:speje33ma*@ds161493.mlab.com:61493/fundbot-whiterabbit');
let db = mongoose.connection;
/*
🔔 Mongo error handler 🔔
*/
let idCounter = 0;

db.on("error", function(error){
	console.log(`Oh noes! connection error ${error}`);
});

/*
😎Event listener for mongodb, logging statement on successful connection to the db
*/
db.once("open", function(){
	console.log('The database connection is successful!');
});

//register post route for express portal form
server.post('/', async (req, res, next) => {
	const applicant = new Applicants(req.body);
	await applicant.save();
	console.log(req.body);
	// We don't have the _id yet... so let's build a method to get it
	Applicants.idFinder(req.body.email, function(data){
		console.log(`Working on getting the document ID which is ${data._id}`);
		req.session.userId = data._id;
		res.send('success')
	})
	//req.session.userId = req.body._id;
	//res.send('ok');
})
/*
POST route, user authentication and login.
*/
server.post('/login',  (req, res, next) => {
	console.log(`${req.body.password} ${req.body.email}`);
	Applicants.authenticate(req.body.email, req.body.password, function(data){
		console.log(`data is ${data}`);
		if(data){
			console.log(`We're in the authenticate function, true ${data._id}`);
			req.session.userId = data._id;
			res.send('success');
		}else{
			res.statusCode = 403;
			res.send('not ok');	
		}
	});

})

/*
GET for all documents
Applicants refers to the model created in models.js
*/
server.get("/applicants", function(req, res, next){
	Applicants.find({}, function(err, applicants){
		if(err) return next(err);
		res.send(applicants);
	});
})
/*
GET - find one
*/

server.get("/applicant/:id", function(req, res, next){
	Applicants.findOne({ id: req.params.id}, function(err, applicant){
	if(applicant === null){
	// 🚫 TODO: Refactor to use error handling
		res.send('OH NOES! 😢 User does not exist');
		return next();
	}	
		res.send(applicant);
	});
});

/*
GET - find one - Query String
*/
server.get("/applicants/search", function(req, res, next){
	console.log(req.query.id);
});
/*
PUT - Updating a particular applicant 
*/
server.put("/applicant/:id", function(req, res, next) {
    Applicants.findOne({id: req.params.id}, function(err, applicant) {
        applicant.firstName = req.body.firstName;
        applicant.middleName = req.body.middleName;
       	applicant.lastName = req.body.lastName;
       	applicant.contactPhone = req.body.contactPhone;
       	applicant.email = req.body.email;
       	applicant.address = req.body.address;
       	applicant.zip = req.body.zip;
       	applicant.city = req.body.city;
       	applicant.state = req.body.state;

        applicant.save(function(err, question){
			if(err) return next(err);
		});
		res.send(applicant);
        //res.send(`You have found applicant ${req.params.id}`);
    });
    return next();
});

/*
REMOVE/DELETE
*/
server.del("applicant/:id", function(req, res, next){
	Applicants.findOne({id: req.params.id}, function(err, applicant){
		applicant.remove();
		console.log('Applicant removed');
	});
	return next();
});

// error handler
// define as the last app.use callback
server.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	})
})
/*
Given a port and a callback function, this will listen on a particular port for a connection.
*/
server.listen(3001, function(){
	console.log(`Server listening at port 3001`);
});

