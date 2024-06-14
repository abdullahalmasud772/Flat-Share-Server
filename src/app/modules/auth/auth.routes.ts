import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

router.post("/login", AuthControllers.loginUser);

router.post("/refresh-token", AuthControllers.CreateRefreshToken);

router.post(
  "/change-password",
  /*   validateRequest(AuthValidation.changePasswordZodSchema), */
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.SELLER
  ),
  AuthControllers.changePassword
);

export const AuthRoutes = router;
