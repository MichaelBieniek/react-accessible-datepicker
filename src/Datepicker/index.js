import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Root = styled.div`
  position: relative;
`;

const Picker = styled.div`
  display: block;
  position: absolute;
  height: 250px;
  width: 250px;

  border: 1px solid;
  background: #fff;
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
  font-size: 8px;
  color: #000;
`;

const enDaysOfWeek = [
  { abbr: "Su", title: "Sunday" },
  { abbr: "Mo", title: "Monday" },
  { abbr: "Tu", title: "Tuesday" },
  { abbr: "We", title: "Wednesday" },
  { abbr: "Th", title: "Thursday" },
  { abbr: "Fr", title: "Friday" },
  { abbr: "Sa", title: "Saturday" }
];

const TOTAL_DAYS = 35;

const genDaysOfMonth = date => {
  const daysOfMonth = [];
  const dayOfWeek = date.getDay();
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  // add days from previous month that are part of the first week
  for (let i = dayOfWeek; i > 0; i--) {
    daysOfMonth.push(-i);
  }
  // add all days in current month
  for (let i = 1; i <= daysInMonth; i++) {
    daysOfMonth.push(i);
  }
  // add days from next month that are part of the last week
  const daysLeft = TOTAL_DAYS - daysInMonth - dayOfWeek;
  for (let i = daysLeft; i > 0; i--) {
    daysOfMonth.push(-i);
  }
  return daysOfMonth;
};

const Datepicker = props => {
  const { isAutoPop, value } = props;

  const [isPickerOpen, setPickerOpen] = useState(isAutoPop);
  const currentDate = value || new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setYear] = useState(currentDate.getFullYear());
  const [currentDay, setDay] = useState(null);
  console.log(currentDate);
  const daysOfMonth = genDaysOfMonth(currentDate);
  console.log(daysOfMonth);
  const daysOfWeek = enDaysOfWeek;
  return (
    <Root>
      <p>Datepicker</p>
      <input
        placeholder="DD/MM/YYYY"
        onClick={() => setPickerOpen(!isPickerOpen)}
      />
      {isPickerOpen && (
        <Picker>
          <Table
            tabIndex={0}
            role="grid"
            ariaActiveDescendant={`cell${currentDay}`}
          >
            <thead>
              <tr>
                {daysOfWeek.map(day => {
                  const { abbr, title } = day;
                  return (
                    <th key={abbr} role="columnheader">
                      <abbr title={title}>{abbr}</abbr>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                {daysOfMonth.slice(0, 7).map(day => (
                  <td id={`cell${day}`} onClick={() => setDay(day)}>
                    {day}
                  </td>
                ))}
              </tr>
              <tr>
                {daysOfMonth.slice(7, 14).map(day => (
                  <td id={`cell${day}`} onClick={() => setDay(day)}>
                    {day}
                  </td>
                ))}
              </tr>
              <tr>
                {daysOfMonth.slice(14, 21).map(day => (
                  <td id={`cell${day}`} onClick={() => setDay(day)}>
                    {day}
                  </td>
                ))}
              </tr>
              <tr>
                {daysOfMonth.slice(21, 28).map(day => (
                  <td id={`cell${day}`} onClick={() => setDay(day)}>
                    {day}
                  </td>
                ))}
              </tr>
              <tr>
                {daysOfMonth.slice(28, 35).map(day => (
                  <td id={`cell${day}`} onClick={() => setDay(day)}>
                    {day}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </Picker>
      )}
    </Root>
  );
};

Datepicker.propTypes = {
  /** should the picker be popped on mount */
  isAutoPop: PropTypes.bool
};

Datepicker.defaultProps = {
  isAutoPop: false
};

export default Datepicker;
