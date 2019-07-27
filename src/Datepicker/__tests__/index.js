import React from "react";
import { render, cleanup, fireEvent, waitForElement } from "@testing-library/react";
import Datepicker from "..";
import moment from "moment";

const baseProps = {
  id: "mydatepicker",
  label: "Datepicker",
  defaultValue: "15-07-2019",
  dateFormat: "DD-MM-YYYY",
  onChange: () => {},
  nextMonthTitle: "Next month",
  prevMonthTitle: "Previous month",
  disabledDays: {
    before: new Date(2019, 5, 1) // june 1st, 2019
  }
};
const DATA_TESTID_PICKER = `${baseProps.id}-picker`;

describe("Datepicker render tests", () => {
  afterEach(cleanup);
  it("should render text input", async () => {
    const { getByLabelText } = render(<Datepicker {...baseProps} />);
    await waitForElement(() => getByLabelText(baseProps.label));
  });
  it("should open picker on click of text input", async () => {
    const { getByLabelText, getByTestId } = render(<Datepicker {...baseProps} />);
    fireEvent.click(getByLabelText(baseProps.label));
    await waitForElement(() => getByTestId(DATA_TESTID_PICKER));
  });
  it("should select current date on Enter", async () => {
    const onChangeSpy = jest.fn();
    const { getByLabelText, getByRole } = render(<Datepicker {...baseProps} onChange={onChangeSpy} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    expect(onChangeSpy).toBeCalledWith(baseProps.defaultValue);
  });
});
describe("Datepicker prev/next month button tests", () => {
  afterEach(cleanup);
  it("should render previous / next month buttons with their titles", async () => {
    const { getByLabelText, getByTitle } = render(<Datepicker {...baseProps} />);
    fireEvent.click(getByLabelText(baseProps.label));
    await waitForElement(() => getByTitle(baseProps.prevMonthTitle));
    await waitForElement(() => getByTitle(baseProps.nextMonthTitle));
  });
  it("should move to previous month (June 2019) on prev month click", async () => {
    const { getByLabelText, getByTitle, getByText } = render(<Datepicker {...baseProps} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.click(getByTitle(baseProps.prevMonthTitle));
    await waitForElement(() => getByText("June 2019"));
  });
  it("should move to next month (August 2019) on next month click", async () => {
    const { getByLabelText, getByTitle, getByText } = render(<Datepicker {...baseProps} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.click(getByTitle(baseProps.nextMonthTitle));
    await waitForElement(() => getByText("August 2019"));
  });
  it("should *not* move back 2 months (May 2019) because prior to May 31st is disabled", async () => {
    const { getByLabelText, getByTitle, getByText } = render(<Datepicker {...baseProps} />);
    fireEvent.click(getByLabelText(baseProps.label));
    // 2 clicks back
    fireEvent.click(getByTitle(baseProps.prevMonthTitle));
    fireEvent.click(getByTitle(baseProps.prevMonthTitle));
    await waitForElement(() => getByText("June 2019"));
  });
  it("should move to next, next month (September 2019) on 2x next month click", async () => {
    const { getByLabelText, getByTitle, getByText } = render(<Datepicker {...baseProps} />);
    fireEvent.click(getByLabelText(baseProps.label));
    // 2 clicks forward
    fireEvent.click(getByTitle(baseProps.nextMonthTitle));
    fireEvent.click(getByTitle(baseProps.nextMonthTitle));
    await waitForElement(() => getByText("September 2019"));
  });
});
describe("Datepicker by text input tests", () => {
  afterEach(cleanup);
  it("should not callback if enter date matches currently selected date", async () => {
    // providing an valid input (correct format, valid date) should call onChange. handleError should not be called.
    const handleErrorSpy = jest.fn();
    const onChangeSpy = jest.fn();
    const newvalue = baseProps.defaultValue; // same as default
    const { getByLabelText } = render(
      <Datepicker {...baseProps} handleError={handleErrorSpy} onChange={onChangeSpy} />
    );
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.change(getByLabelText(baseProps.label), { target: { value: "test" } });
    fireEvent.change(getByLabelText(baseProps.label), { target: { value: newvalue } });
    fireEvent.blur(getByLabelText(baseProps.label), { target: { value: newvalue } });
    expect(handleErrorSpy).not.toBeCalled();
    expect(onChangeSpy).not.toBeCalled();
  });
  it("should take a valid, properly formatted input", async () => {
    // providing an valid input (correct format, valid date) should call onChange. handleError should not be called.
    const handleErrorSpy = jest.fn();
    const onChangeSpy = jest.fn();
    const newvalue = "31-12-2019";
    const { getByLabelText } = render(
      <Datepicker {...baseProps} handleError={handleErrorSpy} onChange={onChangeSpy} />
    );
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.blur(getByLabelText(baseProps.label), { target: { value: newvalue } });
    expect(handleErrorSpy).not.toBeCalled();
    expect(onChangeSpy).toBeCalledWith(newvalue);
  });
  it("should reject a bad date input", async () => {
    // providing an invalid input (bad format, invalid date) should call handleError. onChange should not be called.
    const handleErrorSpy = jest.fn();
    const onChangeSpy = jest.fn();
    const newvalue = "99-99-2010";
    const { getByLabelText } = render(
      <Datepicker {...baseProps} handleError={handleErrorSpy} onChange={onChangeSpy} />
    );
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.blur(getByLabelText(baseProps.label), { target: { value: newvalue } });
    expect(handleErrorSpy).toBeCalledWith(newvalue);
    expect(onChangeSpy).not.toBeCalled();
  });
  it("should allow a date clear", async () => {
    // providing an invalid input (bad format, invalid date) should call handleError. onChange should not be called.
    const handleErrorSpy = jest.fn();
    const onChangeSpy = jest.fn();
    const newValue = "";
    const { getByLabelText } = render(
      <Datepicker {...baseProps} handleError={handleErrorSpy} onChange={onChangeSpy} />
    );
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.blur(getByLabelText(baseProps.label), { target: { value: newValue } });
    expect(handleErrorSpy).not.toBeCalled();
    expect(onChangeSpy).toBeCalledWith(newValue);
  });
});
describe("Datepicker by keyboard navigation", () => {
  afterEach(cleanup);
  it("should open picker with Enter key", async () => {
    const { getByLabelText, getByRole } = render(<Datepicker {...baseProps} />);
    fireEvent.keyDown(getByLabelText(baseProps.label), { key: "Shift" }); // just for branch testing
    fireEvent.keyDown(getByLabelText(baseProps.label), { key: "Enter" });
    await waitForElement(() => getByRole("grid"));
  });
  it("should -1 day with left arrow key", async () => {
    const onChangeSpy = jest.fn();
    const newValue = moment(baseProps.defaultValue, baseProps.dateFormat)
      .add(-1, "day")
      .format(baseProps.dateFormat);
    const { getByLabelText, getByRole } = render(<Datepicker {...baseProps} onChange={onChangeSpy} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "ArrowLeft" });
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    expect(onChangeSpy).toBeCalledWith(newValue);
  });
  it("should +1 day with right arrow key", async () => {
    const onChangeSpy = jest.fn();
    const newValue = moment(baseProps.defaultValue, baseProps.dateFormat)
      .add(1, "day")
      .format(baseProps.dateFormat);
    const { getByLabelText, getByRole } = render(<Datepicker {...baseProps} onChange={onChangeSpy} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "ArrowRight" });
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    expect(onChangeSpy).toBeCalledWith(newValue);
  });
  it("should -1 week with up arrow key", async () => {
    const onChangeSpy = jest.fn();
    const newValue = moment(baseProps.defaultValue, baseProps.dateFormat)
      .add(-1, "week")
      .format(baseProps.dateFormat);
    const { getByLabelText, getByRole } = render(<Datepicker {...baseProps} onChange={onChangeSpy} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "ArrowUp" });
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    expect(onChangeSpy).toBeCalledWith(newValue);
  });
  it("should stop before disabled dates when using up arrow key", async () => {
    // can't go back a week because previous week falls into disabled dates territory
    const onChangeSpy = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Datepicker
        {...baseProps}
        onChange={onChangeSpy}
        disabledDays={{
          before: new Date(2019, 6, 15)
        }}
      />
    );
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "ArrowUp" });
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    expect(onChangeSpy).toBeCalledWith(baseProps.defaultValue);
  });
  it("should + week with down arrow key", async () => {
    const onChangeSpy = jest.fn();
    const newValue = moment(baseProps.defaultValue, baseProps.dateFormat)
      .add(+1, "week")
      .format(baseProps.dateFormat);
    const { getByLabelText, getByRole } = render(<Datepicker {...baseProps} onChange={onChangeSpy} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "ArrowDown" });
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    expect(onChangeSpy).toBeCalledWith(newValue);
  });
  it("should stop before disabled dates when using down arrow key", async () => {
    // can't go forward 2 weeks because 2 weeks from now falls into disabled dates territory
    const onChangeSpy = jest.fn();
    const defaultValue = "31-07-2019";
    const { getByLabelText, getByRole } = render(
      <Datepicker
        {...baseProps}
        defaultValue={defaultValue}
        onChange={onChangeSpy}
        disabledDays={{
          after: moment(defaultValue, baseProps.dateFormat)
            .add(10, "days")
            .toDate()
        }}
      />
    );
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "ArrowDown" });
    fireEvent.keyDown(getByRole("grid"), { key: "ArrowDown" });
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    // only going to expect it to advance by 1 week
    expect(onChangeSpy).toBeCalledWith(
      moment(defaultValue, baseProps.dateFormat)
        .add(1, "week")
        .format(baseProps.dateFormat)
    );
  });
  it("should ignore a random key", async () => {
    const onChangeSpy = jest.fn();
    const newValue = baseProps.defaultValue;
    const { getByLabelText, getByRole } = render(<Datepicker {...baseProps} onChange={onChangeSpy} />);
    fireEvent.click(getByLabelText(baseProps.label));
    fireEvent.keyDown(getByRole("grid"), { key: "Shift" });
    fireEvent.keyDown(getByRole("grid"), { key: "Enter" });
    expect(onChangeSpy).toBeCalledWith(newValue);
  });
});
describe("Datepicker a11y tests", () => {});
