module.exports = function(){
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

	var enterySchema = new Schema({
		id : {type:Number, required:true, unique: true},
		title : {type:String, required:true},
		description: {type:String},
		image: {type:String, required:true},
		points: {type:Number, min:0}
	});

	var battleSchema = new Schema({
		id : {type:Number, required:true, unique: true},
		name : {type: String, required: true},
		owner : {type: String},
		enteries : [enterySchema]
	});

	var rankingSchema = new Schema({
		battleid : {type:Number, required:true},
		userid : {type:String, required:true},
		rating : {
			first : {type:Number, required:true},
			second : {type:Number, required:true},
			third : {type:Number}
		}
	});
	var userSchema = new Schema({
		//id : {type:Number, required:true, unique:true},
		//name : {type:String, required:true, unique:true},
		//TODO: naam uit google id halen.
		googleId : {type:String, required:true, unique:true}
	});
	mongoose.model('Battles', battleSchema);
	mongoose.model('Rankings', rankingSchema);
	mongoose.model('Users', userSchema);

	mongoose.connect('mongodb://dev:defcon1@ds059471.mongolab.com:59471/battlerankdev1', function(err){
		if(err){
			console.log(err);
		}
	});
}