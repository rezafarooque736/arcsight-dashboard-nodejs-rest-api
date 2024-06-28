import express, { urlencoded } from "express";
import cors from "cors";
import { config } from "./config/config.js";
import cookieParser from "cookie-parser";
import "./utils/cron-shedular.js";

const app = express();

// cors configuration
app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  })
);

// allow json body
app.use(express.json({ limit: "16kb" }));

// allow params (query params)
app.use(urlencoded({ extended: true, limit: "16kb" }));

// allow storage public files like images, favicons, etc.
app.use(express.static("public"));

// parse cookies
app.use(cookieParser());

// routes import
import arcsightDashboardRouter from "./routes/arcsightMonitoring.routes.js";
import hpsmMonitoringDashboard from "./routes/hpsmMonitoring.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./utils/api-error.js";

// routes declaration
app.use(
  "/api/v1/dashboard/arcsight/detect-api/rest/queryviewers",
  arcsightDashboardRouter
);

app.use("/api/v1/dashboard/hpsm", hpsmMonitoringDashboard);

app.use("/api/v1/users", userRouter);

// Use the error handling middleware
app.use(errorHandler);

export default app;
