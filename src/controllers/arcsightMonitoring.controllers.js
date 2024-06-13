import { asyncHandler } from "../utils/async-handler.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { fetchDataWebApplicationSecurity } from "../utils/utils-web-application-security.js";
import { convertToLocalDateTime } from "../utils/index.js";
import { fetchIPStatusAndCount } from "../utils/suspicious-address-list-utils.js";
import { config } from "../config/config.js";

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

export const get_WAF_F5_ASM_SuspiciousAddressList = asyncHandler(
  async (req, res) => {
    try {
      const respData = await fetchIPStatusAndCount(config.WAF_F5_ASM);

      const ipStatusCountList = respData.data.rows.reduce(
        (acc, { value: [ip, status, count] }) => {
          acc.push({ ip, status, count });
          return acc;
        },
        []
      );

      const data = {
        name: respData.name,
        timestamp: convertToLocalDateTime(respData.data.timestamp),
        startTimestamp: convertToLocalDateTime(respData.data.startTimestamp),
        endTimestamp: convertToLocalDateTime(respData.data.endTimestamp),
        ipStatusCountList,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, data, "Data fetched Successfully"));
    } catch (err) {
      console.error(
        "Error while getting data from Arcsight suspicious list waf-f5-asm:",
        err
      );
      throw new ApiError(
        500,
        "Error while getting data from /detect-api/rest/queryviewers/...",
        err.message
      );
    }
  }
);

export const get_PALO_ALTO_SuspiciousAddressList = asyncHandler(
  async (req, res) => {
    try {
      const respData = await fetchIPStatusAndCount(config.PALO_ALTO);

      const ipStatusCountList = respData.data.rows.reduce(
        (acc, { value: [ip, status, count] }) => {
          acc.push({ ip, status, count });
          return acc;
        },
        []
      );

      const data = {
        name: respData.name,
        timestamp: convertToLocalDateTime(respData.data.timestamp),
        startTimestamp: convertToLocalDateTime(respData.data.startTimestamp),
        endTimestamp: convertToLocalDateTime(respData.data.endTimestamp),
        ipStatusCountList,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, data, "Data fetched Successfully"));
    } catch (err) {
      console.error(
        "Error while getting data from Arcsight suspicious list palo-alto:",
        err
      );
      throw new ApiError(
        500,
        "Error while getting data from /detect-api/rest/queryviewers/...",
        err.message
      );
    }
  }
);

export const get_VPN_F5_BIGIP_SuspiciousAddressList = asyncHandler(
  async (req, res) => {
    try {
      const respData = await fetchIPStatusAndCount(config.VPN_F5_BigIP);

      const ipStatusCountList = respData.data.rows.reduce(
        (acc, { value: [ip, string4, count] }) => {
          acc.push({ ip, string4, count });
          return acc;
        },
        []
      );

      const data = {
        name: respData.name,
        timestamp: convertToLocalDateTime(respData.data.timestamp),
        startTimestamp: convertToLocalDateTime(respData.data.startTimestamp),
        endTimestamp: convertToLocalDateTime(respData.data.endTimestamp),
        ipStatusCountList,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, data, "Data fetched Successfully"));
    } catch (err) {
      console.error(
        "Error while getting data from Arcsight suspicious list vpn-f5-bigIP:",
        err
      );
      throw new ApiError(
        500,
        "Error while getting data from /detect-api/rest/queryviewers/...",
        err.message
      );
    }
  }
);

export const get_device_product_SuspiciousAddressList = asyncHandler(
  async (req, res) => {
    try {
      const respData = await fetchIPStatusAndCount(
        config.RESPECT_TO_DEVICE_PRODUCT
      );

      const ipStatusCountList = respData.data.rows.reduce(
        (acc, { value: [ip, status, count, device_product] }) => {
          acc.push({ ip, status, count, device_product });
          return acc;
        },
        []
      );

      const data = {
        name: respData.name,
        timestamp: convertToLocalDateTime(respData.data.timestamp),
        startTimestamp: convertToLocalDateTime(respData.data.startTimestamp),
        endTimestamp: convertToLocalDateTime(respData.data.endTimestamp),
        ipStatusCountList,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, data, "Data fetched Successfully"));
    } catch (err) {
      console.error(
        "Error while getting data from Arcsight suspicious list device-product:",
        err
      );
      throw new ApiError(
        500,
        "Error while getting data from /detect-api/rest/queryviewers/...",
        err.message
      );
    }
  }
);
