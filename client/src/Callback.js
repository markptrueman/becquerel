import React, { Component } from 'react';
import LoadingScreen from 'react-loading-screen';

class Callback extends Component {


    
  constructor( props ) {
    super(props)  
  }

  headers = () => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${this.props.auth.getAccessToken()}`
  });
      
componentDidMount() {
  console.log(JSON.stringify(this.props));
  fetch('/authorize', {
    headers : this.headers(),
    method: 'post',
  })
  .then(results => {
      return results.json();
  })
  .then(data => {
     
    })
}
     
     
      
    
  
 
  render() {

   
return (


  <div className="container">
   <LoadingScreen
    loading={true}
    bgColor='#ffffff'
    spinnerColor='#9ee5f8'
    textColor='#676767'
    //logoSrc='/logo.png'
    text='Authorising....'
  > 
    // ...
    // here loadable content
    // for example, async data
    //<div>Loadable content</div>
  </LoadingScreen>
  </div>
)};
}

export default Callback;