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
};

export const config = Object.freeze(_config);
