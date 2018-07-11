var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../model/user');
var steem = require('steem');
var Post = require('../model/posts');

module.exports.getCurieVp = async () => {
    let result = await steem.api.getAccountsAsync(["curie"]); 
    var secondsago = (new Date - new Date(result[0].last_vote_time + "Z")) / 1000;
    var vpow = result[0].voting_power + (10000 * secondsago / 432000);
    vpow = Math.min(vpow / 100, 100).toFixed(2);
    return vpow;
}

module.exports.getQueueSize = async () => {
    let queue = await Post.find({ $and : [{"closed" : false}, {"rejected" : false} , {"approved": false}]});
    return queue.length;

}

module.exports.urlString = () => {
    let string = ''
    let allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++) {
        string += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return string;
}

module.exports.isAuthenticated = (req, res, next, permission) => {
    console.log("isAuthenticated :" + permission);

    var jsontoken = JSON.parse(req.token);

    // validate the token.user against the session user and then validate that the req.token.token is hashed correctly

    /// test invalid jsontoken
    // jsontoken.token = jsontoken.token + "as";

    jwt.verify(jsontoken.token, config.jwtsecret, async function(err, token) {
        if (err) {
            console.log(err);
            return res.status(401).send({ err: 'Failed to authenticate token.' });
        } else {
            // check curator perms
            if (permission.includes("curator")) {
                if (token.curator === true) {
                    console.log("valid curator " + token.user);
                    // check the database to ensure that this user has still got permission
                     let res =  await User.find({ 'user': token.user, 'curator': true })
                        
                    if (res.length > 0) {
                        console.log("found the user in the database and has persmission")
                        return next();
                    }
                    

                }
            }
            if (permission.includes("reviewer")) {
                if (token.reviewer === true) {
                    let res =  await User.find({ 'user': token.user, 'reviewer': true });
                    if (res.length > 0) {
                        return next();
                    }
                   
                }
            }
            if (permission.includes("administrator")) {
                if (token.administrator === true) {
                   let res = await User.find({ 'user': token.user, 'administrator': true });
                    if (res.length > 0) {
                        return next();
                    }
                }

                
            }
            if (permission.includes("accounter")) {
                if (token.accounter === true) {
                    let res =  await User.find({ 'user': token.user, 'accounter': true });
                    if (res.length > 0) {
                        return next();
                    }
                   

                }
            }
            return res.status(401).send({ err: 'Failed to authenticate token.' });;

            // }
        }
    });
}