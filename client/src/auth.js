
import queryString from 'query-string';

export default class Auth {
  // Please use your own credentials here
//   auth0 = new auth0.WebAuth({
//     domain: 'divyanshu.auth0.com',
//     clientID: 'TJyKPI6aRiRwgr6SxlT7ExW10NEHW4Vy',
//     redirectUri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://appbaseio-apps.github.io/reactivesearch-auth0-example/callback',
//     audience: 'https://divyanshu.auth0.com/userinfo',
//     responseType: 'token id_token',
//     scope: 'openid'
//   });

  login = () => {
      // get our server to call steemconnect which redirects to a callback
   // this.auth0.authorize();
   console.log("authorising");
    fetch('/authorize', { method: 'POST'})
    .then(response => {
        // HTTP 301 response
      //  console.log("Response from login is : " + response);
     //   console.log("redirecting client to /authorize");
        window.location.href = response.url; // this will redirect us to the callback url (/auth)
    })
    .catch(function(err) {
        console.info(err);
    });
  }

  logout = () => {
    // Clear access token and ID token from local storage
    localStorage.removeItem('authtoken');
   
    // navigate to the home route
    window.location.href = '/'
  }

  // we get here after we return from the steemconnect login
  handleAuthentication = (props) => {
    if (props && props.search) {

     
      var parsedQueryString = queryString.parse(props.search);
     // console.log("handleauthentication after redirect" + JSON.stringify(parsedQueryString));
      // save stuff
     

    //  console.log(JSON.stringify(props));

      

      // send the newly created auth stuff over to steemconnect via our own endpoint

      var hdrs = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${parsedQueryString.access_token}`
      };

      fetch('/authorize', {
        headers : hdrs,
        method: 'post',
      })
      .then(results => {
       
       // this.setSession(parsedQueryString);
          return results.json();
          window.location.href = '/';
      })
      .then(data => {
      //  console.log("Results = " + JSON.stringify(data));
          this.setSession(data);
          window.location.href = '/';
        })

     // 
  

    }
      
    // this.auth0.parseHash((err, authResult) => {
    //   if (authResult && authResult.accessToken && authResult.idToken) {
    //     this.setSession(authResult);
    //     history.replace('/');
    //   } else if (err) {
    //     history.replace('/');
    //     console.log(err);
    //   }
    // });
  }

  // Sets user details in localStorage
  setSession = (parsedQueryString) => {
    // Set the time that the access token will expire at
    //console.log("setting session " + JSON.stringify(parsedQueryString));
    let expiresAt = JSON.stringify((parsedQueryString.expires_in * 1000) + new Date().getTime());
    
    localStorage.setItem('authtoken', JSON.stringify(parsedQueryString));
    // navigate to the home route
   // window.location.href = '/'
  }

  // removes user details from localStorage
 

  // checks if the user is authenticated
  isAuthenticated = () => {
    //  console.log("checking is authenticated");
    // Check whether the current time is past the
    // access token's expiry time
    if (localStorage.getItem('authtoken')) {
     // console.log(localStorage.getItem('authtoken'));
      var expiresAt = JSON.parse(localStorage.getItem('authtoken')).expires_in;
     // console.log("expires at " + expiresAt);
      return new Date().getTime() < expiresAt;

    }
    return false;
  }

  canView = (perm) => {
    // check the local storage for the permission required
    const authinfo = JSON.parse(localStorage.getItem('authtoken'));
    if (authinfo) {
      if (perm==='curator' && authinfo.curator === true) return true;
      if (perm==='reviewer' && authinfo.reviewer === true) return true;
      if (perm==='accounter' && authinfo.accounter === true) return true;
      if (perm==='administrator' && authinfo.administrator === true) return true;
    }
    return false;
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('authtoken');
    if (!accessToken) {
        //throw new Error('No access token found');
        return null;
    }
    return accessToken;
}


}