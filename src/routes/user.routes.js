import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/refresh-token").post(refreshAccessToken);

// secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;
