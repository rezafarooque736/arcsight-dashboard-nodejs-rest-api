import { ArcsightMonitoring } from "../models/arcsightMonitoring.models.js";

// Function to insert data into the mongoose database
export const insertData = async (policy, passed, alerted, blocked) => {
  await ArcsightMonitoring.create({
    policy,
    passed,
    alerted,
    blocked,
  });
};

// Function to get average of last 7 days for a policy
export const getLast7DaysAverage = async (policy) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const result = await ArcsightMonitoring.aggregate([
    { $match: { policy, timestamp: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: null,
        avg_passed: { $avg: "$passed" },
        avg_alerted: { $avg: "$alerted" },
        avg_blocked: { $avg: "$blocked" },
      },
    },
  ]);

  return result[0];
};
