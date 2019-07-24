const TOTAL_DAYS = 35;

export const genDaysOfMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const daysOfMonth = [];
  const dayOfWeek = date.getDay();

  const lastMonth = month - 1 < 0 ? 11 : month - 1;
  const lastMonthYear = month - 1 < 0 ? year - 1 : year;
  const nextMonth = (month + 1) % 12;
  const nextMonthYear = month + 1 > 11 ? year + 1 : year;

  const daysInMonthPrev = new Date(year, month, 0).getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // add days from previous month that are part of the first week
  for (let i = dayOfWeek; i > 0; i--) {
    daysOfMonth.push({
      month: lastMonth,
      date: daysInMonthPrev - i + 1,
      year: lastMonthYear
    });
  }
  // add all days in current month
  for (let i = 1; i <= daysInMonth; i++) {
    daysOfMonth.push({
      month,
      date: i,
      year
    });
  }
  // add days from next month that are part of the last week
  const daysLeft = TOTAL_DAYS - daysInMonth - dayOfWeek;
  for (let i = 1; i <= daysLeft; i++) {
    daysOfMonth.push({
      month: nextMonth,
      date: i,
      year: nextMonthYear
    });
  }

  return daysOfMonth;
};
