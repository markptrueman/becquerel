import React, { Component } from 'react';
import ReportsDiv from '../reports/ReportsDiv'
import './UserAdminPane.css';
import UserManagementDiv from '../usermanagementdiv/UserManagementDiv'
import { Tabs, Tab } from "react-bootstrap";


class UserAdminPane extends Component {


    
  
  
   

  render() {


      return (

        <div className="userAdminPaneOuter">

           <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Reports">
            <ReportsDiv {...this.props}/>
          </Tab>
          <Tab eventKey={2} title="User Management">
            <UserManagementDiv {...this.props}/>
          </Tab>
          </Tabs>
          

       
        </div>
        
     
      );
    
    
    
  }

  
}

export default UserAdminPane;