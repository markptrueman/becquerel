import React, { Component } from 'react';
import './App.css';
import UserToolBar from './components/usertoolbar/UserToolbar';
import NavPanel from './components/navpanel/NavPanel';
import { Route , Redirect} from 'react-router-dom'
import AppWrapper from './AppWrapper';
import Callback from './Callback';
import Auth from './auth'
import queryString from 'query-string'



class App extends Component {


    
  constructor( props ) {
    super(props)  

    this.handleAuthentication = this.handleAuthentication.bind(this);

    this.auth = new Auth();
  }
      
     
 

  handleAuthentication = (nextState, replace) => {
    // do some kind of check here for the location
    //if (/access_token|id_token|error/.test(nextState.location.hash)) {
      this.auth.handleAuthentication(nextState.location);
    //}
  }
      
    
 
 

  render() {

   
      
      var auth = this.auth;

      return (
        <div>
        <Route exact path='/' render={(props) => <AppWrapper auth={auth} {...props} />}/>

         

        {/* <Route  path='/submit/:url' render={(props) => {
          return <Redirect to={{
            pathname: '/'
           
          }} />;
            }}/> */}
            

        {/* This is the route that gets called once we get a callback from steemconnect */}
        <Route path="/auth" render={(props) => {
          this.handleAuthentication(props);
          return <Callback auth={auth} {...props} />
        }}/>
        
        </div>
        
     
      );
    
    
    
  }

  
}

export default App;
