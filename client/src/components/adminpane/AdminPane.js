import React, { Component } from 'react';
import ReportsDiv from '../reports/ReportsDiv'
import './AdminPane.css';
import UserManagementDiv from '../usermanagementdiv/UserManagementDiv';
import { Tabs, Tab } from "react-bootstrap";
import SysAdminPane from './sysadminpane/SysAdminPane';

class AdminPane extends Component {


    
 
   

  render() {


      return (

        <div className="userAdminPaneOuter">

        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" onSelect={this.handleSelect}>
          <Tab eventKey={1} title="Reports">
            <ReportsDiv {...this.props}/>
          </Tab>
          <Tab eventKey={2} title="User Management">
            <UserManagementDiv {...this.props}/>
          </Tab>
          <Tab eventKey={3} title="System Management">
          <br/>
              <SysAdminPane  {...this.props}/>
          </Tab>
       </Tabs>
       

    
     </div>
        
     
      );
    
    
    
  }

  
}

export default AdminPane;