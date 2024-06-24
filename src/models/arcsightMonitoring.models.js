import mongoose, { Schema } from "mongoose";

const arcsightMonitoringSchema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  policy: {
    type: String,
    required: true,
  },
  passed: {
    type: Number,
    default: 0,
  },
  alerted: {
    type: Number,
    default: 0,
  },
  blocked: {
    type: Number,
    default: 0,
  },
});

export const ArcsightMonitoring =
  mongoose.models.ArcsightMonitoring ||
  mongoose.model("ArcsightMonitoring", arcsightMonitoringSchema);
