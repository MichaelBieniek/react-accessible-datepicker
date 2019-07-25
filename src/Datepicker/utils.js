export const genDaysOfMonth = (year, month, disabledDays = {}) => {
  const date = new Date(year, month, 1);
  const { before, after } = disabledDays;
  const daysOfMonth = [];
  const dayOfWeek = date.getDay();

  const lastMonth = clampMonth(month, -1);
  const lastMonthYear = month - 1 < 0 ? year - 1 : year;
  const nextMonth = clampMonth(month, +1);
  const nextMonthYear = month + 1 > 11 ? year + 1 : year;

  const daysInMonthPrev = new Date(year, month, 0).getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const totalDays = daysInMonth + dayOfWeek >= 35 ? 6 * 7 : 5 * 7;

  // add days from previous month that are part of the first week
  for (let i = dayOfWeek; i > 0; i--) {
    const day = {
      month: lastMonth,
      date: daysInMonthPrev - i + 1,
      year: lastMonthYear
    };
    const newDate = new Date(day.year, day.month, day.date);
    daysOfMonth.push({
      ...day,
      isDisabled: isDisabledDay(newDate, before, after)
    });
  }
  // add all days in current month
  for (let i = 1; i <= daysInMonth; i++) {
    const day = {
      month,
      date: i,
      year
    };
    const newDate = new Date(day.year, day.month, day.date);
    daysOfMonth.push({
      ...day,
      isDisabled: isDisabledDay(newDate, before, after)
    });
  }
  // add days from next month that are part of the last week
  const daysLeft = totalDays - daysInMonth - dayOfWeek;
  for (let i = 1; i <= daysLeft; i++) {
    const day = {
      month: nextMonth,
      date: i,
      year: nextMonthYear
    };
    const newDate = new Date(day.year, day.month, day.date);
    daysOfMonth.push({
      ...day,
      isDisabled: isDisabledDay(newDate, before, after)
    });
  }

  return daysOfMonth;
};

export const isDisabledDay = (date, before, after) => {
  if (before && date.getTime() < before.getTime()) {
    return true;
  }
  if (after && date.getTime() > after.getTime()) {
    return true;
  }
  return false;
};

export const clampMonth = (month, adj) => (((month + adj) % 12) + adj >= 0 ? 0 : 12);

export const noop = (...rest) => [...rest];
