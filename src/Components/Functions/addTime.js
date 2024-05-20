import moment from "moment-timezone";

export const addTime = (date) => {
  let timezone = localStorage.getItem("stellrtimezone");
  if (timezone) {
    const format1 = "MM/DD/YYYY hh:mm A";
    const finalDate = moment(date);
    const final = finalDate.tz(JSON.parse(timezone).value).format(format1);
    return final;
  } else {
    const format1 = "MM/DD/YYYY hh:mm A";
    const finalDate = moment(date).format(format1);
    return finalDate;
  }
};
