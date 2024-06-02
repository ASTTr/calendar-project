const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    summary: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    endTime: { type: String },
    startTime: { type: String },
    description: { type: String },
  },
  { timestamps: { createdAt: "created_at", updated_at: "updated_at" } }
);

const eventModal = mongoose.model("event", eventSchema);
module.exports = eventModal;
