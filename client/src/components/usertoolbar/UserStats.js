import React, { Component } from 'react';

import './UserToolbar.css';
import { Navbar, NavItem,Nav } from 'react-bootstrap';


class UserStats extends Component {


    
  constructor( props ) {
      super( props );
       this.state = {
        
        
      }
     
    }

  render() {

    let userstats = this.props.userstats;

    //console.log("userstats = " + JSON.stringify(userstats));
    //userstats = {"approved":5,"rejected":1,"queued":0,"closed":0,"cs":"3.44","ar":83}
    let stats = userstats ? 
        (
        
        <div>This Week - App:{userstats.approved}, Rej:{userstats.rejected}, Closed:{userstats.closed}, Queued:{userstats.queued}, CS:{userstats.cs}, AR:{userstats.ar}%</div>
    ) : '' ;

      return (
      <Nav>
        <NavItem eventKey={3}  href="#">
          {/* <NavItem eventKey={3} onClick={this.showstats} href=""> */}
            {stats}
            </NavItem>
        </Nav>
        
     
      );
    
    
    
  }

  
}

export default UserStats;