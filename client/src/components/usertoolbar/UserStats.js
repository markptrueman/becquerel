import React, { Component } from 'react';

import './UserStats.css';
import { Navbar, NavItem,Nav } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import moment from 'moment'


class UserStats extends Component {


    
  constructor( props ) {
      super( props );
       this.state = {
          displayPage: 2
        
      }
     
    }

    componentDidMount = () => {
      var intervalId = setInterval(this.timer, 5000);
      // store intervalId in the state so it can be accessed later:
      this.setState({intervalId: intervalId});
      this.timer();
    }
  
    componentWillUnmount = () => {
        clearInterval(this.state.intervalId);
  }
  
  timer = () => {
    let current = this.state.displayPage;
    if (current === 3)
    {
      current = 1;
    }
    else {
      current = current +1;
    }
      this.setState({"displayPage" : current});
  }

  render() {

    let userstats = this.props.userstats;

   
    //console.log("userstats = " + JSON.stringify(userstats));
    //userstats = {"approved":5,"rejected":1,"queued":0,"closed":0,"cs":"3.44","ar":83}
    let stats = "";
    if (this.state.displayPage === 1){

      stats = userstats ? 
            (
            
            <div key='1' className="statsdiv">App:{userstats.approved}, Rej:{userstats.rejected}, Closed:{userstats.closed}, Queued:{userstats.queued}, CS:{userstats.cs}, AR:{userstats.ar}%</div>
        ) : '' ;
      }
      else if (this.state.displayPage === 2) {
        stats = userstats ? 
            (
            
            <div key='2' className="statsdiv">{userstats && userstats.level ? userstats.level.description + ": " + userstats.level.minutes + " mins, " + (userstats.level.limit === 999 ? "∞" : userstats.level.limit) + " per week, " + userstats.softlimit + " per day."   : ''}</div>
        ) : '' ;
      }
      else if (this.state.displayPage === 3) {
        stats = userstats ? 
            (
            
            <div key='3' className="statsdiv">{userstats && userstats.nextslotopens ? "Next Slot Opens: " + moment(userstats.nextslotopens).utc().format('LLL') + " UTC" : 'Submission Slot Available'}</div>
        ) : '' ;
      }



      return (
      // <Nav pullLeft>
        <NavItem eventKey={3} >
          {/* <NavItem eventKey={3} onClick={this.showstats} href=""> */}
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
           <div className="statsouter" key={this.state.displayPage}>
            {stats}
           </div>
            </ReactCSSTransitionGroup>
            </NavItem>
        // </Nav>
        
     
      );
    
    
    
  }

  
}

export default UserStats;