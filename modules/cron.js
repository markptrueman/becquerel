var CronJob = require('cron').CronJob;
var moment = require('moment');
var Post = require('../model/posts');
var Steem = require('steem');
Steem.api.setOptions({ url: 'https://api.steemit.com' });
var config = require('../config')

new CronJob('00 * * * * *', function() {
    //console.log('You will see this message every minute ' + moment().format('LLL'));
    updatePercentages();

}, null, true, 'America/Los_Angeles');

updatePercentages = () => {
    // go through the last 6 hours of posts that have been approved, 
    // if they dont have a percentage on them, see if you can get it 
    //console.log("Updating percentages")
    sixhoursago = moment().utc();
    sixhoursago.subtract(6, "hours")

    Post.find({ $and: [{ 'approved': true }, { "reviewTime": { $gte: sixhoursago.toDate() } }, { "votePercentage": null }] }, function(err, posts) {
        if (err) {
            console.log("DB Err " + err);
        } else {
            //responds with a json object of our database comments.
            // console.log(posts);
            for (var i = 0; i < posts.length; i++) {
        
                let post = posts[i];
                if (post.postuser && post.permlink) {
                    console.log("getting vote percentage for " + post.postuser + "/" + post.permlink)
                }
                else {
                  return;
                }

                Steem.api.getActiveVotes(post.postuser, post.permlink, function(err2, result) {
                    //  console.log("result = " + JSON.stringify(result));
                    let percent = null;
                    if (err) {
                        console.log("Error: " + err2);
                        return;
                    } else {
                        // get the upvote for the account specified in the config
                        var upvoteuser = config.upvoteuser;
                       
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].voter === upvoteuser) {
                                percent = result[i].percent;
                                console.log(upvoteuser + " voted with percentage " + percent);
                                

                                break

                            }

                          


                        }
                        if (percent) {
                          console.log("Updating post " + post._id + " with percentage vote " + percent);
                          Post.update({ _id: post._id }, {"votePercentage" : percent}, function(err, numberaffected) {
                              if (err) console.log(err)
                              else console.log("affected " + numberaffected);

                          });
                        }
                      }
                });

            }
        }

    });

}