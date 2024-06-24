import { config } from "../config/config.js";
import { ArcsightMonitoring } from "../models/arcsightMonitoring.models.js";
import generateArcsightToken from "./generate-arcsight-token.js";
import https from "https";
import fetch from "node-fetch";
import { calculateAvgPct } from "./index.js";
import ApiError from "./api-error.js";

// Function to insert data into the mongoose database
export const insertDataWebApplicationSecurity = async (
  policy,
  passed,
  alerted,
  blocked
) => {
  await ArcsightMonitoring.create({
    policy,
    passed,
    alerted,
    blocked,
  });
};

// Function to get average of last 7 days for a policy
export const getLast7DaysAverageWebApplicationSecurity = async (policy) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const result = await ArcsightMonitoring.aggregate([
    { $match: { policy, createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: null,
        passed_avg: { $avg: "$passed" },
        alerted_avg: { $avg: "$alerted" },
        blocked_avg: { $avg: "$blocked" },
      },
    },
    {
      $project: {
        passed_avg: { $round: ["$passed_avg", 0] },
        alerted_avg: { $round: ["$alerted_avg", 0] },
        blocked_avg: { $round: ["$blocked_avg", 0] },
      },
    },
  ]);

  return result[0];
};

// store data in database
export const storeDataWebApplicationSecurity = async (chartDesc) => {
  try {
    // Store the data
    for (const { policy, passed, alerted, blocked } of chartDesc) {
      await insertDataWebApplicationSecurity(policy, passed, alerted, blocked);
    }
  } catch (error) {
    console.error("Error storing data:", error);
    throw new ApiError(500, "Error storing data", error.message);
  }
};

export const deleteDataOlderThan7Days = async () => {
  try {
    // Delete data older than 7 days
    await ArcsightMonitoring.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new ApiError(500, "Error deleting data", error.message);
  }
};

// fetch data from arcsight
export const fetchDataWebApplicationSecurity = async () => {
  let token, resp, respData, chartDesc;

  try {
    // Generate arcsight token
    token = await generateArcsightToken();
  } catch (error) {
    throw new ApiError(500, "Error generating Arcsight token", error.message);
  }

  try {
    // Create an HTTPS agent that ignores SSL certificate errors
    const agent = new https.Agent({ rejectUnauthorized: false });

    // Fetch data from Arcsight
    resp = await fetch(
      `https://${config.ARCSIGHT_IP}:${config.ARCSIGHT_PORT}/detect-api/rest/queryviewers/${config.RESOURCE_ID_ALL_POLICY_STATUS_OF_LAST_24H}`,
      {
        agent,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (resp.status !== 200) {
      throw new ApiError(
        500,
        `Error fetching data: ${resp.status} ${resp.statusText}`
      );
    }

    respData = await resp.json();
  } catch (error) {
    throw new ApiError(500, "Error fetching data from Arcsight", error.message);
  }

  try {
    // Process the response data
    const result = respData.data?.rows.reduce(
      (acc, { value: [policy, count, status] }) => {
        if (!acc[policy]) {
          acc[policy] = {
            policy,
            passed: 0,
            alerted: 0,
            blocked: 0,
            total: 0,
          };
        }
        acc[policy][status] += parseInt(count);
        acc[policy].total += parseInt(count);
        return acc;
      },
      {}
    );
    chartDesc = Object.values(result);
  } catch (error) {
    throw new ApiError(500, "Error processing response data", error.message);
  }

  const passed = [];
  const alerted = [];
  const blocked = [];

  try {
    // Compute averages and prepare chart description
    for (const item of chartDesc) {
      const { passed_avg, alerted_avg, blocked_avg } =
        await getLast7DaysAverageWebApplicationSecurity(item.policy);

      // add passed_avg, passed_avg_pct, alerted_avg, alerted_avg_pct, blocked_avg, blocked_avg_pct to chartDesc
      item.passed_avg = passed_avg;
      item.passed_avg_pct = calculateAvgPct(item.passed, passed_avg);
      item.alerted_avg = alerted_avg;
      item.alerted_avg_pct = calculateAvgPct(item.alerted, alerted_avg);
      item.blocked_avg = blocked_avg;
      item.blocked_avg_pct = calculateAvgPct(item.blocked, blocked_avg);

      // remove /Common/ from policy name
      let policy = item.policy.replace("/Common/", "");
      passed.push({ policy, passed_curr: item.passed, passed_avg });
      alerted.push({ policy, alerted_curr: item.alerted, alerted_avg });
      blocked.push({ policy, blocked_curr: item.blocked, blocked_avg });
    }
  } catch (error) {
    throw new ApiError(500, "Error calculating averages", error.message);
  }

  return { respData, chartDesc, passed, alerted, blocked };
};
