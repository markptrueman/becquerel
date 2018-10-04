var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../model/user');
var steem = require('steem');
var Post = require('../model/posts');

module.exports.getCurieVp = async () => {
    let vpow = await getvotingpower("curie");
    return vpow;
}

function getvotingpower(account_name, callback) {
    return new Promise(resolve => {
        steem.api.getAccounts([account_name], function (err, account) {

            account = account[0];

            const totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares) - parseFloat(account.vesting_withdraw_rate);

            const elapsed = Math.floor(Date.now() / 1000) - account.voting_manabar.last_update_time;
            const maxMana = totalShares * 1000000;
            // 432000 sec = 5 days
            let currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;

            if (currentMana > maxMana) {
                currentMana = maxMana;
            }

            const currentManaPerc = (currentMana * 100 / maxMana).toFixed(2);

            return resolve(currentManaPerc);
        });
    });
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
   // console.log("isAuthenticated :" + permission);

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
                    // check the database to ensure that this user has still got permission
                     let res =  await User.find({ 'user': token.user, 'curator': true })
                        
                    if (res.length > 0) {
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