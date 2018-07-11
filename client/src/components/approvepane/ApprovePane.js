import React, { Component } from 'react';

import './ApprovePane.css';
import BlogPost from './blogpost/Blogpost'
import { PanelGroup, Panel } from 'react-bootstrap'

class ApprovePane extends Component {


  
    
  constructor( props ) {
      super( props );
       this.state = {
        
        
      }
      
    }
  
  
 

  render() {

    var rowslist = null;
    if (this.props && this.props.approvalQueue && this.props.approvalQueue.length > 0){
      rowslist = this.props.approvalQueue.map(function(row) 
      {
        
          return (
            
              <BlogPost key={row._id} detail={row} closeHandler={this.props.closeHandler} 
                  rejectHandler={this.props.rejectHandler} approveHandler={this.props.approveHandler} 
                  commentHandler={this.props.commentHandler} reload={this.props.reload}/>
            

                   
              )  
                    

      }, this);

    }
    else {
      return <div className="noitemsdiv">No Items in Queue</div>
    }
    
      return (
      <div className="approvepane">
          <PanelGroup accordion id="accordion">
          {rowslist}
        </PanelGroup>
        </div>
        
     
      );
    
    
    
  }

  
}

export default ApprovePane;