'use strict';
// require mongoose
var mongoose = require("mongoose");
// store the schema constructor as a local variable
var Schema = mongoose.Schema;
// create an AnswerSchema 
var ApplicantSchema = new Schema({
	id: Number,
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

// create the model
var Applicants = mongoose.model("Applicants", ApplicantSchema);

// export
module.exports.Applicants = Applicants;
