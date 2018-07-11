
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;
//create new instance of the mongoose.schema. the schema takes an 
//object that shows the shape of your database entries.
var CuratorLevelSchema = new Schema({
    level : {type :Number, index:true,unique : true },
    minutes: Number,
    limit : Number,
    description : String,

});



//export our module to use in server.js
module.exports = mongoose.model('CuratorLevel', CuratorLevelSchema);
