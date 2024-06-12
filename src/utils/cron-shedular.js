import cron from "node-cron";
import {
  fetchDataWebApplicationSecurity,
  storeDataWebApplicationSecurity,
} from "./utils-web-application-security.js";

// Schedule the task to run every hour
cron.schedule("*/60 * * * *", async () => {
  try {
    console.log("Running scheduled task to fetch and store data.", new Date());
    const { chartDesc } = await fetchDataWebApplicationSecurity();
    await storeDataWebApplicationSecurity(chartDesc);
    console.log("Task completed successfully.", new Date());
  } catch (error) {
    console.error("Error running scheduled task:", error);
  }
});
