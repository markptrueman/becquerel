var moment = require('moment');
var User = require("../model/user");
var CuratorLevels = require("../model/curatorlevels");
var Posts = require("../model/posts")

var softLimitZeroUtc = true;

/******************** */
// this checks
// - if the post has already been submitted
// - time of creation of post in relation to users time limit and current curie rules
// - if the user has any posting slots available based on their profile based on current curie rules
// 
exports.checkSubmission = async function(submittedValues, postDetails)
{
    console.log("Checking submissoin");
    let user = await User.findOne({"user" : submittedValues.curator });
    if (!user.enabled)
    {
        return   {"err" : "Your account is disabled"}; 
    }
    if (postDetails.post === 'No post found')
    {
        return   {"err" : "This URL does not exist, please double check your post URL and try again."};
    }
    console.log("user enabled ok");
    //2018-01-16T18:07:18
    let created = moment.utc(postDetails.post.created);
    // check to see if post is created in the last 24 hours
    let yesterday  = moment().utc().subtract(24, "hours");

    if (created.isBefore(yesterday))
    {
        return   {"err" : "Post is more than 24 hours old."};
    }

    console.log('checking to see if it is already submitted')

    // check to see if the post is already submitted prior to anything else
    let res = await Posts.find({$and : [{"url" : "https://steemit.com" + postDetails.post.url}, {"posttime" : {$gt: yesterday.utc().toDate()}}]});
    //console.log("Check for existing url = " + res);

    if (res && res.length > 0)
    {
        return {"err" : "Post has already been submitted."};
    }
   
    console.log("getting post minutes for user " + JSON.stringify(user));
    let limits = await CuratorLevels.findOne({"level" : user.level});
    let minsPerUser = limits.minutes;
    
    if (moment.utc().diff(created,'minute') < minsPerUser)
    {
            let possibleTime = created.add(minsPerUser, "minutes")
            let at = possibleTime.format("HH:mm:ss");
            let secondsToSubmit = possibleTime.diff(moment.utc(), "seconds");
            console.log("post is less that required " + minsPerUser);
            return {"err" : "Post is less than the required " + minsPerUser + " minutes old. Submittable at " + at + " UTC , in " + secondsToSubmit + " seconds."};
    }
    else if(await hasUserReached7DayLimit(user, limits))
    {
        return {"err" : "You have reached your submission limit of " + limits.limit + " in the last 7 days."};
    }
    else if (await hasUserReachedSoftLimit(user)) {
        return {"err" : "You have reached your soft submission limit of " + user.dailySoftLimit + " since 00:00 UTC."};
    }

    else {

        return {"response" : "success"};
    }
}



hasUserReached7DayLimit = async (user, limits) =>
{
    // get posts for the user in the last 7 days
    let oneWeekAgo = moment().utc().subtract(7, "days");
    let posts = await Posts.find( { $and: [ {"curator" : user.user}, {"submittedtime" : {$gt: oneWeekAgo.utc().toDate()}} ]})
   // console.log(JSON.stringify(posts))
    if (posts.length >= limits.limit)
    {
        // trying to submit more than they should in the last 7 days
        return true;
    }

   


    return false;
}

hasUserReachedSoftLimit = async (user, limits) =>
{
    let start = null;

    if (softLimitZeroUtc) {
        // the soft limit should be calculated based on 00:00 utc
        start = moment().utc().startOf("day");

    }
    else {
    // get posts for the user in the last 7 days
         start = moment().utc().subtract(1, "days");
       
    }

    let posts = await Posts.find( { $and: [ {"curator" : user.user}, {"submittedtime" : {$gt: start.utc().toDate()}} ]})
    // console.log(JSON.stringify(posts))
        if (posts.length >= user.dailySoftLimit)
        {
           // console.log(posts)
            // trying to submit more than they should in the last day
            return true;
        }
        return false;
}
 

