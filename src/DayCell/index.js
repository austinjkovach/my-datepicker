import React, { memo } from 'react';

const DayCell = props => (
  <div className={props.className} key={props.index}>
    <div className='cdc-day'>
      <span onClick={() => props.handleDateClick(props.day)}>
        {props.day.date}
      </span>
    </div>
  </div>
)

export default memo(DayCell);