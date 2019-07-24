import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getWeekDays, getMonths } from "./i18n";
import { genDaysOfMonth } from "./utils";
import { DATE_PART } from "./constants";
import Td from "./Td";

const Root = styled.div`
  color: #000;
  position: relative;
`;

const Picker = styled.div`
  display: block;
  position: absolute;
  width: 250px;

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
  font-size: 8px;
  color: #000;
`;

const WEEKS = [0, 1, 2, 3, 4];

const Datepicker = props => {
  const { isAutoPop, lang, value, handleChange } = props;

  const [isPickerOpen, setPickerOpen] = useState(isAutoPop);

  const [currentDate, setCurrentDate] = useState(value || new Date());

  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const _getDaysOfMonth = useCallback(() => genDaysOfMonth(year, month), [year, month]);

  const daysOfMonth = _getDaysOfMonth(year, month);

  // get memoized and localized text
  const daysOfWeek = useMemo(() => getWeekDays(lang), [lang]);
  const months = useMemo(() => getMonths(lang), [lang]);

  console.log("selected", year, month, date);

  const shift = (offset, type = DATE_PART.DAY, isFirstOfMonth = false) => {
    switch (type) {
      case DATE_PART.YEAR: {
        setCurrentDate(
          new Date(
            currentDate.getFullYear() + offset,
            currentDate.getMonth(),
            isFirstOfMonth ? 1 : currentDate.getDate()
          )
        );
        break;
      }
      case DATE_PART.MONTH: {
        setCurrentDate(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + offset,
            isFirstOfMonth ? 1 : currentDate.getDate()
          )
        );
        break;
      }
      case DATE_PART.DAY:
      default: {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + offset));
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
        handleChange(new Date(year, month, date));
        setPickerOpen(false);
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
      <input placeholder="DD/MM/YYYY" onClick={() => setPickerOpen(!isPickerOpen)} />
      {isPickerOpen && (
        <Picker>
          <Header>
            <button onClick={() => shift(-1, DATE_PART.MONTH, true)}>{`<`}</button>
            <div>{months[month]}</div>
            <button onClick={() => shift(1, DATE_PART.MONTH, true)}>{`>`}</button>
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
                    <th key={abbr} role="columnheader">
                      <abbr title={title}>{abbr}</abbr>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {WEEKS.map(week => (
                <tr key={`${week}`}>
                  {daysOfMonth.slice(week * 7, (week + 1) * 7).map(day => (
                    <Td
                      key={`${day.year}-${day.month}-${day.date}`}
                      day={day}
                      selected={date === day.date && month === day.month}
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
  /** should the picker be popped on mount */
  isAutoPop: PropTypes.bool
};

Datepicker.defaultProps = {
  isAutoPop: false
};

export default Datepicker;
