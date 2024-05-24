const _config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: "dashboard",
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  ARCSIGHT_IP: process.env.ARCSIGHT_IP,
  ARCSIGHT_PORT: process.env.ARCSIGHT_PORT,
  GENERATE_ARCSIGHT_TOKEN_URL: process.env.GENERATE_ARCSIGHT_TOKEN_URL,
};

export const config = Object.freeze(_config);
