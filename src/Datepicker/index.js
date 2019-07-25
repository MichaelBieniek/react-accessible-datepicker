import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { getWeekDays, getMonths } from "./i18n";
import { genDaysOfMonth, isDisabledDay, clampMonth } from "./utils";
import { DATE_PART } from "./constants";
import Td from "./Td";

const Root = styled.div`
  font-size: 16px;
  color: #000;
  position: relative;
`;

const Picker = styled.div`
  display: block;
  position: absolute;
  width: 355px;
  border: 1px solid;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
  color: #000;

  & th {
    cursor: help;
  }
`;

const WEEKS_FIVE = [0, 1, 2, 3, 4];
const WEEKS_SIX = [...WEEKS_FIVE, 5];

const Datepicker = props => {
  const {
    isAutoPop,
    dateFormat,
    defaultDate = "",
    disabledDays,
    lang,
    nextMonthTitle,
    prevMonthTitle,
    handleChange
  } = props;
  const { before, after } = disabledDays;
  const [isPickerOpen, setPickerOpen] = useState(isAutoPop);

  const [currentDate, setCurrentDate] = useState(defaultDate || new Date());
  const [value, setValue] = useState(defaultDate);

  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const _getDaysOfMonth = useCallback(() => genDaysOfMonth(year, month, disabledDays), [year, month, disabledDays]);
  const daysOfMonth = _getDaysOfMonth(year, month, disabledDays);
  const weeks = daysOfMonth.length > 35 ? WEEKS_SIX : WEEKS_FIVE;

  // get memoized and localized text
  const daysOfWeek = useMemo(() => getWeekDays(lang), [lang]);
  const months = useMemo(() => getMonths(lang), [lang]);

  console.log("selected", year, month, date);

  const shift = (offset, type = DATE_PART.DAY, isFirstOfMonth = false) => {
    switch (type) {
      case DATE_PART.YEAR: {
        const requestedDate = new Date(
          currentDate.getFullYear() + offset,
          currentDate.getMonth(),
          isFirstOfMonth ? 1 : currentDate.getDate()
        );
        if (!isDisabledDay(requestedDate, before, after)) {
          setCurrentDate(requestedDate);
        }
        break;
      }
      case DATE_PART.MONTH: {
        const requestedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + offset,
          isFirstOfMonth ? 1 : currentDate.getDate()
        );

        if (!isDisabledDay(requestedDate, before, after)) {
          setCurrentDate(requestedDate);
        }
        break;
      }
      case DATE_PART.DAY:
      default: {
        const requestedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + offset
        );
        if (!isDisabledDay(requestedDate, before, after)) {
          setCurrentDate(requestedDate);
        }
        break;
      }
    }
  };

  const arrowKeyHandler = e => {
    const { key } = e;
    switch (key) {
      case "ArrowLeft": {
        shift(-1);
        break;
      }
      case "ArrowRight": {
        shift(+1);
        break;
      }
      case "ArrowUp": {
        shift(-7);
        break;
      }
      case "ArrowDown": {
        shift(+7);
        break;
      }
      case "Enter": {
        setValue(moment([year, month, date]).format(dateFormat));
        setPickerOpen(false);
        handleChange(new Date(year, month, date));
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <Root>
      <p>Datepicker</p>
      <input
        placeholder="DD/MM/YYYY"
        onClick={() => setPickerOpen(!isPickerOpen)}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {isPickerOpen && (
        <Picker>
          <Header>
            <button
              title={prevMonthTitle}
              aria-label={`${months[clampMonth(month - 1)]} ${year}`}
              onClick={() => shift(-1, DATE_PART.MONTH, true)}
            >{`<`}</button>
            <div>
              {months[month]} {year}
            </div>
            <button
              title={nextMonthTitle}
              aria-label={`${months[clampMonth(month + 1)]} ${year}`}
              onClick={() => shift(1, DATE_PART.MONTH, true)}
            >{`>`}</button>
          </Header>
          <Table
            tabIndex={0}
            role="grid"
            ariaActiveDescendant={`cell-${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`}
            onKeyDown={arrowKeyHandler}
          >
            <thead>
              <tr>
                {daysOfWeek.map(day => {
                  const { abbr, title } = day;
                  return (
                    <th key={abbr} role="columnheader" aria-label={title}>
                      <abbr title={title}>{abbr}</abbr>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {weeks.map(week => (
                <tr key={`${week}`}>
                  {daysOfMonth.slice(week * 7, (week + 1) * 7).map(day => (
                    <Td
                      lang={lang}
                      dateFormat={dateFormat}
                      key={`${day.year}-${day.month}-${day.date}`}
                      day={day}
                      isSelected={date === day.date && month === day.month}
                      isShaded={day.month !== month}
                      setCurrentDate={setCurrentDate}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Picker>
      )}
    </Root>
  );
};

Datepicker.propTypes = {
  dateFormat: PropTypes.string,
  /** should the picker be popped on mount */
  isAutoPop: PropTypes.bool,
  /** title for next month button */
  nextMonthTitle: PropTypes.string,
  /** title for prev month button */
  prevMonthTitle: PropTypes.string,

  /** date range that should represent disabled dates */
  disabledDays: PropTypes.object
};

Datepicker.defaultProps = {
  dateFormat: "DD-MM-YYYY",
  isAutoPop: false,
  nextMonthTitle: "Go to next month",
  prevMonthTitle: "Go to previous month",
  disabledDays: undefined
};

export default Datepicker;
