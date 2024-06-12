import { Router } from "express";
import {
  getCurrentArcsightData,
  get_PALO_ALTO_SuspisiousAddressList,
  get_VPN_F5_BIGIP_SuspisiousAddressList,
  get_WAF_F5_ASM_SuspisiousAddressList,
  get_device_product_SuspisiousAddressList,
} from "../controllers/arcsightMonitoring.controllers.js";

const arcsightDashboardRouter = Router();

arcsightDashboardRouter
  .route("/web-application-security")
  .get(getCurrentArcsightData);

arcsightDashboardRouter
  .route("/waf-f5-asm")
  .get(get_WAF_F5_ASM_SuspisiousAddressList);

arcsightDashboardRouter
  .route("/vpn-f5-bigIP")
  .get(get_VPN_F5_BIGIP_SuspisiousAddressList);

arcsightDashboardRouter
  .route("/palo-alto")
  .get(get_PALO_ALTO_SuspisiousAddressList);

arcsightDashboardRouter
  .route("/device-product")
  .get(get_device_product_SuspisiousAddressList);
export default arcsightDashboardRouter;
