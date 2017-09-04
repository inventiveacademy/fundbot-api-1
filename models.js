'use strict';
// require mongoose
var mongoose = require("mongoose");
// require bcrypt for password hashing
var bcrypt = require('bcrypt');
// store the schema constructor as a local variable
var Schema = mongoose.Schema;
// create an Applicant Schema 
var applicantSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	middleName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		required: true,
		trim: true 
	},
	contactPhone: {
		type: Number,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	address: {
		type: String,
		required: true,
	},
	zip: {
		type: Number,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	tags: [String] 
});
// authenticate user input against database documents
applicantSchema.statics.authenticate = function(email, password, callback){     
	var query = Applicants.findOne({'email': email});
	query.select('email password');
	query.exec(function(error, applicant){
		if(error){
			return callback(error);
		}else if(!applicant) {
			var err = new Error('User not found');
			err.status = 401;
			return callback(err);
		}
		console.log(`applicant is ${applicant}`);
		bcrypt.compare(password, applicant.password, function(error, result){
			if( result === true){
				callback(applicant);
			} else {
				callback();
			}
		})
	})
}
applicantSchema.statics.idFinder = function(email, callback){
	var query = Applicants.findOne({'email': email});
	query.select('email');
	query.exec(function(error, applicant){
		if(error){
			return callback(error);
		}
		callback(applicant);
	})
}
// Hash the password right before saving the applicant
applicantSchema.pre('save', function(next){
	var applicant = this;
	bcrypt.hash(applicant.password, 10, function(err, hash){
		if(err){
			return next(err);
		}
		applicant.password = hash;
		next();
	})
})

// create the model
var Applicants = mongoose.model("Applicants", applicantSchema);

// export
module.exports.Applicants = Applicants;

;