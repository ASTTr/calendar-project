const router = require("express").Router();

router.use("/calendar", require("./calendarRoute"));
router.use("/google", require("./gmailOAuthRoute"));

module.exports = router;
