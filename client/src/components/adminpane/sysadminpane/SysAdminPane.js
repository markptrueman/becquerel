import React, { Component } from 'react';
import {ListGroup, ListGroupItem, FormGroup , FormControl, ControlLabel, InputGroup} from 'react-bootstrap'
import './SysAdminPane.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'


class SysAdminPane extends Component {

  headers = () => ({
    'Content-Type': 'application/json',
   // Accept: 'application/json',
   
    Authorization: `Bearer ${this.props.auth.getAccessToken()}`
  });

  constructor( props ) {
    super( props );
     this.state = {
      
      
    }
    this.levelClicked = this.levelClicked.bind(this);
  }
 
  levelClicked= (level) => {
    //console.log("LevelClicked" + JSON.stringify(level));
    this.setState({"selectedlevel" : level});
  }

  handlelevelchange = (event) =>
    {
      const levelname = event.target.value;
      const foo = Object.assign({}, this.state.selectedlevel);
      foo['description'] = levelname;
      this.setState({"selectedlevel" : foo});

    }
  handlelimitchange = (event) =>
    {
      const limit = event.target.value;
      const foo = Object.assign({}, this.state.selectedlevel);
      foo['limit'] = limit;
      this.setState({"selectedlevel" : foo});

    }
    handleminuteschange = (event) =>
    {
      const mins = event.target.value;
      const foo = Object.assign({}, this.state.selectedlevel);
      foo['minutes'] = mins;
      this.setState({"selectedlevel" : foo});

    }

    saveLevel = () => {
      fetch('/users/level/', {
          method: 'post',
          headers: this.headers(),
          body: JSON.stringify(this.state.selectedlevel)
     })
      .then(results => {
          return results.json();
      })
      .then(data => { 
      
          // update this.props.allusers with the saved values
        this.props.loadLevels();
  
         
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

    getValidationState = () =>{
      const length = this.state.selectedlevel.description.length;
      if (length === 0) return 'error';
      var found = false;
      if (this.props.levels)
      {
          for (var i = 0; i < this.props.levels.length; i++)
          {
            if (this.state.selectedlevel.description === this.props.levels[i].description)
            {
              found = true;
            }
          }
      }
      if (found) return 'error';
      return 'success';
  
    }

    newLevel = () => {
      // call the newUserhandler
      const foo = {};
      foo.description = "newLevel";
      foo.newlevel = true;
      foo.limit=5;
      foo.minutes = 150
      let maxLevelNo = 0;
      for (var i = 0; i < this.props.levels.length; i++){
        if (this.props.levels[i].level > maxLevelNo)
        {
          maxLevelNo = this.props.levels[i].level;
        }
      }
      foo.level = maxLevelNo+1;
      this.setState({"selectedlevel" : foo});

    }

   doDelete = () => {
    fetch('/users/level/delete', {
      method: 'post',
      headers: this.headers(),
      body: JSON.stringify(this.state.selectedlevel)
    })
      .then(results => {
          return results.json();
      })
      .then(data => {
        this.levelClicked(null)
          //this.setState({"allusers" : users});
          this.props.loadLevels();
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

  deleteLevel = () => {
    confirmAlert({
      title: 'Confirm to delete this level',                        // Title dialog
      message: 'Are you sure you want to delete this level (' + this.state.selectedlevel.description + ') ?',               // Message dialog
      
      confirmLabel: 'Confirm',                           // Text button confirm
      cancelLabel: 'Cancel',                             // Text button cancel
      onConfirm: () => this.doDelete(),    // Action after Confirm
     // onCancel: () => alert('Action after Cancel'),      // Action after Cancel - nothing
    })

    console.log("delete level " + JSON.stringify(this.state.selectedlevel));
      
     
  }

  render() {

    //console.log(this.props.levels);
    var rowslist = null;

    if (this.props && this.props.levels && this.props.levels.length > 0){
      rowslist = this.props.levels.map(function(row) 
      {
        
          return (
            <ListGroupItem key={row.description} onClick={this.levelClicked.bind(null, row)}>{row.description}</ListGroupItem>
             
              )  
                    

      }, this);

    }

    var form = null;
    if (this.state.selectedlevel)
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
            <ControlLabel>Level</ControlLabel>
            <InputGroup>
               
            <FormControl
              type="text"
              value={this.state.selectedlevel.description}
              placeholder="Enter text"
              onChange={this.handlelevelchange}
            />
            </InputGroup>
             
            </div>
            </FormGroup>
           
            <FormGroup>
            
              
            <div className="buttonwrapper">
            
              <div className="weeklyouter">
              <InputGroup>
                <InputGroup.Addon>Weekly Submission Limit</InputGroup.Addon>
              <FormControl
                type="text"
                value={this.state.selectedlevel.limit}
                placeholder="Enter text"
                onChange={this.handlelimitchange}
              />
              
              </InputGroup>
              </div>

              <div className="levelouter">
              <InputGroup>
                <InputGroup.Addon>Minimum Wait Minutes</InputGroup.Addon>
              <FormControl
                type="text"
                value={this.state.selectedlevel.minutes}
                placeholder="Enter text"
                onChange={this.handleminuteschange}
              />
              
              </InputGroup>
              </div>
            

              <a className="btn btn-success" onClick={() => this.saveLevel()} href="#"><i className="fa fa-save"></i> Save Level</a>
            </div>

          </FormGroup>
        </form>
        </div>)
    }

      return (

      <div className="sysAdminPaneOuter">

        
       
        
       <div className={this.state.response ? ['response', this.state.responseClasses].join(' ') : ['responseErr', this.state.responseClasses].join(' ') }>
         {this.state.response ? this.state.response : this.state.err}.
       </div>
        <div className="adminpane">
          <div className="leftpane">
            <div className="levelselectorouter">
         
              <ListGroup className="listgroup">
                 {rowslist} 
              </ListGroup>
        
            </div>

          <div className="buttonsouter">
         <div>
           <a className="btn btn-success" onClick={() => this.newLevel()} href="#"><i className="fa fa-user-plus"></i> Create Level</a>
          </div>
           
           <div>
           <a className="btn btn-danger" onClick={(e) => this.deleteLevel(e)} href="#"><i className="fa fa-user-times"></i> Delete Level</a>
           </div>
        </div>
          
      
        </div>
         
         
         <div className="userdetailsouter">
         

           {form}
          
         </div>
      
       </div>
       
       

    
     </div>
        
     
      );
    
      
    
  }

  
}

export default SysAdminPane;