'use strict';
// require mongoose
let mongoose = require("mongoose");
// store the schema constructor as a local variable
let Schema = mongoose.Schema;
// create an AnswerSchema 
let AnswerSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	votes: {type: Number, default: 0}
});
// create a question schema
let QuestionSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	answers: [AnswerSchema]
});

// create the model
let Question = mongoose.model("Question", QuestionSchema);

// export
module.exports.Question = Question;
