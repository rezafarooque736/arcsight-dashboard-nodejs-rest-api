import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "./../utils/api-response.js";
import { generateAccessAndRefreshTokens } from "./../utils/generate-access-and-refresh-token.js";
import { config } from "../config/config.js";

export const registerUser = asyncHandler(async (req, res) => {
  //1.  get user details from frontend
  const { username, email, fullName, password } = req.body;

  // 2. validation - not empty
  if (
    [username, email, fullName, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "Please provide all fields");
  }

  // 3. check if user already exists in db, username or email
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(409, "User with username or email already exists");
  }

  // 6. create user object - save user to db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
  });

  // 7. remove password and refresh tokens from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 8. check for user creation
  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  // 7. send response to frontend
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // 1. check if email or username is provided
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // 2. check if password is provided
  if (!password) throw new ApiError(400, "Please provide a password");

  // 3. check if user exists and password is correct
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  // 4. generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // 5. send response to frontend
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in Successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(204, {}, "User logged out Successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorised request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      config.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user?.refreshToken)
      throw new ApiError(401, "Refresh token is expired or used");

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
