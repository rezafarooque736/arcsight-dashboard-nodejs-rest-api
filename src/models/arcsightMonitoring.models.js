import mongoose, { now, Schema } from "mongoose";

const arcsightMonitoringSchema = new Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
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
  },
  { timestamps: true }
);

arcsightMonitoringSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);

export const ArcsightMonitoring =
  mongoose.models.ArcsightMonitoring ||
  mongoose.model("ArcsightMonitoring", arcsightMonitoringSchema);
