const { google } = require("googleapis");

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URL;

const auth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectUri);

const scopes = ["https://www.googleapis.com/auth/calendar"];

const url = auth2Client.generateAuthUrl({
  scope: scopes,
});

const googleCalendar = google.calendar({ version: "v3", auth: auth2Client });

module.exports = {
  auth2Client,
  url,
  googleCalendar,
};
