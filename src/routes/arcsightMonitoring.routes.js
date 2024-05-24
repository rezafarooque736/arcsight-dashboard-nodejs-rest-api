import { Router } from "express";
import { getCurrentArcsightData } from "../controllers/arcsightMonitoring.controllers.js";

const dashboardRouter = Router();

dashboardRouter
  .route("/detect-api/rest/queryviewers/:resource_id")
  .get(getCurrentArcsightData);

export default dashboardRouter;
