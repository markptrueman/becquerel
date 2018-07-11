
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var mongoosePaginate = require('mongoose-paginate');


var Schema = mongoose.Schema;
//create new instance of the mongoose.schema. the schema takes an 
//object that shows the shape of your database entries.
var PostSchema = new Schema({
    submittedtime : Date,
    url: {type :String, index:true,unique : true },
    comments: String,
    curator: String,
    approved : {type : Boolean, default : false},
    rejected : {type : Boolean, default : false},
    closed : {type : Boolean, default : false},
    reviewTime: Date,
    posttitle: String,
    postuser : String,
    posttime : Date,
    body : String,
    submitterComment:  String,
    reviewer : String,
    commentHistory : [
        {
            timestamp : {type : Date},
            comment : {type : String},
            commenter : {type : String}
        }
    ]

});

PostSchema.plugin(uniqueValidator);
PostSchema.plugin(mongoosePaginate);

//export our module to use in server.js
module.exports = mongoose.model('Post', PostSchema);
