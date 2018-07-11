import React, { Component } from 'react';
import './ApprovedPost.css';
//import { Popover } from 'react-bootstrap';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'



// var Markdown = require('react-showdown');
var Converter = require('react-showdown').Converter;
//const removeMd = require('remove-markdown');



class ApprovedPost extends Component {


    
    constructor( props ) {
        super( props );
         this.state = {
          panelClass : '',
          
        }

       
        
      }
    

     
  
    render() {


        
        // calculate proposal time
        var proposalTime = moment(this.props.detail.submittedtime).utc();
        var sinceProposal = moment.utc().diff(proposalTime, 'minute');
        var propDays = Math.floor(sinceProposal / (60*24));
        var propMins = sinceProposal - (propDays * (60*24))
        var propHours =  Math.floor(propMins / 60);
        propMins = propMins - propHours*60;

        // calculate review time
        var reviewTime = moment(this.props.detail.reviewTime).utc();
        var sinceReview = moment.utc().diff(reviewTime, 'minute');
        var revDays = Math.floor(sinceReview / (60*24));
        var revMins = sinceReview - (revDays * (60*24))
        var revHours =  Math.floor(revMins / 60);
        revMins = revMins - revHours*60;
       
       
       

        var postTime = moment(this.props.detail.posttime).utc();
        var sincePost = moment.utc().diff(postTime, 'minute');
        var postDays = Math.floor(sincePost / (60*24));
        var postMins = sincePost - (postDays * (60*24))
        var postHours =  Math.floor(postMins / 60);
        postMins = postMins - postHours*60;
       
        var converter = new Converter({ 'parseImgDimensions': true});
        //converter.completeHTMLDocument = true;
       
        //var thebody = converter.convert(this.props.detail.body);
      
        //var noMd =  removeMd(this.props.detail.body).substring(0,200)  + "...";
       
        // const popoverHoverFocus = (
        //     <Popover id="popover-trigger-click-root-close" viewport="navpanel" title={this.props.detail.posttitle} >
        //         {thebody}
        //     </Popover>
        // );
        

        return (

           <div className="postWrapper">
           <div className="toprow">
           <a href={this.props.detail.url} target="_new" >{this.props.detail.posttitle} (by @{this.props.detail.postuser})</a>
             -  Posted {postDays > 0 ? `${postDays} days,` : null} {postHours > 0 ? `${postHours} hours and ` : null} {postMins} minutes ago.
            </div>
            <div className="bottomrow">
                Proposed by @{this.props.detail.curator} {propDays > 0 ? `${propDays} days,` : null} {propHours > 0 ? `${propHours} hours and ` : null} {propMins} minutes ago. 
                Reviewed {revDays > 0 ? `${revDays} days,` : null} {revHours > 0 ? `${revHours} hours and ` : null} {revMins} minutes ago.
            </div>
            </div>
            
            );
    }
}

export default ApprovedPost;