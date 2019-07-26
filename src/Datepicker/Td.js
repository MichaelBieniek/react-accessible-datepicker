import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { noop } from "./utils";
import moment from "moment";

const StyledTd = styled.td`
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  border-width: 1px;
  border-style: solid;
  padding: 10px 5px;
  border: none;
  color: ${props => (props.isShaded || props.disabled ? "#ccc" : "#000")};
  background-color: ${props => (props.selected ? "rgb(0,167,88)" : "transparent")};

  &:hover {
    background-color: rgb(240, 248, 255);
  }
`;

const Td = ({ day, dateFormat, isSelected, selectDate, isShaded }) => {
  const { year, month, date, isDisabled } = day;
  const ref = useRef(null);
  const thisDay = moment([year, month, date]);
  // focus on the currently selected date
  useEffect(() => {
    if (isSelected) {
      ref.current.focus();
    }
  }, [isSelected]);

  return (
    <StyledTd
      aria-selected={isSelected}
      tabIndex={isSelected && !isDisabled ? 0 : -1}
      selected={isSelected}
      id={`cell-${year}-${month}-${date}`}
      onClick={() => (isDisabled ? noop : selectDate(new Date(year, month, date)))}
      isShaded={isShaded}
      ref={ref}
      disabled={isDisabled}
      aria-label={thisDay.format(dateFormat)}
      role="gridcell"
    >
      {date}
    </StyledTd>
  );
};

Td.propTypes = {
  dateFormat: PropTypes.string,
  day: PropTypes.shape({
    year: PropTypes.number,
    month: PropTypes.number,
    date: PropTypes.number,
    isDisabled: PropTypes.bool
  }),
  isSelected: PropTypes.bool,
  isShaded: PropTypes.bool,
  selectDate: PropTypes.func.isRequired
};

Td.defaultProps = {
  dateFormat: "DD-MM-YYYY",
  day: {},
  isSelected: false,
  isShaded: false
};

export default Td;
