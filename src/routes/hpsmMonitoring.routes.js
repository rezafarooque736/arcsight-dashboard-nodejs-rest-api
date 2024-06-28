import { Router } from "express";
import { getCurrentHpsmData } from "../controllers/hpsmMonitoring.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const hpsmMonitoringDashboard = Router();

hpsmMonitoringDashboard.route("/").get(verifyJWT, getCurrentHpsmData);

export default hpsmMonitoringDashboard;
