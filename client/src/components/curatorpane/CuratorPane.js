import React, { Component } from 'react';
import ReportsDiv from '../reports/ReportsDiv'
import './CuratorPane.css';
import {Table, Tabs, Tab} from 'react-bootstrap'
import moment from 'moment'
import ReactTable from 'react-table'
import "react-table/react-table.css";
import Link from 'react-router'



class CuratorPane extends Component {


  constructor( props ) {
    super( props );
     this.state = {
      
      
    }
    this.currentPage = 1;
    
    this.incrementPage = this.incrementPage.bind(this);
    
  }

  incrementPage = (e) => {
    e.preventDefault();
    console.log("incrementing page")
    if (this.props && this.props.curatorPosts && this.props.curatorPosts.length === 10) {
      console.log("have 10");
     this.currentPage= this.currentPage +1;
     
      
    }
    if (this.props.pageUpdate)
    {
      console.log("page update " + this.currentPage);
      this.props.pageUpdate(this.currentPage);
    }
  }

  decrementPage = (e) => {
    e.preventDefault();
    console.log("incrementing page")
    if (this.currentPage > 1) {
      
      this.currentPage= this.currentPage -1;
     
      
    }
    if (this.props.pageUpdate)
    {
      console.log("page update " + this.currentPage);
      this.props.pageUpdate(this.currentPage);
    }
  }


render() {

 
  var rowslist = null;
  // if (this.props && this.props.curatorPosts){
  //   rowslist = this.props.curatorPosts.map(function(row) 
  //   {
      
  //       // get the status
  //       let status = "Queued"
  //       if (row.approved)
  //         status = "Approved"
  //       if (row.rejected)
  //         status = "Rejected"
  //       if (row.closed)
  //         status = "Closed"

  //       return (
          
  //         <tr key={row._id}>
  //           <td>{moment(row.submittedtime).format('LLL') } UTC</td>
  //           <td><a href={row.url} target="_new" >{row.url}</a></td>
  //           <td>{status}</td>
            
  //       </tr>
        
           
                 
  //           )  
                  

  //   }, this);

  // }
  
    return (
      <div className="curatorPane">
        {/* <div className="curatorrowlist"> */}
        <Tabs defaultActiveKey={1} id="curatortabs">
          <Tab eventKey={1} title="Your Submissions">
          {/* <div className="tableWrapper"> */}
            
          <ReactTable 
          data={this.props.curatorPosts}
          columns={[
              {
                  Header: "Submitted",
                  accessor: "submittedtime",
                  maxWidth: 175,
                  className: "left"
                },
                {
                  Header: "URL",
                  accessor: "url",
                  className: "left",
                  Cell: props => <a href={props.value} target='_new'>{props.value}</a>
                },
                {
                  Header: "Status",
                  accessor: "status",
                  className: "left",
                  maxWidth: 120
                },
                {
                  Header: "Comment",
                  accessor: "submitterComment",
                  className: "left"
                }

                
              ]
            }
          defaultPageSize={10}
          showPagination={false}
          className="-striped -highlight"
        />

          
         
            <div className="curatorbuttonWrapper" >


            <a className="btn btn-info curatornavbutton" onClick={this.decrementPage} href="#"><i className="fa fa-step-backward"></i> Newer</a>

            <a className="btn btn-info curatornavbutton" onClick={this.incrementPage} href="#"><i className="fa fa-step-forward"></i> Older</a>



            </div>
            {/* </div> */}
          </Tab>
          <Tab eventKey={2} title="Reporting">
            <ReportsDiv {...this.props}/>
          </Tab>

          </Tabs>
        
        
         
        {/* </div> */}
        
       
      </div>
      
   
    );
  
}

  
}

export default CuratorPane;