const {
  auth2Client,
  googleCalendar,
} = require("../utils/googleCalendar.utils");
const moment = require("moment");

const modals = require("../modals/index");

const fetchEvents = async (req, res, next) => {
  try {
    if (auth2Client.credentials.access_token) {
      const response = await googleCalendar.events.list({
        calendarId: "primary",
        singleEvents: true,
        orderBy: "startTime",
      });
      return res.status(200).send(response.data.items);
    } else {
      const events = await modals.event.find({});
      return res.status(200).send(events);
    }
  } catch (err) {
    console.error(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    if (auth2Client.credentials.access_token) {
      const startDateTime = new Date(
        moment(
          `${moment(req.body.startDate).format("YYYY-MM-DD")} ${
            req.body.startTime
          }`,
          "YYYY-MM-DD HH:mm"
        ).format("ddd MMM D YYYY HH:mm:ss [GMT]ZZ (z)")
      );

      const endDateTime = new Date(
        moment(
          `${moment(req.body.endDate).format("YYYY-MM-DD")} ${
            req.body.endTime
          }`,
          "YYYY-MM-DD HH:mm"
        ).format("ddd MMM D YYYY HH:mm:ss [GMT]ZZ (z)")
      );

      const updateEvent = await googleCalendar.events.update({
        calendarId: "primary",
        eventId: req.params.id,
        requestBody: {
          summary: req.body.summary,
          description: req.body.description,
          start: {
            dateTime: startDateTime.toISOString(),
          },
          end: {
            dateTime: endDateTime.toISOString(),
          },
        },
      });
      return res.status(200).send(updateEvent.data);
    } else
      await modals.event.updateOne({ _id: req.params.id }, { $set: req.body });
    return res.status(200).send({ message: "event deleted successfully !" });
  } catch (err) {
    console.error(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    if (auth2Client.credentials.access_token)
      await googleCalendar.events.delete({
        calendarId: "primary",
        eventId: req.params.id,
      });
    else await modals.event.deleteOne({ _id: req.params.id });
    return res.status(200).send({ message: "event deleted successfully !" });
  } catch (err) {
    console.error(err);
  }
};

const addEvent = async (req, res, next) => {
  try {
    if (auth2Client.credentials.access_token) {
      const startDateTime = new Date(
        moment(
          `${moment(req.body.startDate).format("YYYY-MM-DD")} ${
            req.body.startTime
          }`,
          "YYYY-MM-DD HH:mm"
        ).format("ddd MMM D YYYY HH:mm:ss [GMT]ZZ (z)")
      );

      const endDateTime = new Date(
        moment(
          `${moment(req.body.endDate).format("YYYY-MM-DD")} ${
            req.body.endTime
          }`,
          "YYYY-MM-DD HH:mm"
        ).format("ddd MMM D YYYY HH:mm:ss [GMT]ZZ (z)")
      );

      const insertedInvent = await googleCalendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: req.body.summary,
          description: req.body.description,
          start: {
            dateTime: startDateTime.toISOString(),
          },
          end: {
            dateTime: endDateTime.toISOString(),
          },
        },
      });
      return res.status(200).send(insertedInvent.data);
    } else {
      const newEvent = await modals.event.create(req.body);
      return res.status(200).send(newEvent);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  fetchEvents,
  updateEvent,
  deleteEvent,
  addEvent,
};
