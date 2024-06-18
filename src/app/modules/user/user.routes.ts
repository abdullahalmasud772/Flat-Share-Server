import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { UserValidation } from "./user.validation";

const router = Router();

//// Create Admin
router.post(
  "/create-admin",
  auth(ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdmin.parse(JSON.parse(req.body.data));
    return UserControllers.createAdmin(req, res, next);
  }
);

//// Create Seller
router.post(
  "/create-seller",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createSeller.parse(JSON.parse(req.body.data));
    return UserControllers.createSeller(req, res, next);
  }
);

//// Create Buyer
router.post(
  "/create-buyer",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createBuyer.parse(JSON.parse(req.body.data));
    return UserControllers.createBuyer(req, res, next);
  }
);

//// get my profile
router.get(
  "/me",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  UserControllers.getMyProfile
);

//// update my profile
router.patch(
  "/update-my-profile",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.SELLER
  ),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    return UserControllers.updateMyProfile(req, res, next);
  }
);

/// Update user status
router.patch(
  "/update-user-status/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
  UserControllers.updateUserStatus
);

export const UserRoutes = router;
