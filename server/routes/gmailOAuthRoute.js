const routes = require("express").Router();
const {
  auth2Client,
  url,
  googleCalendar,
} = require("../utils/googleCalendar.utils");

routes.get("/googleAuthUrl", async (req, res, next) => {
  try {
    if (auth2Client?.credentials?.access_token) {
      return res.status(200).send({ isAuthenticated: true });
    }
    res.status(200).send({ redirectCalendarUrl: url });
  } catch (err) {
    console.error(err);
  }
});

routes.get("/redirect", async (req, res, next) => {
  const code = req.query.code;
  const { tokens } = await auth2Client.getToken(code);
  auth2Client.setCredentials(tokens);
  res.redirect("/api/calendar/fetchEvents");
});

// routes.get("/calendarEvents", async (req, res, next) => {
//   const response = await googleCalendar.events.list({
//     calendarId: "primary",
//     // timeMin: new Date(new Date().getFullYear(), 0, 1).toISOString(),
//     // timeMax: new Date(new Date().getFullYear(), 11, 31).toISOString(),
//     // maxResults: 50,
//     singleEvents: true,
//     orderBy: "startTime",
//   });
//   return res.status(200).send(response.data.items);
// });

routes.get("/removeAccessToken", async (req, res, next) => {
  auth2Client.setCredentials({ access_token: null });
});

module.exports = routes;
