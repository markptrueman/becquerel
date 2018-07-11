import React, { Component } from 'react';
import './Blogpost.css';
import { OverlayTrigger, Panel, Popover } from 'react-bootstrap';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'



//var Markdown = require('react-showdown');
var Converter = require('react-showdown').Converter;
const removeMd = require('remove-markdown');



class BlogPost extends Component {


    
    constructor( props ) {
        super( props );
         this.state = {
          panelClass : '',
          
        }

        this.handleView = e => {
			this.setState({ target: e.target, show: !this.state.show });
        };
        
        this.handleSubCommentChange = e => {
            this.setState({
                subcomment: e.target.value
              });
        }

        this.handleRevCommentChange = e => {
            this.setState({
                revcomment: e.target.value
              });
        }
        
      }
    

      submit = (type,id, e) => {
         
        // confirmAlert({
        //   title: 'Confirm to ' + type + ' this submission',                        // Title dialog
        //   message: 'Are you sure you want to ' + type + ' this submission.',               // Message dialog
          
        //   confirmLabel: 'Confirm',                           // Text button confirm
        //   cancelLabel: 'Cancel',                             // Text button cancel
        //   onConfirm: () => this.doSubmit(type,id,e),    // Action after Confirm
        //  // onCancel: () => alert('Action after Cancel'),      // Action after Cancel - nothing
        // })
        this.doSubmit(type,id,e)
      };
   


    doSubmit = (type, id, comment, e) => {
        // callback to the top level to do the DB stuff
        if (type === "approve")
        {
           
           
            this.props.approveHandler(id, this.state.revcomment);
            
        }
        if (type === "reject")
        {
          
            this.props.rejectHandler(id, this.state.revcomment);
        }
        if (type === "close")
        {
           
            this.props.closeHandler(id, this.state.revcomment);
        }
        if (type === "comment")
        {
           
            this.props.commentHandler(id, this.state.revcomment);
            this.setState({
                revcomment: ""
              });
            this.refs.reviewcomments.value = ""
            return;
        }

       

        this.setState({"panelClass" : 'panel fadeOut'});
        setTimeout(() => {
            if (this.props.reload)
                this.props.reload();
        }, 2000);
       
        
    }
  
    render() {

        // calculate proposal time
        var proposalTime = moment(this.props.detail.submittedtime).utc();
        var sinceProposal = moment.utc().diff(proposalTime, 'minute');
        var propHours = Math.floor(sinceProposal/60);
        var propMins = sinceProposal % 60;
       

        var postTime = moment(this.props.detail.posttime).utc();
        var sincePost = moment.utc().diff(postTime, 'minute');
        var postHours = Math.floor(sincePost/60);
        var postMins = sincePost % 60;
       
        var converter = new Converter({ 'parseImgDimensions': true});
        //converter.completeHTMLDocument = true;
       
        var thebody = converter.convert(this.props.detail.body);
      
        // var noMd =  removeMd(this.props.detail.body).substring(0,200)  + "...";
       
        const popoverHoverFocus = (
            <Popover id="popover-trigger-click-root-close" viewport="navpanel" title={this.props.detail.posttitle} >
                {thebody}
            </Popover>
        );

        // build comments if needed
        let comments = null;
        if (this.props.detail.commentHistory && this.props.detail.commentHistory.length > 0)
        { 

            comments = this.props.detail.commentHistory.map(function(row) 
                {
                    
                    return (
                        
                        <div key={row.timestamp}>
                           "{row.comment}"  - <i>{row.commenter}</i> at {moment(row.timestamp).utc().format("DD-MMM-YYYY HH:mm:ss UTC")} <br/>
                        </div>
                            
                        )  
                                

                }, this);


           
        }
        

        return (

            <Panel className={this.state.panelClass} eventKey={this.props.detail._id}>
            <Panel.Heading>
                <Panel.Title toggle>
                    <div className="title-wrapper">
                        <div className="title-row">{this.props.detail.posttitle} - <div className="title-author"> by @{this.props.detail.postuser}</div> </div>
                        <div className="title-row proposed-by">Proposed by  @{this.props.detail.curator} {propHours > 0 ? propHours + " hours and ": null} {propMins} minutes ago.</div>
                            
                    </div>
                </Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
                <div className="body-wrapper">
                    <div className="body-row postmarkdown">
                   
                   <OverlayTrigger
                        trigger="click"
                        rootClose
                        placement="right"
                        overlay={popoverHoverFocus}
		>
                   <i className="fa fa-eye" aria-hidden="true"></i>
                   </OverlayTrigger>
                   
                       <a href={this.props.detail.url} target="_new" >{this.props.detail.url} <span>&nbsp;</span><i className="fa fa-external-link-square" aria-hidden="true"></i></a>
                    <br/>
                   {/* {noMd}   */}
                   
                    </div>
                    <div className="body-row commentsWrapper ">
                        <div className="commentsBold">Comments by proposer: </div> <div className="comments">{this.props.detail.comments} </div>
                    </div>
                    <div className="body-row postedstats ">
                        Posted on Steemit {postHours > 0 ? postHours + " hours and ": null} {postMins} minutes ago | Submitted for approval {propHours > 0 ? propHours + " hours and ": null} {propMins} minutes ago
                    </div>
                    <div className="body-row reviewComments ">
                        {comments}
                    </div>
                    <div className="body-row optionbuttons">
                        {/* <div className="submitterComments">
                            Comments for Submitter
                          <textarea id="subcomments" rows="2" cols="150" onChange={this.handleSubCommentChange}/>
                        </div> */}

                        <div className="reviewerComments">
                            Reviewer Comments
                          <textarea id="reviewcomments" ref="reviewcomments" rows="2" cols="150" onChange={this.handleRevCommentChange} />
                        </div>
                        <div className="optionbutton">
                            <a className="btn btn-success" onClick={(e) => this.submit("approve", this.props.detail._id, e)} href="#"><i className="fa fa-thumbs-o-up"></i> Approve</a>
                            </div>
                         <div className="optionbutton">
                            <a className="btn btn-danger" onClick={(e) => this.submit("reject",this.props.detail._id, e)} href="#"><i className="fa fa-thumbs-o-down"></i> Reject</a>
                            </div>
                            <div className="optionbutton">
                            <a className="btn btn-warning" onClick={(e) => this.submit("comment",this.props.detail._id, e)} href="#"><i className="fa fa-comments"></i> Comment</a>
                            </div>
                        <div className="optionbutton">
                            <a className="btn btn-info" onClick={(e) => this.submit("close", this.props.detail._id,e)} href="#"><i className="fa fa-times"></i> Close</a>
                            </div>
                            {/* <div className="optionbutton">
                            <a className="btn btn-warning" onClick={(e) => this.submit("review", this.props.detail._id,e)} href="#"><i className="fa fa-eye"></i> Review</a>
                            </div> */}
                    </div>
                </div>
           
            </Panel.Body>
          </Panel>
            
            );
    }
}

export default BlogPost;