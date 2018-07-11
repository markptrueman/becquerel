import React, { Component } from 'react';
import  { ListGroup, ListGroupItem, FormGroup , Checkbox, FormControl, ControlLabel, InputGroup} from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import Select from 'react-select';
import 'react-select/dist/react-select.css';



import './UserManagementDiv.css';

class UserManagementDiv extends Component {
  
  headers = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
   
    Authorization: `Bearer ${this.props.auth.getAccessToken()}`
  });

    
  constructor( props ) {
      super( props );
       this.state = {
        
        
      }

      this.userClicked = this.userClicked.bind(this);
      this.checkChanged = this.checkChanged.bind(this);
      this.newUser = this.newUser.bind(this);
      this.deleteUser = this.deleteUser.bind(this); 
      
    }

    handleChangeLevel = (selectedOption) => {
      console.log(selectedOption)
      const foo = Object.assign({}, this.state.selecteduser);
      foo.level = selectedOption.value;

        this.setState({"selecteduser" : foo});
      
    }

    userClicked= (user) => {
      console.log("UserClicked" + JSON.stringify(user));
      this.setState({"selecteduser" : user});
    }

    

    checkChanged = (event) =>
    {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name =  target.name;
      console.log("name = " + name + ", value = " + value );
     
      const foo = Object.assign({}, this.state.selecteduser);
      foo[name] = value;

        console.log(foo); 

        this.setState({"selecteduser" : foo});
    }

    handleuserchange = (event) =>
    {
      const username = event.target.value;
      const foo = Object.assign({}, this.state.selecteduser);
      foo['user'] = username;
      this.setState({"selecteduser" : foo});

    }

    handlesoftlimitchange = (event) =>
    {
      const limit = event.target.value;
      const foo = Object.assign({}, this.state.selecteduser);
      foo['dailySoftLimit'] = limit;
      this.setState({"selecteduser" : foo});

    }
  
    getValidationState = () =>{
      const length = this.state.selecteduser.user.length;
      if (length === 0) return 'error';
      var found = false;
      if (this.props.allusers)
      {
          for (var i = 0; i < this.props.allusers.length; i++)
          {
            if (this.state.selecteduser.user === this.props.allusers[i].user)
            {
              found = true;
            }
          }
      }
      if (found) return 'error';
      return 'success';
  
    }
 
    newUser = () => {
      // call the newUserhandler
      const foo = {};
      foo.user = "newUserName";
      foo.newuser = true;
      foo.curator = true; 
      foo.level=3;
      this.setState({"selecteduser" : foo});

    }

   doDelete = () => {
    fetch('/users/delete/', {
      method: 'post',
      headers: this.headers(),
      body: JSON.stringify(this.state.selecteduser)
    })
      .then(results => {
          return results.json();
      })
      .then(data => {
        this.userClicked(null)
          //this.setState({"allusers" : users});
          this.props.loadUserDetails();
          this.setState({"responseClasses" : 'show'});

          if (data.response)
          {
           
            this.setState({"response": data.response, "err" : null });
          
          }
          else if (data.err)
          {
            this.setState({"err": data.err, "response" : null});
          }
          setTimeout(() => {
            this.setState({"responseClasses" : '', "response": null, "err": null});
            
            
        }, 4000);

      });
   }

  deleteUser = () => {
    confirmAlert({
      title: 'Confirm to delete this user',                        // Title dialog
      message: 'Are you sure you want to delete this user?',               // Message dialog
      
      confirmLabel: 'Confirm',                           // Text button confirm
      cancelLabel: 'Cancel',                             // Text button cancel
      onConfirm: () => this.doDelete(),    // Action after Confirm
     // onCancel: () => alert('Action after Cancel'),      // Action after Cancel - nothing
    })

    console.log("delete user " + JSON.stringify(this.state.selecteduser));
      
     
  }

  saveUser = () => {
    fetch('/users/update/', {
        method: 'post',
        headers: this.headers(),
        body: JSON.stringify(this.state.selecteduser)
   })
    .then(results => {
        return results.json();
    })
    .then(data => { 
    
        // update this.props.allusers with the saved values
      this.props.loadUserDetails();

       
        this.setState({"responseClasses" : 'show'});

        if (data.response)
        {
         
          this.setState({"response": data.response, "err" : null });
        
        }
        else if (data.err)
        {
          this.setState({"err": data.err, "response" : null});
        }
        setTimeout(() => {
          this.setState({"responseClasses" : '', "response": null, "err": null});
          
          
      }, 4000);
        
   

    });
   
}

  render() {
    var rowslist = null;

    if (this.props && this.props.allusers && this.props.allusers.length > 0){
      rowslist = this.props.allusers.map(function(row) 
      {
        
          return (
            <ListGroupItem key={row.user} onClick={this.userClicked.bind(null, row)}>{row.user}</ListGroupItem>
             
              )  
                    

      }, this);

    }

    var levellist = []; //  this needs to be a json list - ie  { value: 'one', label: 'One' }, { value: 'one', label: 'One' },
    if (this.props && this.props.levels && this.props.levels.length > 0){
      for (var i = 0 ; i < this.props.levels.length; i++)
      {
        var level = {};
        level.value = this.props.levels[i].level;
        level.label = this.props.levels[i].description + "("+ this.props.levels[i].limit + "/" + this.props.levels[i].minutes + ")";
        levellist.push(level)
      }
    } 

    var form = null;
    if (this.state.selecteduser)
    {
      form = ( 
        <div> 
        {/* <div className="userheader">
          @{this.state.selecteduser ? this.state.selecteduser.user : null}
        </div> */}
      
      <form>
        <FormGroup  
            controlId="formBasicText"
            validationState={this.getValidationState()}>
            <div className="usernamewrapper">
            <ControlLabel>Steem username</ControlLabel>
            <InputGroup>
               <InputGroup.Addon>@</InputGroup.Addon>
            <FormControl
              type="text"
              value={this.state.selecteduser.user}
              placeholder="Enter text"
              onChange={this.handleuserchange}
            />
             <FormControl.Feedback />
            </InputGroup>
             
            </div>
            </FormGroup>
           
            <FormGroup>
            {this.props.allowRoleChange ? (
              <div>
            <Checkbox inline name="curator" onChange={this.checkChanged} checked={this.state.selecteduser.curator }>Curator</Checkbox>
            <Checkbox inline name="reviewer" onChange={this.checkChanged} checked={this.state.selecteduser.reviewer }>Reviewer</Checkbox>
            <Checkbox inline name="accounter" onChange={this.checkChanged} checked={this.state.selecteduser.accounter}>Accounter</Checkbox>
            <Checkbox inline name="administrator" onChange={this.checkChanged} checked={ this.state.selecteduser.administrator}>Administrator</Checkbox>
            </div>
             ) : '' }
             <div className="selectouter">
            <Select
              name="curator-level"
              clearable={false}
              value={this.state.selecteduser ? this.state.selecteduser.level : null}
              onChange={this.handleChangeLevel}
              options={levellist} />
              </div>
              <Checkbox inline name="enabled" onChange={this.checkChanged} checked={ this.state.selecteduser.enabled}>Enabled</Checkbox>
            <div className="buttonwrapper">
            
              <div className="softLimitOuter">
                <InputGroup>
                <InputGroup.Addon>Soft Limit</InputGroup.Addon>
              <FormControl
                type="text"
                value={this.state.selecteduser.dailySoftLimit}
                placeholder="Enter text"
                onChange={this.handlesoftlimitchange}
              />
              <FormControl.Feedback />
              </InputGroup>
              </div>
            

            <a className="btn btn-success" onClick={() => this.saveUser()} href="#"><i className="fa fa-save"></i> Save User</a>
            </div>

          </FormGroup>
        </form>
        </div>)
    }

   

      return (
      <div className="adminpaneouter">
       
        
        <div className={this.state.response ? ['response', this.state.responseClasses].join(' ') : ['responseErr', this.state.responseClasses].join(' ') }>
          {this.state.response ? this.state.response : this.state.err}.
        </div>
       <div className="adminpane">
        <div className="leftpane">
          <div className="userselectorouter">
          
            <ListGroup className="listgroup">
              {rowslist}
            </ListGroup>
         
          </div>

          <div className="buttonsouter">
          <div>
            <a className="btn btn-success" onClick={() => this.newUser()} href="#"><i className="fa fa-user-plus"></i> Create User</a>
            </div>
            { this.props.allowDelete ? (
            <div>
            <a className="btn btn-danger" onClick={(e) => this.deleteUser(e)} href="#"><i className="fa fa-user-times"></i> Delete User</a>
            </div>) : '' }
            </div>
           
       
          </div>
          
          
          <div className="userdetailsouter">
          

            {form}
           
          </div>
          </div>
        </div>
        
     
      );
    
    return null;
    
  }

  
}

export default UserManagementDiv;