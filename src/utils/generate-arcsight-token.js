import https from "https";
import fetch from "node-fetch";
import { DOMParser } from "xmldom";
import ApiError from "./api-error.js";
import { config } from "../config/config.js";

async function generateArcsightToken() {
  // Create an HTTPS agent that ignores SSL certificate errors
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const response = await fetch(config.GENERATE_ARCSIGHT_TOKEN_URL, {
      agent,
    });

    const xmlString = await response.text();

    // Parse the XML string using xmldom
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Extract the value inside the <ns3:return> tag
    const token = xmlDoc.getElementsByTagName("ns3:return")[0].textContent;

    return token;
  } catch (err) {
    throw new ApiError(
      500,
      `Error while getting data from /www/core-service/rest/LoginService/login api: ${err.message}`
    );
  }
}

export default generateArcsightToken;
