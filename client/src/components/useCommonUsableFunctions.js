import moment from "moment";

export const convertUtcDateAndTime = (date, time) => {
  return new Date(
    moment(
      `${moment(date).format("YYYY-MM-DD")} ${time}`,
      "YYYY-MM-DD HH:mm"
    ).format("ddd MMM D YYYY HH:mm:ss [GMT]ZZ (z)")
  );
};

export const BASE_URL = process.env.REACT_APP_BASE_URL;
