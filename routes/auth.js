var steemconnect = require('../modules/steemconnect')
var express = require('express');
var router = express.Router();
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var request = require('request');


/* GET auth listing. */
// this is the generic call to get authorised with steemconnect
router.post('/', (req, res, next) => {
    console.log("auth called server side");
    if (!req.token ) {
        // you havent got an access token but you might already be authed with  steemconnect

        console.log("no access token sent - redirecting to steemconnect");
        let uri = steemconnect.getLoginURL();
        console.log(uri);
        res.redirect(uri);
    } else {
        // this is called once the user has received their access token

        // this is where we wrap up the steemconnect access token with our own authorization token 
        // which determines what access the user has on the UI

        steemconnect.setAccessToken(req.token);
        steemconnect.me((err, steemResponse) => {
            if (err)
            {
                console.log(err);
            }
            else {

            
                console.log("Steemresponse = " + JSON.stringify(steemResponse));

                var username = steemResponse.user;
                User.find({'user' : username}, function(err, obj)
                {
                    
                    var data = JSON.parse(JSON.stringify(obj));
                    if (data) {
                        if (data[0])
                        {
                            var perms = { user: data[0].user, 
                                curator : data[0].curator, 
                                reviewer : data[0].reviewer, 
                                accounter : data[0].accounter, 
                                administrator : data[0].administrator ,
                                sctoken : req.token,
                                expires_in : new Date().getTime() + 604800000}
                            var wrappedToken = jwt.sign(perms, config.jwtsecret, {
                                expiresIn: 604800 // expires in a week
                            });

                            req.session.steemconnect = steemResponse.account;
                            perms.token = wrappedToken;
                            
                            res.json(perms);
                        }
                        else 
                        {
                            // TO-DO return user not created response
                            res.json({"err" : " User does not exist in database"});
                        }
                    }
                    else {
                        res.json({"err" : "Problem with login"});
                    }

                    
                });
            }
            
        });
    }
    
});

router.get('/logout', (req, res) => {
    console.log("remote session destroyed");
   req.session.destroy();
   res.redirect("/")
});


// captcha verification
router.post('/captcha', (req,resp) => {
    console.log("body = " + JSON.stringify(req.body));
    // hit the url https://www.google.com/recaptcha/api/siteverify with 
    //secret (required)	6LddmUUUAAAAAGHs-MwQQpd0NIcL7utyNBeyVR0i
    // response (required)	The value of 'g-recaptcha-response'.
    var response = req.body.captcharesponse;

    request.post('https://www.google.com/recaptcha/api/siteverify', {
        //should always store private keys as environment variables for many reasons
        form: {
            secret: "6LddmUUUAAAAAGHs-MwQQpd0NIcL7utyNBeyVR0i",
            response: response}
    },
    function (err, res, body) {
        console.log(body);
        resp.json(JSON.parse(body));
    });


});

module.exports = router;