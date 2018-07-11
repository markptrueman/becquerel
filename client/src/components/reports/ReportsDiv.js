import React, { Component } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';

import './ReportsDiv.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class ReportsDiv extends Component {


    
  constructor( props ) {
      super( props );
       this.state = {
          start : null,
          end : null
        
      }
      
    }
  
    generateCuratorReport = (event)  => {
      //console.log("generating report between " + this.state.start.format() + " and " + this.state.end.format());
      event.preventDefault();
      this.props.generateCuratorReport(this.state.start,this.state.end, this.state.selecteduser)
      
    }

    generateDetailedCuratorReport = (event)  => {
      //console.log("generating report between " + this.state.start.format() + " and " + this.state.end.format());
      event.preventDefault();
      this.props.generateDetailedCuratorReport(this.state.start,this.state.end,this.state.selecteduser)
      
    }

    generateReviewerReport = (event)  => {
      //console.log("generating report between " + this.state.start.format() + " and " + this.state.end.format());
      event.preventDefault();
      this.props.generateReviewerReport(this.state.start,this.state.end,)
      
    }
 
    startChanged = (time) => {
      this.setState({start : moment(time)});
      console.log("start changed " + moment(time).format());
    }

    endChanged = (time) => {
      this.setState({end : moment(time)});
      console.log("end changed " + moment(time).format());
    }

    handleUserChange = (selectedOption) => {
      console.log(selectedOption)
     
      this.setState({"selecteduser" : selectedOption ? selectedOption.value : null});
      
    }

    setDates = (type) => {
      console.log("setting dates" + type)
      if (type == 1)
      {
        // this week - from sunday just gone at 15:00 utc to now
        let sundayTemp = moment().utc().startOf('week');
        // if this sundaytemp is today and we are still before 1500 UTC, take 7 days off
        if (sundayTemp.isSame(moment().utc(), 'day'))
        {
          console.log ("its sunday");
       
          if (moment().utc().isBefore(moment('15:00Z', 'HH:mmZ'), 'hour')){
             console.log("before 15:00")
             sundayTemp = sundayTemp.subtract(7, 'days');
          } else{
            console.log("after 15:00");
          }
        }
        let time = "15:00Z"
        let date = sundayTemp.format("YYYY-MM-DD");
        let sunday = moment(date + 'T' + time);
        console.log("previous sunday = "+ sunday.format());
        this.setState({start : sunday})
        this.setState({end : moment().utc()});
        
      }
      else if (type == 2)
      {
        // last week - from sunday just gone at 15:00 utc to now
        let sundayTemp = moment().utc().startOf('week').subtract(7, 'days');
        // if this sundaytemp is today and we are still before 1500 UTC, take 7 days off
        if (sundayTemp.isSame(moment().utc().subtract(7, 'days'), 'day'))
        {
          console.log ("its sunday");
       
          if (moment().utc().isBefore(moment('15:00Z', 'HH:mmZ'), 'hour')){
             console.log("before 15:00")
             sundayTemp = sundayTemp.subtract(7, 'days');
          } else{
            console.log("after 15:00");
          }
        }
        let time = "15:00Z"
        let date = sundayTemp.format("YYYY-MM-DD");
        let sunday = moment(date + 'T' + time);
        console.log("previous sunday = "+ sunday.format());
        this.setState({start : moment(sunday)})
        this.setState({end : sunday.add(7, 'days')});
        
      }
      else if (type == 3)
      {
        // this month, from 15:00 on the last day of last month until now
        // get what you think is the last day of last month

        // if we are on the last day of the month, we could be in this month or last month
        let time = "15:00Z";
        let today = moment().utc();
        let firstOfMonth = null;
        let lastOfMonth = null;
        if (today.isSame(moment().utc().endOf('month')))
        {
          console.log("we are on the last day of the month")
          // if we are after 15:00 utc then first day of month is today
          if (moment().utc().isAfter(moment('15:00Z', 'HH:mmZ'), 'hour'))
          {
            firstOfMonth = moment(moment().utc().format("YYYY-MM-DD") + 'T' + time);
            // the last day of the month is 15:00 at the end of next month
           let lastDayTemp = moment().add(1, 'days').endOf('month')
           lastOfMonth = moment(lastDayTemp.format('YYYY-MM-DD') + 'T' + time);

          }
          else
          {
            // we are before 15:00, so today is the last day of the month
            let firstOfMonthTemp = moment().utc().subtract(1, 'days').startOf('month').subtract(1, 'days');
            firstOfMonth = moment(firstOfMonthTemp.format("YYYY-MM-DD") + 'T' + time);
            lastOfMonth = moment(moment().format('YYYY-MM-DD') + 'T' + time);
          }
          
        }
        else {
          // we are not on the last day of the month, so that's easier
          let firstOfMonthTemp = moment().utc().startOf('month').subtract(1, 'days');
          firstOfMonth = moment(firstOfMonthTemp.format('YYYY-MM-DD')+ 'T' + time);

          let lastOfMonthTemp = moment().utc().endOf('month');
          lastOfMonth = moment(lastOfMonthTemp.format('YYYY-MM-DD') + 'T' + time);

        }

        this.setState({start : firstOfMonth})
        this.setState({end : lastOfMonth});

      }
      else if (type == 4)
      {
        // last month, from 15:00 on the last day of last month until now
        // get what you think is the last day of last month

       // this month, from 15:00 on the last day of last month until now
        // get what you think is the last day of last month

        // if we are on the last day of the month, we could be in this month or last month
        let time = "15:00Z";
        let today = moment().utc();
        let firstOfMonth = null;
        let lastOfMonth = null;
        if (today.isSame(moment().utc().endOf('month')))
        {
          console.log("we are on the last day of the month")
          if (moment().utc().isAfter(moment('15:00Z', 'HH:mmZ'), 'hour'))
          {
            console.log("we are after 15:00 on the last of the month")
            // last month actuall ends today
            lastOfMonth = moment(moment().utc().format("YYYY-MM-DD") + 'T' + time);
           // last month starts 
           let firstDayTemp = moment().substract(35, 'days').endOf('month');
           firstOfMonth = moment(firstDayTemp.format('YYYY-MM-DD') + 'T' + time);

          }
          else
          {
            // we are before 15:00, so last month ended a whole month ago
            let endOfMonthTemp = moment().utc().subtract(35, 'days').endOf('month');
            let firstOfMonthTemp = moment().utc().subtract(35, 'days').startOf('month').subtract(1, 'days');
            firstOfMonth = moment(firstOfMonthTemp.format("YYYY-MM-DD") + 'T' + time);
            lastOfMonth = moment(endOfMonthTemp.format('YYYY-MM-DD') + 'T' + time);
          }
          
        }
        else {
          // we are not on the last day of the month, so that's easier
          let firstOfMonthTemp = moment().utc().startOf('month').subtract(1, 'days').startOf('month').subtract(1, 'days');
          firstOfMonth = moment(firstOfMonthTemp.format('YYYY-MM-DD')+ 'T' + time);

          let lastOfMonthTemp = moment().utc().startOf('month').subtract(1,'days');
          lastOfMonth = moment(lastOfMonthTemp.format('YYYY-MM-DD') + 'T' + time);

        }

        this.setState({start : firstOfMonth})
        this.setState({end : lastOfMonth});
      }
    }

  render() {

    var userlist = []; //  this needs to be a json list - ie  { value: 'one', label: 'One' }, { value: 'one', label: 'One' },
    if (this.props && this.props.allusers && this.props.allusers.length > 0){
      for (var i = 0 ; i < this.props.allusers.length; i++)
      {
        var user = {};
        user.value = this.props.allusers[i].user;
        user.label = this.props.allusers[i].user;
        userlist.push(user)
      }
    } 

    var curatorReport = (
      <div className="buttonwrap">
            <a className="btn btn-success" onClick={this.generateCuratorReport} href="#" disabled={this.state.start == null || this.state.end==null}><i className="fa fa-cogs"></i> Generate Basic<br/>Report</a>
        </div>
    )

    var detailedReport = (
      <div className="buttonwrap">
        <a className="btn btn-success" onClick={this.generateDetailedCuratorReport} href="#" disabled={this.state.start == null || this.state.end==null}><i className="fa fa-cogs"></i> Generate Detailed<br/>Report</a>
      </div>
    )

    var reviewerReport = (
      <div className="buttonwrap">
              <a className="btn btn-success" onClick={this.generateReviewerReport} href="#" disabled={this.state.start == null || this.state.end==null}><i className="fa fa-cogs"></i> Generate Reviewer<br/>Report</a>
            </div>
    )

    

      return (

        <div className="accountsmain">
        <div>
          <div className="titletext">
            Generate  report :
          </div>
          <div className="accountspane">
        
            <div className="calwrapper">
              From:
              <Datetime utc={true} onChange={this.startChanged} value={this.state.start}/>
            </div>
         
            <div className="calwrapper">
              To:
              <Datetime utc={true} onChange={this.endChanged} value={this.state.end}/>
            </div>
            <div className="dropdownwrapper">
              User:
              <Select
              name="curator"
              clearable={true}
              value={this.state.selecteduser ? this.state.selecteduser : null}
              onChange={this.handleUserChange}
              options={userlist}
              placeholder="All Users" />
            </div>



      </div>
     
        {/* preset buttons */}
        <div className="buttonswrapper">
          <div className="buttonwrap">
              <a className="btn btn-info" onClick={() => this.setDates(1)} href="#" >
                          <i className="fa  fa-calendar"></i> This Week</a>
          </div>
          <div className="buttonwrap">        
              <a className="btn btn-info" onClick={() => this.setDates(2)} href="#">
                          <i className="fa fa-calendar"></i> Last Week</a>
            </div>

            <div className="buttonwrap">        
              <a className="btn btn-info" onClick={() => this.setDates(3)} href="#">
                          <i className="fa fa-calendar"></i> This Month</a>
            </div>

            <div className="buttonwrap">        
              <a className="btn btn-info" onClick={() => this.setDates(4)} href="#">
                          <i className="fa fa-calendar"></i> Last Month</a>
            </div>
        

       
        </div>
        <div className="buttonswrapper">
            
            {this.props.showcuratorreport ? curatorReport : null}
           
            {this.props.showdetailedreport ? detailedReport : null}
            
            {this.props.showreviewerreport ? reviewerReport : null}
          </div>
        </div>
        
        </div>
        
     
      );
    
    
    
  }

  
}

export default ReportsDiv;