
var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var chatSchema = new Schema({

	creator  			: {type:String,default:'',required:true},
	content  			: {type:String,default:'',required:true},
	createdOn	  		: {type:Date,required:true},
	
});

mongoose.model('Chat',chatSchema);