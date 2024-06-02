const router = require("express").Router();
const manager = require("../manager/index");

router.get("/fetchEvents", manager.calendar.fetchEvents);
router.put("/updateEvent/:id", manager.calendar.updateEvent);
router.delete("/deleteEvent/:id", manager.calendar.deleteEvent);
router.post("/addEvent", manager.calendar.addEvent);

module.exports = router;
