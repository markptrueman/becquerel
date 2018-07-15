var Post = require('../model/posts');
var moment = require('moment')
var Json2csvParser = require('json2csv').Parser;


module.exports.generateDetailedReport = async(start, end, user) => {
    let s = moment(start).utc();
    let e = moment(end).utc();

    let csv = null;

    // need a query to get all posts 
    var posts = null;
    if (user && user != 'undefined')
    {
        posts = await Post.find({ $and : [{ "submittedtime": { $gte: s, $lt: e } }, {"curator" : user}]})
    }
    else {
        posts = await Post.find({ "submittedtime": { $gte: s, $lt: e } })
    }

    

    if (!posts || posts.length == 0) {
        console.log("invalid parameter");
        return ("error");
    }

    for (var i = 0; i < posts.length; i++) {
        let post = posts[i];
        // just add a json object for each row to the results array
        post.state = post.approved ? "1" : post.rejected ? "0" : post.closed ? "x"  : post.commentHistory && post.commentHistory.length > 0 ? "c" : "q";
        // get the author - index of first @ and index of next /
        
        post.author = post.url.substring(post.url.indexOf("@")+1, post.url.indexOf("/", post.url.indexOf("@")))
        post.subFormat = moment(post.submittedtime).format("DD-MMM-YYYY HH:MM:ss");
        post.revFormat = moment(post.reviewTime).format("DD-MMM-YYYY HH:MM:ss");
        post.percentFormat = post.votePercentage ? post.votePercentage/100 : "N/A"
        // combine the comment history
        post.reviewerComment = "";
        for (var j = 0; j < post.commentHistory.length; j++)
        {   
            post.reviewerComment  += post.commentHistory[j].commenter + " : " + post.commentHistory[j].comment + "\r\n";
        }
        //console.log(author);
    }

    const fields = [{label: 'SubmittedTime', value :'subFormat'} , {label: 'ReviewTime' , value: 'revFormat'}, {label : 'Curator', value: 'curator'},{label: 'Reviewer', value: 'reviewer'}
                                ,{label : 'Author', value : 'author'},{label: 'URL', value: 'url'},{label: 'State' , value : 'state'}, {label : 'Percentage', value : 'percentFormat'},
                                {label: 'CuratorComments', value: 'comments'},{label: 'ReviewerComment' , value : 'reviewerComment'}];
    const json2csvParser = new Json2csvParser({ fields });
    csv = json2csvParser.parse(posts);

    //console.log(csv);



    return csv;

}

module.exports.generateDetailedPersonalReport = async(start, end, user) => {
    let s = moment(start).utc();
    let e = moment(end).utc();

    let csv = null;

    // need a query to get all posts 
    var posts = null;
    if (user && user != 'undefined')
    {
        posts = await Post.find({ $and : [{ "submittedtime": { $gte: s, $lt: e } }, {"curator" : user}]})
    }
    else {
       return;
    }

    

    if (!posts || posts.length == 0) {
        console.log("invalid parameter");
        return ("error");
    }

    for (var i = 0; i < posts.length; i++) {
        let post = posts[i];
        // just add a json object for each row to the results array
        post.state = post.approved ? "Approved" : post.rejected ? "Rejected" : post.closed ? "Closed"  :  "Queued";
        // get the author - index of first @ and index of next /
        
        post.author = post.url.substring(post.url.indexOf("@")+1, post.url.indexOf("/", post.url.indexOf("@")))
        post.subFormat = moment(post.submittedtime).format("DD-MMM-YYYY HH:MM:ss UTC");
        post.percentFormat = post.votePercentage ? post.votePercentage/100  : "N/A"
        // post.revFormat = moment(post.reviewTime).format("DD-MMM-YYYY HH:MM:ss");
        // combine the comment history
        //console.log(author);
    }

    const fields = [{label: 'SubmittedTime', value :'subFormat'} 
                                ,{label : 'Author', value : 'author'},{label: 'URL', value: 'url'},{label: 'State' , value : 'state'},{label : 'Percentage', value : 'percentFormat'},
                                {label: 'CuratorComments', value: 'comments'}];
    const json2csvParser = new Json2csvParser({ fields });
    csv = json2csvParser.parse(posts);

    console.log(csv);



    return csv;

}

module.exports.generateReviewerReport = async(start, end, user) => {
    let s = moment(start).utc();
    let e = moment(end).utc();

    let csv = null;

    // need a query to get all posts 

   

    var posts = null;
    // if (user && user != 'undefined')
    // {
    //     posts = await Post.find({ $and : [{ "reviewTime": { $gte: s, $lt: e } }, {"reviewer" : user}]}).sort({"reviewTime": -1})
    // }
    // else {
        posts = await Post.find({ "reviewTime": { $gte: s, $lt: e } }).sort({"reviewTime": -1})
    //}

    let results = [];
    let commentCounter = [];

    if (!posts || posts.length == 0) {
        console.log("invalid parameter");
        return ("error");
    }

    for (var i = 0; i < posts.length; i++) {
        let post = posts[i];

        for (var j = 0; j < post.commentHistory.length; j++)
        {
            let commenter = post.commentHistory[j].commenter;
            // if this commenter exists in the commentCounter, add one, else create the commenter
            let foundCommenter = false;

            for (var k = 0; k < commentCounter.length; k++)
            {
                if (commentCounter[k].commenter == commenter)
                {
                    commentCounter[k].count += 1;
                    foundCommenter = true;
                    console.log("added commented value " + JSON.stringify(commentCounter[k]));
                    break;
                }
            }

            if (!foundCommenter)
            {
                
                let commenterToAdd = { "commenter" : commenter, "count" : 1}
                commentCounter.push(commenterToAdd);
                console.log("added commenter " + JSON.stringify(commentCounter[0]))
            }

        }

        let reviewer = post.reviewer;
        if (reviewer === null || reviewer === '' || reviewer === undefined) continue
        //console.log("found post by curator " + curator);
        // find this curator in the array
        let found = false;
        let reviewCountForThisPost = 0;
        for (var j = 0; j < results.length; j++) {
            if (results[j].reviewer === reviewer) {
                //console.log("curator " + curator + " already exists ");
                // update this curator with this post score.
                if (post.approved) {;
                    results[j].approved += 1;
                } else if (post.rejected) {

                    results[j].rejected += 1;
                } else if (post.closed) {

                    results[j].closed += 1;
                } 
                // results[j].reviewed += 1;
                //console.log("result " + JSON.stringify(results[j]));
                found = true;
                break;
            }
        }
        if (!found) {
            // add the curator to the array with this stat
            let stat = { "reviewer": reviewer };
            stat.approved = 0;
            stat.closed = 0;
            stat.commented = 0;
            stat.rejected = 0
           // stat.reviewed = 0;
            console.log("creating new reviewer in report " + reviewer);

            if (post.approved) {
                stat.approved += 1;
            } else if (post.rejected) {

                stat.rejected += 1;
            } else if (post.closed) {

                stat.closed += 1;
            } 
            // see if the reviewer commented
           
            results.push(stat);
        }

       

    }

     // merge results and commentCounter
     for (var i = 0; i < results.length; i++)
     {
        let reviewer = results[i].reviewer;
        for (var j = 0 ; j < commentCounter.length; j++)
        {
            if (commentCounter[j].commenter === reviewer)
            {
                results[i].commented = commentCounter[j].count;
                break;
            }
        }
     }

    const fields = [    {label: 'Reviewer', value: 'reviewer'},
                        {label: 'Approved', value: 'approved'},
                        {label: 'Rejected' , value : 'rejected'},
                        {label: 'Closed' , value : 'closed'},
                        {label: 'Commented' , value : 'commented'} ];
    const json2csvParser = new Json2csvParser({ fields });
    csv = json2csvParser.parse(results);

    console.log(csv);



    return csv;


    

}

// generate the basic report of AR/CS/CLOSURES/SUBMISSOINS
module.exports.generateReport = async(start, end, user) => {
    // convert these dates to moments to start with
    let s = moment(start).utc();
    let e = moment(end).utc();

    let csv = null;

    // need a query to get all posts 
    var posts = null;
    if (user && user != 'undefined')
    {
        posts = await Post.find({ $and: [{ "submittedtime": { $gte: s, $lt: e } }, {"curator" : user}]})
    }
    else {
        posts = await Post.find({ "submittedtime": { $gte: s, $lt: e } })
    }
    

    let results = [];

    if (!posts || posts.length == 0) {
        console.log("invalid parameter");
        return ("error");
    }
    console.log("Generating report based on " + posts.length + " posts between " + s.format() + " and " + e.format());

    // build an array of users with SARC stats
    for (var i = 0; i < posts.length; i++) {
        let post = posts[i];
        let curator = post.curator;
        //console.log("found post by curator " + curator);
        // find this curator in the array
        let found = false;
        for (var j = 0; j < results.length; j++) {
            if (results[j].curator === curator) {
                //console.log("curator " + curator + " already exists ");
                // update this curator with this post score.
                if (post.approved) {;
                    results[j].approved += 1;
                } else if (post.rejected) {

                    results[j].rejected += 1;
                } else if (post.closed) {

                    results[j].closed += 1;
                } else {

                    results[j].queued += 1;
                }
                results[j].submitted += 1;
                //console.log("result " + JSON.stringify(results[j]));
                found = true;
                break;
            }
        }
        if (!found) {
            // add the curator to the array with this stat
            let stat = { "curator": curator };
            stat.approved = 0;
            stat.closed = 0;
            stat.queued = 0;
            stat.rejected = 0
            stat.submitted = 0;
            console.log("creating new curator in report " + curator);

            if (post.approved) {

                stat.approved += 1;
            } else if (post.rejected) {

                stat.rejected += 1;
            } else if (post.closed) {

                stat.closed += 1;
            } else {
                stat.queued += 1;
            }
            stat.submitted += 1;
            results.push(stat);
        }

    }

    // now calculate cs and ar
    for (var i = 0; i < results.length; i++) {
        let curator = results[i];
        let ar = (parseFloat(curator.approved) / (parseFloat(curator.approved) + parseFloat(curator.rejected))).toFixed(2);
        let cs = ((ar * ar) * parseFloat(curator.approved)).toFixed(2);
        curator.cs = isNaN(cs) ? 0 : cs;
        curator.ar = isNaN(ar) ? 1 : ar;
        console.log("report for curator " + JSON.stringify(curator))
    }

    // generate a csv with this info

    const fields = [{label: 'Curator', value :'curator'} , {label: 'CS' , value: 'cs'}, {label : 'AR', value: 'ar'},{label: 'Approved', value: 'approved'}
                                ,{label : 'Rejected', value : 'rejected'},{label: 'Closed', value: 'closed'},{label: 'Submitted' , value : 'submitted'}];
    const json2csvParser = new Json2csvParser({ fields });
    csv = json2csvParser.parse(results);

    console.log(csv);



    return csv;

}