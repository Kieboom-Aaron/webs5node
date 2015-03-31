module.exports = function(){
	var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

	var enterySchema = new Schema({
		title : {type:String, required:true},
		description: {type:String},
		image: {type:String},
		points: {type:Number}
	});

	var battleSchema = new Schema({
		id : {type:Number, required:true, unique: true},
		name : {type: String, required: true, unique: true}
		enteries : [enterySchema]
	});

	var ratingSchema = new Schema({
		first : {type:Number, required:true},
		second : {type:Number, required:true},
		third : {type:Number}
	});
	var rankingSchema = new Schema({
		battleid : {type:Number, required:true}
		userid : {type:Number, required:true},
		rating : ratingSchema
	});
	var userSchema = new Schema({
		id : {type:Number, required:true, unique:true},
		name : {type:String, required:true, unique:true}
	})
	mongoose.model('Battle', battleSchema);
	mongoose.model('Ranking', rankingSchema);
	mongoose.model('User', userSchema);

	mongoose.connect('mongodb://localhost/battlerankdev1', function(err){
		if(err){
			console.log(err);
		}
	});
}