import React, { useState } from 'react';
import DayCell from '../DayCell/index';

const CalendarBody = props => {
  const isCurrentDay = day => day.timestamp === props.todayTimestamp;
  const isSelectedDay = day => day.timestamp === props.selectedDay;
  const daysAbbrevMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const days = props.monthDetails.map((day, index) => {
    const disabledClass = day.month !== 0 ? ' disabled' : '';
    const highlightedClass = isCurrentDay(day) ? ' highlight' : '';
    const selectedClass = isSelectedDay(day) ? ' highlight-green' : '';
    const className  = `c-day-container${disabledClass}${highlightedClass}${selectedClass}`

    return (
      <DayCell
        className={className}
        day={day}
        index={index}
        handleDateClick={props.onDateClick}
      />
    )
  });

  return (
    <div className="mdpc-body">
      <div className='c-container'>
        <div className='cc-head'>
          {daysAbbrevMap.map((d, i) => <div key={i} className='cch-name'>{d}</div>)}
        </div>
        <div className='cc-body'>
          {days}
        </div>
      </div>
    </div>
  )
}

export default CalendarBody;