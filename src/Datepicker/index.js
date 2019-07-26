import React, { useCallback, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { getWeekDays, getMonths } from "./i18n";
import { genDaysOfMonth, isDisabledDay, clampMonth, noop } from "./utils";
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

const ToggleMonth = styled.button`
  background: #fff;
  border: none;
  padding: 5px;
`;

const WEEKS_FIVE = [0, 1, 2, 3, 4];
const WEEKS_SIX = [...WEEKS_FIVE, 5];

const Datepicker = props => {
  const {
    id,
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
  const parsedDefaultDate = defaultDate ? moment(defaultDate, dateFormat) : moment();
  const [currentDate, setCurrentDate] = useState(parsedDefaultDate.toDate());
  const [value, setValue] = useState(defaultDate);
  const inputRef = useRef(null);

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

  /**
   * Shifts date selector (currentDate) by offset. Updates currentDate by calling `setCurrentDate`
   * @param {number} offset - # of units to shift date by
   * @param {string} type - unit of offset (year, month, day)
   * @param {bool} isFirstOfMonth - if shift causes a month change, set day to 1
   */
  const shift = useCallback(
    (offset, type = DATE_PART.DAY, isFirstOfMonth = false) => {
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
    },
    [currentDate, before, after]
  );

  /**
   * Selects date by updating internal text value (setValue), date in frame (setCurrentDate) as well as calling the handleChange callback.
   * Picker is closed on select & text input is focused.
   * @param {Date} newDate - JS Date to select
   */
  const selectDate = useCallback(
    newDate => {
      const day = moment(newDate);
      setValue(day.format(dateFormat));
      setCurrentDate(day.toDate());
      handleChange(day.format(dateFormat));
      setPickerOpen(false);
      inputRef.current.focus();
    },
    [dateFormat, handleChange]
  );

  const deselectDate = useCallback(() => {
    setValue("");
    setCurrentDate(new Date());
    handleChange("");
  }, [handleChange]);

  const arrowKeyHandler = useCallback(
    e => {
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
          selectDate(new Date(year, month, date));
          break;
        }
        default: {
          break;
        }
      }
    },
    [year, month, date, selectDate, shift]
  );

  return (
    <Root>
      <p>Datepicker</p>
      <input
        id={`${id}-input`}
        ref={inputRef}
        placeholder="DD/MM/YYYY"
        onClick={() => setPickerOpen(!isPickerOpen)}
        value={value}
        onBlur={useCallback(
          e => {
            const { value: newValue } = e.target;
            if (newValue && newValue !== value) {
              const parsedDate = moment(value);
              if (parsedDate.isValid()) {
                selectDate(parsedDate.toDate());
              }
            } else {
              deselectDate();
            }
          },
          [selectDate, deselectDate, value]
        )}
        onChange={useCallback(e => setValue(e.target.value), [])}
        onKeyDown={useCallback(e => {
          const { key } = e;
          if (key === "Enter") {
            setPickerOpen(true);
          }
        }, [])}
        aria-haspopup={true}
        aria-controls={`${id}-input`}
      />
      {isPickerOpen && (
        <Picker id={`${id}-picker`}>
          <Header>
            <ToggleMonth
              title={prevMonthTitle}
              aria-label={`${months[clampMonth(month - 1)]} ${year}`}
              onClick={() => shift(-1, DATE_PART.MONTH, true)}
            >{`<`}</ToggleMonth>
            <div>
              {months[month]} {year}
            </div>
            <ToggleMonth
              title={nextMonthTitle}
              aria-label={`${months[clampMonth(month + 1)]} ${year}`}
              onClick={() => shift(1, DATE_PART.MONTH, true)}
            >{`>`}</ToggleMonth>
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
                      selectDate={selectDate}
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
  id: PropTypes.string,
  /** the moment.js format to use when parsing / formatting dates */
  dateFormat: PropTypes.string,
  /** the string representation of starting date */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  /** date range that should represent disabled dates */
  disabledDays: PropTypes.object,
  /**
   * callback function when the provided date via text input is invalid.
   * The picker itself will not fire the handleError function because invalid dates cannot be selected.
   */
  handleError: PropTypes.func,
  onChange: PropTypes.func,
  /** should the picker be popped on mount */
  isAutoPop: PropTypes.bool,
  /** title for next month button */
  nextMonthTitle: PropTypes.string,
  /** title for prev month button */
  prevMonthTitle: PropTypes.string
};

Datepicker.defaultProps = {
  id: undefined,
  dateFormat: "DD-MM-YYYY",
  defaultValue: "",
  disabledDays: undefined,
  handleError: noop,
  isAutoPop: false,
  nextMonthTitle: "Go to next month",
  prevMonthTitle: "Go to previous month"
};

export default Datepicker;
