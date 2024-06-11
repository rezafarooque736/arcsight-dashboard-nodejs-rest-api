import { Router } from "express";
import { getCurrentHpsmData } from "../controllers/hpsmMonitoring.controllers.js";

const hpsmMonitoringDashboard = Router();

hpsmMonitoringDashboard.route("/").get(getCurrentHpsmData);

export default hpsmMonitoringDashboard;
