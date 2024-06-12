import { asyncHandler } from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { fetchDataWebApplicationSecurity } from "../utils/utils-web-application-security.js";
import { convertToLocalDateTime } from "../utils/index.js";

export const getCurrentArcsightData = asyncHandler(async (req, res) => {
  try {
    const { respData, chartDesc, passed, alerted, blocked } =
      await fetchDataWebApplicationSecurity();

    const data = {
      name: respData.name,
      timestamp: convertToLocalDateTime(respData.data.timestamp),
      startTimestamp: convertToLocalDateTime(respData.data.startTimestamp),
      endTimestamp: convertToLocalDateTime(respData.data.endTimestamp),
      chartDesc,
      passed,
      alerted,
      blocked,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, data, "data fetched successfully"));
  } catch (err) {
    console.error(
      "Error while getting data from Arcsight web application security:",
      err
    );
    throw new ApiError(
      500,
      "Error while getting data from /detect-api/rest/queryviewers/...",
      err.message
    );
  }
});
