import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserControllers.createUser(req, res, next);
  }
);

router.get(
  "/seller",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserControllers.getSeller
);

router.get(
  "/seller/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserControllers.getSingleSeller
);

router.get(
  "/buyer/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserControllers.getSingleBuyer
);

router.get(
  "/buyer",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserControllers.getBuyer
);

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

export const UserRoutes = router;
