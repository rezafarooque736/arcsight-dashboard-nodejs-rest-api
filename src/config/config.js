const _config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: "dashboard",
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  ARCSIGHT_IP: process.env.ARCSIGHT_IP,
  ARCSIGHT_PORT: process.env.ARCSIGHT_PORT,
  GENERATE_ARCSIGHT_TOKEN_URL: process.env.GENERATE_ARCSIGHT_TOKEN_URL,
  HPSM_HOST: process.env.HPSM_HOST,
  HPSM_PORT: process.env.HPSM_PORT,
  HPSM_PASSWORD: process.env.HPSM_PASSWORD,
  HPSM_USERNAME: process.env.HPSM_USERNAME,
  RESOURCE_ID_ALL_POLICY_STATUS_OF_LAST_24H:
    process.env.RESOURCE_ID_ALL_POLICY_STATUS_OF_LAST_24H,
  WAF_F5_ASM: process.env.WAF_F5_ASM,
  PALO_ALTO: process.env.PALO_ALTO,
  VPN_F5_BigIP: process.env.VPN_F5_BigIP,
  RESPECT_TO_DEVICE_PRODUCT: process.env.RESPECT_TO_DEVICE_PRODUCT,
};

export const config = Object.freeze(_config);
