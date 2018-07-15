var Steem =require('steem');
var express = require('express');
var router = express.Router();
var Post = require('../model/posts');
var businessLogic = require('../api/businessLogic')
var rp = require('request-promise-native');
var moment = require('moment');
var util = require('../modules/util');
var accountshelper = require('../modules/accountshelper')



Steem.api.setOptions({ url: 'https://api.steemit.com' });


var err = function(error, resp) {
    resp.json(JSON.stringify(error));
}

var validateAuth = function(perm)
{
    return function(req,res,next)
    {
        //console.log(JSON.parse(req.token));

       
 
         var ret = util.isAuthenticated(req, res, next, perm);
        
    }
}


router.post('/curator/:start/:end/:user', validateAuth(['accounter','administrator']), async function(req, res, next) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);
    var user = req.params.user; // could be null
    console.log("getting curator report between " + moment(start).utc().format() + " and " + moment(end).utc().format());
    let csv =  await accountshelper.generateReport(start, end, user);
    

    res.status(200).send(csv);
    
    
});

router.post('/curatordetailed/:start/:end/:user', validateAuth(['administrator']), async function(req, res, next) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);
    var user = req.params.user; // could be null
    console.log("getting curator detailedreport between " + moment(start).utc().format() + " and " + moment(end).utc().format());
    let csv =  await accountshelper.generateDetailedReport(start, end, user);
    

    res.status(200).send(csv);
    
    
});

router.post('/curatordetailedpersonal/:start/:end', validateAuth(['curator']), async function(req, res, next) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);
    var user = JSON.parse(req.token).user;
    console.log("getting curator personal detailedreport between " + moment(start).utc().format() + " and " + moment(end).utc().format());
    let csv =  await accountshelper.generateDetailedPersonalReport(start, end, user);
    

    res.status(200).send(csv);
    
    
});

router.post('/reviewer/:start/:end/', validateAuth(['administrator']), async function(req, res, next) {
    var start = Number(req.params.start);
    var end = Number(req.params.end);
    var user = req.params.user; // could be null
    console.log("getting curator report between " + moment(start).utc().format() + " and " + moment(end).utc().format());
    let csv =  await accountshelper.generateReviewerReport(start, end);
   
    res.status(200).send(csv);
   
    
});




module.exports = router;