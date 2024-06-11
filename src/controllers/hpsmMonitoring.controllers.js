import { config } from "../config/config.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import fetch from "node-fetch";
import base64 from "base-64";

export const getCurrentHpsmData = asyncHandler(async (req, res) => {
  const token = `${config.HPSM_USERNAME}:${config.HPSM_PASSWORD}`;
  const encodedToken = base64.encode(token);

  // Construct the URL
  const url = `http://${config.HPSM_HOST}:${config.HPSM_PORT}/SM/9/rest/incidents?view=expand&query=Service="SOC Services"`;

  // Set the headers
  const headers = {
    accept: "application/json",
    Authorization: `Basic ${encodedToken}`,
  };

  try {
    const response = await fetch(url, { headers });

    if (response.status !== 200) {
      throw new ApiError(
        response.status,
        `Error fetching data from HPSM: ${response.statusText}`
      );
    }

    const jsonResponse = await response.json();

    // hpsm tickets content
    const content = jsonResponse["content"];

    // these are the values that will be used for filteration purpose in table
    let regionList;
    let serviceList;
    let serviceTypeList;
    // Step 2: Filter tickets which are open
    const allOpenTickets = content
      .filter(
        ({ Incident: { StatusIM } }) =>
          !["Resolved", "Closed"].includes(StatusIM)
      )
      .map(
        ({
          Incident: {
            IncidentID,
            Title,
            OpenedBy,
            Assignee,
            OpenTime,
            SubService,
            Priority,
            StatusIM,
            Region,
            Service,
            ServiceType,
          },
        }) => {
          regionList = new Set(regionList).add(Region);
          serviceList = new Set(serviceList).add(Service);
          serviceTypeList = new Set(serviceTypeList).add(ServiceType);
          return {
            IncidentID,
            Title,
            OpenedBy,
            Assignee,
            OpenTime,
            SubService,
            Priority,
            StatusIM,
            Region,
            Service,
            ServiceType,
          };
        }
      );

    // Step 3: Create Arrays of Objects
    const assigneeDetails = allOpenTickets.reduce((acc, ticket) => {
      if (!acc[ticket.Assignee]) {
        acc[ticket.Assignee] = [];
      }

      acc[ticket.Assignee].push(ticket);

      return acc;
    }, {});

    // Collecting first 5 open tickets
    const oldestOpenTicketSize10 = allOpenTickets
      .slice(0, 10)
      .map(({ IncidentID, Assignee, OpenedBy, OpenTime, Title }) => ({
        IncidentID,
        Assignee,
        OpenedBy,
        OpenTime,
        Title,
      }));

    // Step 4: Calculate Ticket Details by SubService
    const countsBySubService = content.reduce(
      (acc, { Incident: { SubService, StatusIM } }) => {
        if (!acc[SubService]) {
          acc[SubService] = { total: 0, closed: 0, open: 0 };
        }

        acc[SubService].total++;
        if (["Resolved", "Closed"].includes(StatusIM)) {
          acc[SubService].closed++;
        } else {
          acc[SubService].open++;
        }

        return acc;
      },
      {}
    );

    const assigneeList = Object.keys(assigneeDetails).map((item) => ({
      label: item,
    }));
    const subServiceList = Object.keys(countsBySubService).map((item) => ({
      label: item,
    }));
    regionList = Array.from(regionList).map((item) => ({ label: item }));
    serviceList = Array.from(serviceList).map((item) => ({ label: item }));
    serviceTypeList = Array.from(serviceTypeList).map((item) => ({
      label: item,
    }));
    const priorityList = [
      { label: "Critical", value: "1", colorValue: "red" },
      { label: "High", value: "2", colorValue: "yellow" },
      { label: "Average", value: "3", colorValue: "green" },
      { label: "Low", value: "4", colorValue: "grey" },
      { label: "SR", value: "5", colorValue: "white" },
    ];

    const data = {
      allOpenTickets,
      assigneeDetails,
      oldestOpenTicketSize10,
      countsBySubService,
      assigneeList,
      subServiceList,
      regionList,
      serviceList,
      serviceTypeList,
      priorityList,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Data fetched successfully"));
  } catch (err) {
    console.error(
      "Error while getting data from HPSM /SM/9/rest/incidents",
      err
    );

    // Handle network errors, server errors, and unexpected errors
    const status = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    throw new ApiError(status, message, err.message);
  }
});
