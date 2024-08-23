import { Router } from "express";
import {
  userSignup,
  userLogin,
  userLogout,
  refreshAccessToken,
  currentUser,
  validateToken,
} from "../controller/user.controller.js";
import { JWTverify } from "../middleware/auth.middleware.js";
import checkAlreadyLoggedIn from "../middleware/checklogin.middleware.js";

const userRouter = Router();

userRouter.route("/signup").post(userSignup);
userRouter.route("/login").post(checkAlreadyLoggedIn, userLogin);
userRouter.route("/logout").post(JWTverify, userLogout);
userRouter.route("/refresaccesstoken").post(refreshAccessToken);
userRouter.route("/currentuser").get(JWTverify, currentUser);
userRouter.route("/refreshaccesstoken").post(JWTverify, refreshAccessToken);
userRouter.route("/validatetoken").post(validateToken);

export default userRouter;
