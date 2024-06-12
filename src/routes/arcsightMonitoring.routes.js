import { Router } from "express";
import {
  getCurrentArcsightData,
  get_WAF_F5_ASM_SuspisiousAddressList,
} from "../controllers/arcsightMonitoring.controllers.js";

const arcsightDashboardRouter = Router();

arcsightDashboardRouter
  .route("/web-application-security")
  .get(getCurrentArcsightData);

arcsightDashboardRouter
  .route("/waf-f5-asm")
  .get(get_WAF_F5_ASM_SuspisiousAddressList);

export default arcsightDashboardRouter;
