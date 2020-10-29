import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MyDatePicker.css';


const oneDay = 60 * 60 * 24 * 1000;
const todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 100 * 60);
const inputRef = React.createRef();

export default class MyDatePicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      getMonthDetails: [],
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

  getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  }

  isCurrentDay = day => day.timestamp === todayTimestamp;
  isSelectedDay = day => day.timestamp === this.state.selectedDay;

  getMonthDetails = (year, month) => {
    const firstDay = (new Date(year, month)).getDay();
    const getNumberOfDays = this.getNumberOfDays(year, month);
    const monthArray = [];
    const rows = 6;
    const currentDay = null;
    let index = 0;
    let cols = 7;

  }

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
                    <div className="mdpch-inner" onClick={() => this.setYear(-1)}>
                      <span className="mdpchbi-left-arrows"></span>
                    </div>
                  </div>
                  <div className="mdpch-button">
                    <div className="mdpchb-inner" onClick={() => this.setMonth(-1)}>
                      <span className="mdpchbi-left-arrow"></span>
                    </div>
                  </div>
                </div>
            </div>
        ) : ''}
      </div>
    )
  }
}
