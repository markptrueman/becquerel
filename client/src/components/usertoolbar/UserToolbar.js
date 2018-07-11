import React, { Component } from 'react';

import './UserToolbar.css';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import Auth from '../../auth'
import UserStats from './UserStats'
import CurieStats from './CurieStats'

class UserToolbar extends Component {


    
  constructor( props ) {
      super( props );
       this.state = {
       
        
      }
      this.auth = new Auth();
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
      this.authinfo = JSON.parse(localStorage.getItem('authtoken'));
      // this.props.getUserStats();
      // this.props.getCurieStats();
    }

    
    

    login =  () => {
        // call the class that calls steemconnect
        this.auth.login();
        //this.props.getUserStats()
    };

    logout =  () => {
        // call the class that calls steemconnect
        this.auth.logout();
    };

   
  
 

  render() {

        

      return (

        <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#brand">Becquerel</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <UserStats {...this.props}/>
            <CurieStats {...this.props}/>
          <Nav pullRight>
          { this.props.auth.isAuthenticated() ?
            <NavItem eventKey={1} onClick={this.logout} href="">
                Logout @{this.authinfo.user}
            </NavItem>
            :
            <NavItem eventKey={2} onClick={this.login} href="">
               Login
            </NavItem>
           
                 }
            
            </Nav>
            </Navbar.Collapse>
            </Navbar>
    //   <div className="usertoolbar">
    //       <ul className="nav justify-content-end">
    //         <li className="nav-item" >
    //         { this.props.auth.isAuthenticated() ?
    //         <a className="nav-link" onClick={this.logout} href="#">Logout @{this.authinfo.user}</a> :
    //         <a className="nav-link" onClick={this.login} href="#">Login</a>
            
    //         }
    //             </li>
    //             <li>
    //                 <UserStats/>
    //                 </li>
    //         </ul>

    //     </div>
        
     
      );
    
    
    
  }

  
}

export default UserToolbar;