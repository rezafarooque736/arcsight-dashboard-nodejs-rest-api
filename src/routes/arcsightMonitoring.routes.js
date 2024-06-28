import { Router } from "express";
import {
  getCurrentArcsightData,
  get_PALO_ALTO_SuspiciousAddressList,
  get_VPN_F5_BIGIP_SuspiciousAddressList,
  get_WAF_F5_ASM_SuspiciousAddressList,
  get_device_product_SuspiciousAddressList,
} from "../controllers/arcsightMonitoring.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const arcsightDashboardRouter = Router();

arcsightDashboardRouter
  .route("/web-application-security")
  .get(verifyJWT, getCurrentArcsightData);

arcsightDashboardRouter
  .route("/waf-f5-asm")
  .get(verifyJWT, get_WAF_F5_ASM_SuspiciousAddressList);

arcsightDashboardRouter
  .route("/vpn-f5-bigIP")
  .get(verifyJWT, get_VPN_F5_BIGIP_SuspiciousAddressList);

arcsightDashboardRouter
  .route("/palo-alto")
  .get(verifyJWT, get_PALO_ALTO_SuspiciousAddressList);

arcsightDashboardRouter
  .route("/device-product")
  .get(verifyJWT, get_device_product_SuspiciousAddressList);
export default arcsightDashboardRouter;
