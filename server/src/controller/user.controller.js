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

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log(
    //   "access token : ",
    //   accessToken,
    //   "refresh token : ",
    //   refreshToken
    // );

    // console.log("user: ", user.refreshToken);

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
      .json(new ApiResponse(201, "User created successfully", userCreate));
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
      httpOnly: false,
      secure: false,
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

    // const option = {
    //   httpOnly: true,
    //   secure: true,
    // };

    return res
      .status(200)
      .clearCookie("accessToken", { path: "/" })
      .clearCookie("refreshToken", { path: "/" })
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    return res.json(new ApiError(500, "Error logging out", error));
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiResponse(401, "Please login first");
    }

    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken._id);
    if (!user) {
      throw new ApiResponse(404, "User not found");
    }

    // console.log("userid: ", user._id);

    const { accessToken, refreshToken } =
      await generateAccessTokenandRefreshToken(user._id);

    // console.log(accessToken, refreshToken);

    const cookieOptions = {
      httpOnly: false,
      secure: false,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 1000,
      }) //  1 days
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      }) // 10 days
      .json(new ApiResponse(200, "Access token refreshed successfully"));
  } catch (error) {
    return res
      .status(error instanceof ApiResponse ? error.statusCode : 500)
      .json(new ApiError(500, "Error refreshing token", error));
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

const validateToken = async (req, res) => {
  const { accessToken } = req.cookies || req.body;
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return res.json({ isValid: true });
  } catch (err) {
    return res.status(401).json({ isValid: false });
  }
};

export {
  userSignup,
  userLogin,
  userLogout,
  refreshAccessToken,
  currentUser,
  validateToken,
};
