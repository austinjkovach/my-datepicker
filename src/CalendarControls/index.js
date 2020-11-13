import React, { useState } from 'react';

const CalendarControls = props => {
  const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const getMonthString = month => monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

    return (
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
          <div className='mdpchc-year'>{props.year}</div>
          <div className='mdpchc-month'>{getMonthString(props.month)}</div>
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
  )
}



export default CalendarControls;