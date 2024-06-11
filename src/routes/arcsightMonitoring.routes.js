import { Router } from "express";
import { getCurrentArcsightData } from "../controllers/arcsightMonitoring.controllers.js";

const arcsightDashboardRouter = Router();

arcsightDashboardRouter
  .route("/detect-api/rest/queryviewers")
  .get(getCurrentArcsightData);

export default arcsightDashboardRouter;
