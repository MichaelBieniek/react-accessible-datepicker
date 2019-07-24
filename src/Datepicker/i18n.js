const LANG = {
  EN: "EN",
  FR: "FR"
};
const enMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const frMonths = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "auot",
  "septembre",
  "octobre",
  "novembre",
  "décembre"
];

export const getMonths = lang => (lang === LANG.FR ? frMonths : enMonths);

const enDaysOfWeek = [
  { abbr: "Su", title: "Sunday" },
  { abbr: "Mo", title: "Monday" },
  { abbr: "Tu", title: "Tuesday" },
  { abbr: "We", title: "Wednesday" },
  { abbr: "Th", title: "Thursday" },
  { abbr: "Fr", title: "Friday" },
  { abbr: "Sa", title: "Saturday" }
];

const frDaysOfWeek = [
  { abbr: "Di", title: "dimanche" },
  { abbr: "Lu", title: "lundi" },
  { abbr: "Ma", title: "mardi" },
  { abbr: "Me", title: "mercredi" },
  { abbr: "Je", title: "jeudi" },
  { abbr: "Ve", title: "vendredi" },
  { abbr: "Sa", title: "samedi" }
];

export const getWeekDays = lang => (lang === LANG.FR ? frDaysOfWeek : enDaysOfWeek);
