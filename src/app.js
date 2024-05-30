import express, { urlencoded } from "express";
import cors from "cors";
import { config } from "./config/config.js";
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

// routes import
import dashboardRouter from "./routes/arcsightMonitoring.routes.js";

// routes declaration
app.use("/api/v1/dashboard", dashboardRouter);

export default app;
