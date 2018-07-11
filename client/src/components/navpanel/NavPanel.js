import React, { Component } from 'react';
  import HomePane from "../homepane/HomePane";
  import ProposePane from "../proposepane/ProposePane";
  import ApprovePane from "../approvepane/ApprovePane";
  import UserAdminPane from "../useradminpane/UserAdminPane";
  import AdminPane from "../adminpane/AdminPane";
  import moment from 'moment'
  import FileSaver from 'file-saver';


import { Tabs, Tab } from "react-bootstrap";
  
import './NavPanel.css';

class NavPanel extends Component {

    headers = () => ({
        'Content-Type': 'application/json',
       // Accept: 'application/json',
       
        Authorization: `Bearer ${this.props.auth.getAccessToken()}`
      });
    
  constructor( props ) {
      super( props );
       this.state = {
            "approvalQueue" : null,
            "approvedPage" : 1
        
      }

      this.handleSelect = this.handleSelect.bind(this);
      this.reload = this.reload.bind(this);
      this.checkAuthorisation = this.checkAuthorisation.bind(this);
      this.handlePageUpdate = this.handlePageUpdate.bind(this);

      this.authinfo = JSON.parse(localStorage.getItem('authtoken'));



      

    
     
  }

  componentDidMount()
  {
    this.loadApprovedQueue();
    this.loadLevels();
    if (localStorage.getItem("selectedtab"))
    {
        console.log(localStorage.getItem("selectedtab"))
        this.setState({"activeKey" : parseInt(localStorage.getItem("selectedtab"))})
        this.handleSelect(parseInt(localStorage.getItem("selectedtab")))
    }
    
    
        
    

  }

  loadLevels = () => {
    fetch('/users/levels', {
        headers: this.headers()
    })
    .then(results => {
        return results.json();
    })
    .then(levels => {
        
        this.setState({"levels" : levels});

    });
  }

  handlePageUpdate = (page) => {

    
      this.setState( { "approvedPage" : page }, () => {
            this.loadApprovedQueue();
        }
        );
      
  }
      
    handleSelect = (key) => {
       
        this.setState({activeKey: key});
        localStorage.setItem("selectedtab", key)
        if (key === 1){
            // approve tab selected
            
            this.loadApprovedQueue();
            
        }

        if (key === 3){
            // approve tab selected
            
            this.loadReviewerQueue();
            
        }

        if (key === 5 || key == 4){
            // admin tab selected
            
            this.loadUserDetails();
            
        }
    }

    loadReviewerQueue = () => {
        fetch('/posts/toapprove', {
             headers: this.headers()
        })
        .then(results => {
            return results.json();
        })
        .then(posts => {
            
            this.setState({"approvalQueue" : posts});

        });
    }

    loadApprovedQueue = () => {
        let page = 1;
        fetch('/posts/approved/' + this.state.approvedPage, {
            headers: this.headers()
       })
        .then(results => {
            return results.json();
        })
        .then(posts => {
            
             this.setState({"approvedPosts" : posts});

        });
    }

    loadUserDetails = () => {
        fetch('/users/allusers', {
            headers: this.headers()
       })
        .then(results => {
            return results.json();
        })
        .then(users => {
            
             this.setState({"allusers" : users});

        });
    }

   


    handleApprove = (_id, comment) => {
        let details = {}
        details.comment = comment;
        details.user = this.authinfo.user
        fetch('/posts/approve/' + _id, {

            method: 'post',
      
            headers: this.headers(),
             body: JSON.stringify(details)
           })
            .then(results => {
                
                return results.json();
            })
            .then(data => {
               //this.setState({"response": data.response});
               
            })
    }
    
    handleReject = (_id, comment) => {
        let details = {}
        details.comment = comment;
        details.user = this.authinfo.user
        console.log("handling reject for " + _id);
        fetch('/posts/reject/' + _id, {

            method: 'post',
      
            headers: this.headers(),
            body: JSON.stringify(details)
           })
            .then(results => {
                
                return results.json();
            })
            .then(data => {
               //this.setState({"response": data.response});
               
            })
    }

    handleComment = (_id, comment) => {
        let details = {}
        details.comment = comment;
        details.user = this.authinfo.user
        console.log("handling comment for " + _id + " + comment = " + comment);
        fetch('/posts/comment/' + _id, {

            method: 'post',
      
            headers: this.headers(),
            body: JSON.stringify(details)
           })
            .then(results => {
                
                return results.json();
            })
            .then(data => {
               //this.setState({"response": data.response});
               this.loadReviewerQueue();
            })
    }


    handleClose = (_id, comment) => {
        let details = {}
        details.comment = comment;
        details.user = this.authinfo.user
        console.log("handling close for " + _id);
        fetch('/posts/close/' + _id, {

            method: 'post',
      
            headers: this.headers(),
            body: JSON.stringify(details)
           })
            .then(results => {
                
                return results.json();
            })
            .then(data => {
               //this.setState({"response": data.response});
               
            })
    }
    
    reload = () =>
    {
        this.loadReviewerQueue();
        this.loadApprovedQueue();
       
    }

    checkAuthorisation = (role) => {
       // console.log("cheking current authorisation for role");
        return this.props.auth.canView(role) && this.props.auth.isAuthenticated();
        // need to check that the current logged in user has permissions and that they havent tried to change the permission
        // in a hacky way
        // you could go to the server every time to see if the user has persmission to see the tab 

    }

    generateCuratorReport = (startTime, endTime, user) =>
    {
        console.log(startTime +" - " + endTime);
        if (startTime && endTime) {
        fetch('/accounts/curator/' + startTime + "/" + endTime + "/" + user, {

            method: 'post',
      
            headers: this.headers(),
             //body: JSON.stringify(submittedValues) 
           })
            .then(results => {
                console.log("results = " + JSON.stringify(results));
                return results.blob();
            })
            .then(data => {
                console.log(data);
                // data is a blob, download it
                let filename = "CuratorReport-" + moment(startTime).utc().format("YYYY-MM-DD HH:mm") + " - "+ moment(endTime).utc().format("YYYY-MM-DD HH:mm")+".csv";
                FileSaver.saveAs(data,filename);

               
            })
        }
    }

    generateDetailedCuratorReport = (startTime, endTime, user) =>
    {
        console.log(startTime +" - " + endTime);
        if (startTime && endTime) {
        fetch('/accounts/curatordetailed/' + startTime + "/" + endTime + "/" + user, {

            method: 'post',
      
            headers: this.headers(),
             //body: JSON.stringify(submittedValues) 
           })
            .then(results => {
                console.log("results = " + JSON.stringify(results));
                return results.blob();
            })
            .then(data => {
                console.log(data);
                // data is a blob, download it
                let filename = "CuratorDetailedReport-" + moment(startTime).utc().format("YYYY-MM-DD HH:mm") + " - "+ moment(endTime).utc().format("YYYY-MM-DD HH:mm")+".csv";
                FileSaver.saveAs(data,filename);

               
            })
        }
    }

    generateReviewerReport = (startTime, endTime) =>
    {
        console.log(startTime +" - " + endTime);
        if (startTime && endTime) {
        fetch('/accounts/reviewer/' + startTime + "/" + endTime, {

            method: 'post',
      
            headers: this.headers(),
             //body: JSON.stringify(submittedValues) 
           })
            .then(results => {
                console.log("results = " + JSON.stringify(results));
                return results.blob();
            })
            .then(data => {
                console.log(data);
                // data is a blob, download it
                let filename = "ReviewerReport-" + moment(startTime).utc().format("YYYY-MM-DD HH:mm") + " - "+ moment(endTime).utc().format("YYYY-MM-DD HH:mm")+".csv";
                FileSaver.saveAs(data,filename);

               
            })
        }
    }
   
 

  render() {
    const jsx = (
        <div id="navpanel" className="navpanel">
          <Tabs id="uncontrolled-tab-example" onSelect={this.handleSelect} activeKey={this.state.activeKey}>
          <Tab eventKey={1} title="Home">
              <HomePane approvedPosts={this.state.approvedPosts} pageUpdate={this.handlePageUpdate}/>
          </Tab>
          { this.checkAuthorisation('curator') ?
          <Tab eventKey={2} title="Propose">
              <ProposePane {...this.props}/>
          </Tab>
          : null }
           { this.checkAuthorisation('reviewer') ?
          <Tab eventKey={3} title="Review" >
             <ApprovePane {...this.props} approvalQueue={this.state.approvalQueue} closeHandler={this.handleClose} 
                                        rejectHandler={this.handleReject} approveHandler={this.handleApprove} 
                                        commentHandler={this.handleComment}
                                        reload={this.reload}/>
          </Tab>
          : null} 
           { this.checkAuthorisation('accounter') ?
          <Tab eventKey={4} title="User Admin" >
             <UserAdminPane showcuratorreport={true} generateCuratorReport={this.generateCuratorReport} 
                                saveUserHandler={this.saveUser} loadUserDetails={this.loadUserDetails}
                                    generateDetailedCuratorReport={this.generateDetailedCuratorReport} 
                                    auth={this.props.auth}
                                    generateReviewerReport={this.generateReviewerReport} allusers={this.state.allusers} levels={this.state.levels}/>
          </Tab>
          : null }
           { this.checkAuthorisation('administrator') ?
          <Tab eventKey={5} title="Admin"  >
              <AdminPane allusers={this.state.allusers} saveUserHandler={this.saveUser} loadUserDetails={this.loadUserDetails}   loadLevels={this.loadLevels}
              showcuratorreport={true} showdetailedreport={true} showreviewerreport={true} 
              generateCuratorReport={this.generateCuratorReport} 
              generateDetailedCuratorReport={this.generateDetailedCuratorReport} 
              generateReviewerReport={this.generateReviewerReport}
              auth={this.props.auth} levels={this.state.levels}
              allowRoleChange={true} allowDelete={true}/>
          </Tab>
          :null }
        </Tabs>

        </div>
      
      );
   
    
   

      return jsx;
    
    
    
  }

  
}

export default NavPanel;