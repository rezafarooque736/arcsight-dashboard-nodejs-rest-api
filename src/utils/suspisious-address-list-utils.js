import generateArcsightToken from "./generate-arcsight-token.js";
import https from "https";
import fetch from "node-fetch";
import { config } from "../config/config.js";
import ApiError from "./api-error.js";

// fetch data from arcsight
export const fetchIPStatusAndCount = async (resource_ID) => {
  let token, resp, respData;

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
      `https://${config.ARCSIGHT_IP}:${config.ARCSIGHT_PORT}/detect-api/rest/queryviewers/${resource_ID}`,
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
    return respData;
  } catch (error) {
    throw new ApiError(500, "Error fetching data from Arcsight", error.message);
  }
};
