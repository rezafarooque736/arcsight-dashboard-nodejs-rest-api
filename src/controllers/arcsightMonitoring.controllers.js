import { asyncHandler } from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import https from "https";
import fetch from "node-fetch";
import generateArcsightToken from "../utils/generate-arcsight-token.js";
import { config } from "../config/config.js";
import { getLast7DaysAverage, insertData } from "../utils/monitoring-data.js";

const getCurrentArcsightData = asyncHandler(async (req, res) => {
  const { resource_id } = req.params;

  if (!resource_id.trim()) throw new ApiError(400, "Invalid resource id");

  // generate arcsight token
  const token = await generateArcsightToken();

  // Create an HTTPS agent that ignores SSL certificate errors
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const resp = await fetch(
      `https://${config.ARCSIGHT_IP}:${config.ARCSIGHT_PORT}/detect-api/rest/queryviewers/${resource_id}`,
      {
        agent,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (resp.statusText !== "OK") {
      throw new ApiError(
        500,
        "Error fetching data from /detect-api/rest/queryviewers/..."
      );
    }

    const respData = await resp.json();

    let graphDesc;

    // data for graph description
    if (respData?.name === "All_Policy status of last 24h") {
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
      graphDesc = Object.values(result);

      // Function to fetching data and storage
      const fetchDataAndStore = async () => {
        for (const { policy, passed, alerted, blocked } of graphDesc) {
          await insertData(policy, passed, alerted, blocked);

          const weeklyAverage = await getLast7DaysAverage(policy);
          console.log(`Weekly Average for ${policy}:`, weeklyAverage);
        }
      };

      fetchDataAndStore();
    } else {
      graphDesc = respData.data?.rows.map((item) => ({
        policy: item.value[0],
        total: parseInt(item.value[1]),
      }));
    }

    const data = {
      name: respData.name,
      timestamp: respData.data.timestamp,
      startTimestamp: respData.data.startTimestamp,
      endTimestamp: respData.data.endTimestamp,
      graphDesc,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, data, "data fetched successfully"));
  } catch (err) {
    throw new ApiError(
      500,
      "Error while getting data from /detect-api/rest/queryviewers/...",
      err.message
    );
  }
});

export { getCurrentArcsightData };
