import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledTd = styled.td`
  border-width: 1px;
  border-style: solid;
  padding: 2px;
  border-color: ${props => (props.selected ? "#000" : "transparent")};
  color: ${props => (props.isShaded ? "#ccc" : "#000")};
`;

const Td = ({ day, selected, setCurrentDate, isShaded }) => {
  const ref = useRef(null);
  // focus on the currently selected date
  useEffect(() => {
    if (selected) {
      ref.current.focus();
    }
  });

  return (
    <StyledTd
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      selected={selected}
      id={`cell-${day.year}-${day.month}-${day.date}`}
      onClick={() => setCurrentDate(new Date(day.year, day.month, day.date))}
      isShaded={isShaded}
      ref={ref}
    >
      {day.date}
    </StyledTd>
  );
};

export default Td;
