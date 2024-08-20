import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// used to generate unique tokens for user
const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiResponse(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // console.log(accessToken, refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return new ApiError(500, "Error while creating Access and Refresh tokens");
  }
};

const userSignup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (
      [name, email, password, confirmPassword].some((fields) => {
        return fields?.trim() === "";
      })
    ) {
      throw new ApiResponse(400, "All fields are required");
    }

    if (password.length < 6) {
      throw new ApiResponse(
        400,
        "Password should be at least 6 characters long"
      );
    }

    if (password.length > 24) {
      throw new ApiResponse(
        400,
        "Password should not be more than 24 characters long"
      );
    }

    if (password !== confirmPassword) {
      throw new ApiResponse(400, "Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiResponse(400, "Email already in use");
    }

    const userObject = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    const userCreate = await User.findById(userObject._id).select(
      "-password -refreshToken"
    );
    // console.log(userCreate);

    if (!userCreate) {
      throw new ApiResponse(500, "Error while creating user");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, "User created successfully", userCreate));
  } catch (error) {
    return res.json(new ApiError(500, "Error while creating user", error));
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      [email, password].some((fields) => {
        return fields?.trim() === "";
      })
    ) {
      throw new ApiResponse(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiResponse(404, "User not found");
    }

    const passCheck = await user.isPasswordCorrect(password);
    if (!passCheck) {
      throw new ApiResponse(401, "Incorrect password");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenandRefreshToken(user._id);

    const option = {
      httpOnly: true,
      secure: true,
    };

    const loginUserObject = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(200, "User Logged in successfully", {
          accessToken,
          loginUserObject,
        })
      );
  } catch (error) {
    return res.json(new ApiError(500, "Error logging in", error));
  }
};

const userLogout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        refreshToken: 1,
      },
    });

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    return res.json(new ApiError(500, "Error logging out", error));
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookie.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiResponse(401, "Please login first");
    }

    try {
      const decodedRefreshToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedRefreshToken._id);
      if (!user) {
        throw new ApiResponse(404, "User not found");
      }

      const { accessToken, refreshToken } = generateAccessTokenandRefreshToken(
        user._id
      );

      const option = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new ApiResponse(200, "Access token refreshed successfully"));
    } catch (error) {
      return res.json(new ApiError(500, "Invalid refresh token", error));
    }
  } catch (error) {
    return res.json(new ApiError(500, "Error refreshing Refresh Token", error));
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiResponse(404, "User not found");
    }
    return res.json(new ApiResponse(200, "Current Loggedin user", user));
  } catch (error) {
    return res.json(new ApiError(500, "Please login first"));
  }
};

export { userSignup, userLogin, userLogout, refreshAccessToken, currentUser };
