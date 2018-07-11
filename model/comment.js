
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;
//create new instance of the mongoose.schema. the schema takes an 
//object that shows the shape of your database entries.
var CommentSchema = new Schema({
   
    // post_id: { type: Schema.Types.ObjectId},
        timestamp : {type : Date},
        comment : {type : String},
        commenter : {type : String}
    
     

}, {versionKey: false});


//CommentSchema.index({psot_id: 1, timestamp: 1}, {unique: true});
//export our module to use in server.js
module.exports = mongoose.model('Comments', CommentSchema);
