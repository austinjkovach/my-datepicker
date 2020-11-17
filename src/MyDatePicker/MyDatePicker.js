import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MyDatePicker.css';

import CalendarControls from '../CalendarControls/index';
import CalendarBody from '../CalendarBody/index';

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
  monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  //////////////////////////////////////////////
  // 1) Create and return a single Day object //
  //////////////////////////////////////////////
  //
  // date       -> int
  // dayOfWeek  -> int (0 - 7)
  // month      -> int (0 - 11)
  // timestamp  -> int
  // dayString  -> 'Sunday' || 'Monday || etc.

  getDayDetails = args => {
    let date = args.index - args.firstDay;
    let dayOfWeek = args.index % 7;
    let prevMonth = args.month - 1;
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
        dayOfWeek,
        month,
        timestamp,
        dayString: this.daysMap[dayOfWeek]
    }
  }

  ///////////////////////////////////////////////////
  // 2) Return the number of days in a given month //
  ///////////////////////////////////////////////////
  getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  }

  ////////////////////////////////////
  // 3) Return array of Day objects //
  ////////////////////////////////////
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

  ///////////////////////////////////////////////////////////////////////////
  // 4) Return Object shaped { year, month, date} from "YYYY-MM-DD" string //
  ///////////////////////////////////////////////////////////////////////////
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

  ///////////////////////////////////
  // 5) Return "YYYY-MM-DD" string //
  ///////////////////////////////////
  getDateStringFromTimestamp = timestamp => {
    const dateObject = new Date(timestamp);
    const month = dateObject.getMonth()+1;
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();
    const paddedMonth = month < 10 ? '0' + month : month;
    const paddedDay = day < 10 ? '0' + day : day;

    return `${year}-${paddedMonth}-${paddedDay}`
  }

  //////////////////////////////////////////////////////////
  // 6) Update selectedDay if Input field is a valid Date //
  //////////////////////////////////////////////////////////
  updateDateFromInput = () => {
    const dateValue = inputRef.current.value; // Format: "YYYY-MM-DD"
    const dateData = this.getDateFromDateString(dateValue);

    if(dateData !== null) {
      let selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();

      this.setState({
        selectedDay,
        year: dateData.year,
        month: dateData.month - 1, // offset because JS Date months are zero-indexed
        monthDetails: this.getMonthDetails(dateData.year, dateData.month - 1)
      }, () => {
        if(this.props.onChange) {
          this.props.onChange(selectedDay);
        }
      })
    }
  }

  ////////
  // 7) //
  ////////
  setDateToInput = timestamp => {
    let dateString = this.getDateStringFromTimestamp(timestamp);
    inputRef.current.value = dateString;
  }

  ////////
  // 8) //
  ////////
  onDateClick = day => {
    this.setState({selectedDay: day.timestamp}, () => this.setDateToInput(day.timestamp));
    if(this.props.onChange) {
      this.props.onChange(day.timestamp);
    }
  }

  ////////
  // 9) //
  ////////
  setYear = offset => {
    let year = this.state.year + offset;
    let month = this.state.month;
    this.setState({
        year,
        monthDetails: this.getMonthDetails(year, month)
    });
  }

  /////////
  // 10) //
  /////////
  setMonth = offset => {
    let year = this.state.year;
    let month = this.state.month + offset;
    if(month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    this.setState({
      year,
      month,
      monthDetails: this.getMonthDetails(year, month)
    })
  }

  setToday = () => {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    this.setState({
      year,
      month,
      monthDetails: this.getMonthDetails(year, month)
    })
  }

  /**
   *  Renderers
   */

  //////////////
  // Calendar //
  //////////////
  render() {
    const { month, year } = this.state;
    return (
      <div className='MyDatePicker'>
        <div className='mdp-input' onClick={this.showDatePicker}>
          <input type='date' onChange={this.updateDateFromInput} ref={inputRef} />
        </div>
        {this.state.showDatePicker && (
          <div className='mdp-container'>
              <CalendarControls
                month={month}
                year={year}
                setYear={this.setYear}
                setMonth={this.setMonth}
                setToday={this.setToday}
              />
              <CalendarBody
                monthDetails={this.state.monthDetails}
                selectedDay={this.state.selectedDay}
                todayTimestamp={todayTimestamp}
                onDateClick={this.onDateClick}
              />
          </div>
        )}
      </div>
    )
  }
}

export default MyDatePicker;