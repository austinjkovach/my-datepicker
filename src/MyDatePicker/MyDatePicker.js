import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MyDatePicker.css';


const oneDay = 60 * 60 * 24 * 1000;
const todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 100 * 60);
const inputRef = React.createRef();

class MyDatePicker extends Component {

  constructor(props) {
    super(props);

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    this.state = {
      year,
      month,
      selectedDay: todayTimestamp,
      monthDetails: this.getMonthDetails(year, month),
      showDatePicker: false,
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.removeBackDrop);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.removeBackDrop);
  }

  removeBackDrop = e => {
    if(this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
      this.hideDatePicker()
    }
  }

  showDatePicker = () => {
    this.setState({ showDatePicker: true });
  }

  hideDatePicker = () => {
    this.setState({ showDatePicker: false });
  }

    /**
     *  Core
     */

  daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  daysAbbrevMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  ///////////////////////////////////////////
  // Create and return a single Day object //
  ///////////////////////////////////////////
  getDayDetails = args => {
    let date = args.index - args.firstDay;
    let day = args.index%7;
    let prevMonth = args.month-1;
    let prevYear = args.year;
    if(prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
    }
    let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
    let _date = (date < 0 ? prevMonthNumberOfDays+date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
        date: _date,
        day,
        month,
        timestamp,
        dayString: this.daysMap[day]
    }
  }

  ////////////////////////////////////////////////
  // Return the number of days in a given month //
  ////////////////////////////////////////////////
  getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  }

  /////////////////////////////////
  // Return array of Day objects //
  /////////////////////////////////
  getMonthDetails = (year, month) => {
    const firstDay = (new Date(year, month)).getDay(); //==> first day of month MM/YY
    const numberOfDays = this.getNumberOfDays(year, month); //==> number of days in month
    const monthArray = [];
    const rows = 6;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for(let row=0; row<rows; row++) {
      for(let col=0; col<cols; col++) {
          currentDay = this.getDayDetails({
              index,
              numberOfDays,
              firstDay,
              year,
              month
          });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  }


  isCurrentDay = day => day.timestamp === todayTimestamp;
  isSelectedDay = day => day.timestamp === this.state.selectedDay;

  ////////////////////////////////////////////////////////////////////////
  // Return Object shaped { year, month, date} from "YYYY-MM-DD" string //
  ////////////////////////////////////////////////////////////////////////
  getDateFromDateString = dateValue => {
    let dateData = dateValue.split('-').map(d=> parseInt(d, 10));
    if(dateData.length < 3) {
      return null;
    }

    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return { year, month, date }
  }

  getMonthStr = month => this.monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

  ////////////////////////////////
  // Return "YYYY-MM-DD" string //
  ////////////////////////////////
  getDateStringFromTimestamp = timestamp => {
    const dateObject = new Date(timestamp);
    const month = dateObject.getMonth()+1;
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();
    const paddedMonth = month < 10 ? '0' + month : month;
    const paddedDay = day < 10 ? '0' + day : day;

    return `${year}-${paddedMonth}-${paddedDay}`
  }

  updateDateFromInput = () => {
    const dateValue = inputRef.current.value;
    const dateData = this.getDateFromDateString(dateValue);

    if(dateData !== null) {
      this.shouldComponentUpdate(dateData);
      this.setState({
        year: dateData.year,
        month: dateData.month - 1,
        monthDetails: this.getMonthDetails(dateData.year, dateData.month - 1)
      })
    }
  }

  setDateToInput = timestamp => {
    let dateString = this.getDateStringFromTimestamp(timestamp);
    inputRef.current.value = dateString;
  }

  onDateClick = day => {
    this.setState({selectedDay: day.timestamp}, () => this.setDateToInput(day.timestamp));
    if(this.props.onChange) {
      this.props.onChange(day.timestamp);
    }
  }


  /**
   *  Renderers
   */

  //////////////
  // Calendar //
  //////////////
  renderCalendar() {
    const days = this.state.monthDetails.map((day, index) => {
      const disabledClass = day.month !== 0 ? ' disabled' : '';
      const highlightedClass = this.isCurrentDay(day) ? ' highlight' : '';
      const selectedClass = this.isSelectedDay(day) ? ' highlight-green' : '';
      const className  = `c-day-container${disabledClass}${highlightedClass}${selectedClass}`
      return (
        <div className={className} key={index}>
          <div className='cdc-day'>
            <span onClick={()=>this.onDateClick(day)}>
              {day.date}
            </span>
          </div>
        </div>
      )
    });

    return (
      <div className='c-container'>
        <div className='cc-head'>
          {this.daysAbbrevMap.map((d, i) => <div key={i} className='cch-name'>{d}</div>)}
        </div>
        <div className='cc-body'>
          {days}
        </div>
      </div>
    )
  }

  /////////////////////////
  // The Rest of the Owl //
  /////////////////////////
  render() {
    return (
      <div className='MyDatePicker'>
        <div className='mdp-input' onClick={this.showDatePicker}>
            <input type='date' onChange={this.props.onChange} ref={inputRef} />
        </div>
        {this.state.showDatePicker ? (
            <div className='mdp-container'>
                <div className="mdpc-head">
                  <div className="mdpch-button">
                    <div className="mdpch-inner" onClick={() => null/* TODO this.setYear(-1) */}>
                      <span className="mdpchbi-left-arrows"></span>
                    </div>
                  </div>
                  <div className="mdpch-button">
                    <div className="mdpchb-inner" onClick={() => null /* TODO this.setMonth(-1) */}>
                      <span className="mdpchbi-left-arrow"></span>
                    </div>
                  </div>
                  <div className='mdpch-container'>
                    <div className='mdpchc-year'>{this.state.year}</div>
                    <div className='mdpchc-month'>{this.getMonthStr(this.state.month)}</div>
                  </div>
                  <div className='mdpch-button'>
                    <div className='mdpchb-inner' onClick={()=> null /* this.setMonth(1) */}>
                      <span className='mdpchbi-right-arrow'></span>
                    </div>
                  </div>
                  <div className='mdpch-button' onClick={()=> null /*this.setYear(1) */}>
                    <div className='mdpchb-inner'>
                      <span className='mdpchbi-right-arrows'></span>
                    </div>
                  </div>
                </div>
                <div className="mdpc-body">
                  {this.renderCalendar()}
                </div>
            </div>
        ) : ''}
      </div>
    )
  }
}

export default MyDatePicker;