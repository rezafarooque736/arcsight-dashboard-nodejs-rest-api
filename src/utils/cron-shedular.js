import cron from "node-cron";
import { fetchData, storeData } from "./monitoring-data.js";

// Schedule the task to run every hour
cron.schedule("*/60 * * * *", async () => {
  try {
    console.log("Running scheduled task to fetch and store data.", new Date());
    const { chartDesc } = await fetchData();
    await storeData(chartDesc);
    console.log("Task completed successfully.", new Date());
  } catch (error) {
    console.error("Error running scheduled task:", error);
  }
});
