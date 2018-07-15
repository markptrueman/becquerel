import React, { Component } from 'react';

import './CurieStats.css';
import { Navbar, NavItem,Nav } from 'react-bootstrap';


class CurieStats extends Component {


    
  constructor( props ) {
      super( props );
       this.state = {
        
        
      }
     
    }

  render() {

    let curiestats = this.props.curiestats;

    //console.log("userstats = " + JSON.stringify(userstats));
    //userstats = {"approved":5,"rejected":1,"queued":0,"closed":0,"cs":"3.44","ar":83}
    let stats = curiestats ? 
        (
        
        <div className="curiediv">CurieVP = {curiestats.vp}% | Queue Size = {curiestats.queuesize}</div> 
    ) : '' ;

      return (
      // <Nav className="curieNav">
          <NavItem className="curieNav" eventKey={4}  href="#" >
            {stats}
            </NavItem>
        // </Nav>
        
     
      );
    
    
    
  }

  
}

export default CurieStats;