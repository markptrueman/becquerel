var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Posts = require('../model/posts')
var CuratorLevels = require('../model/curatorlevels');
var rp = require('request-promise-native');
var moment = require('moment');
var util = require('../modules/util');
var mongoose = require('mongoose');



var err = function(error, resp) {
    resp.json(JSON.stringify(error));
}

var validateAuth = function(perm) {
    return function(req, res, next) {
        // console.log(JSON.parse(req.token));

        // return next();

        var ret = util.isAuthenticated(req, res, next, perm);

    }
}


router.get('/allusers', validateAuth(['administrator', 'accounter']), function(req, res, next) {
   // console.log("getting all users");


    User.find({}).sort({"user" : 'asc'}).exec(function(err, users) {
      

        if (err) {
            console.log(err);
            res.send(err);
        } else {
            //responds with a json object of our database comments.
            //console.log(users);
            res.json(users);
        }

    });
});

router.get('/userstats/:user', validateAuth(['curator']), function(req, res, next) {
    var user = req.params.user;

    console.log("getting  stats for user " + user);

    let sundayTemp = moment().utc().startOf('week');
    // if this sundaytemp is today and we are still before 1500 UTC, take 7 days off
    if (sundayTemp.isSame(moment().utc(), 'day'))
    {
        console.log ("its sunday");
    
        if (moment().utc().isBefore(moment('15:00Z', 'HH:mmZ'), 'hour')){
            sundayTemp = sundayTemp.subtract(7, 'days');
        } 
    }
    let time = "15:00Z"
    let date = sundayTemp.format("YYYY-MM-DD");
    let sunday = moment(date + 'T' + time);

    Posts.find({ $and : [{ "submittedtime": { $gte: sunday.utc() } }, {"curator" : user}]}, function(err, posts) {
      

        if (err) {
            console.log(err);
            res.send(err);
        } else {
            //responds with a json object of our database comments.
            // build a json with the stats for the user
            // eg
            // { approved : 5, rejected : 2, queued : 1, closed : 1, cs : 3, ar : 70}
            let app = 0;
            let rejected = 0;
            let queued = 0;
            let closed = 0;
            for (var i = 0; i < posts.length; i++)
            {
                let post = posts[i];
                if (post.approved)
                    app++;
                else if (post.rejected)
                    rejected++;
                else if (post.closed)
                    closed++;
                else 
                    queued++;
                
                
            }

            let ar = (parseFloat(app) / (parseFloat(app) + parseFloat(rejected))).toFixed(4);
            let cs = ((ar * ar) * parseFloat(app)).toFixed(2);
            cs = isNaN(cs) ? 0 : cs;
            ar = isNaN(ar) ? 1 : ar;

            let response = {"approved" : app, "rejected" : rejected, "queued" : queued, "closed" : closed, "cs" : cs, "ar" : (ar*100)}

            res.json(response);
        }

    });
});

router.get('/levels', function(req, res, next) {
   // console.log("getting all user levels");


    CuratorLevels.find({}, function(err, levels) {
      //  console.log("found user levels");

        if (err) {
            // console.log(err);
            res.send(err);
        } else {
            //responds with a json object of our database comments.
           // console.log(levels);
            res.json(levels);
        }

    });
});

router.post('/level', validateAuth(['administrator']), function(req, res, next) {
    // console.log("getting all user levels");
    var level = req.body;
    console.log("Router to save level " + JSON.stringify(level));

     var id = level._id;
    if (level.newlevel) {
        id = new mongoose.mongo.ObjectID();
        delete level.newlevel;
    }
    delete level._id;

    CuratorLevels.update({ _id: id }, level, { upsert: true, setDefaultsOnInsert: true }, function(err) {
        if (err) {
            console.log(err);
            res.json({ err: 'Unable to save level :' + err.message });
        } else {
            res.json({ response: 'Level ' + level.description + ' saved' });
        }

    });

 });

router.post('/update', validateAuth(['administrator','accounter']), function(req, res, next) {
    console.log("in post")
    var user = req.body;
    console.log("Router to save user " + JSON.stringify(user));



    var id = user._id;
    if (user.newuser) {
        id = new mongoose.mongo.ObjectID();
        delete user.newuser;
    }
    delete user._id;

    User.update({ _id: id }, user, { upsert: true, setDefaultsOnInsert: true }, function(err) {
        if (err) {
            console.log(err);
            res.json({ err: 'Unable to save user :' + err.message });
        } else {
            res.json({ response: 'User ' + user.user + ' saved' });
        }

    });




});

router.post('/level/delete',  validateAuth(['administrator']),function(req, res, next) {
   
    var description = req.body.description;
    var id = req.body._id;
    console.log("Router to delete level " + description + " : " + id);
    CuratorLevels.findByIdAndRemove({ _id: new mongoose.mongo.ObjectID(id) }, function(err) {
        if (err) {
            console.log("ERROR " + JSON.stringify(err));

            console.log(err.message);
            res.send({ err: 'Unable to delete level :' + err.message });

        } else {
            console.log("level " + description + " deleted")
            res.json({ response: 'Level ' + description + ' deleted' });
        }

    }


    )
});


router.post('/delete',  validateAuth(['administrator']),function(req, res, next) {
    console.log("in post - " + req.body.user)
    var username = req.body.user;
    var id = req.body._id;
    console.log("Router to delete user " + username + " : " + id);
    User.findByIdAndRemove({ _id: new mongoose.mongo.ObjectID(id) }, function(err) {
        if (err) {
            console.log("ERROR " + JSON.stringify(err));

            console.log(err.message);
            res.send({ err: 'Unable to delete user :' + err.message });

        } else {
            console.log("username " + username + " deleted")
            res.json({ response: 'User ' + username + ' deleted' });
        }

    }


    )
});




module.exports = router;