import express, { NextFunction, Request, Response } from "express";
import { FlatController } from "./flat.controllers";
import auth from "../../middlewares/auth";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { UserRole } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SELLER),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return FlatController.createFlat(req, res, next);
  }
);

router.get("/", FlatController.getAllFlats);

router.get(
  "/seller",
  auth(ENUM_USER_ROLE.SELLER),
  FlatController.getSellerFlats
);

router.get("/:id", FlatController.getSingleFlat);

router.patch(
  //"/updateFlat",
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  FlatController.updateFlat
  // FileUploadHelper.upload.single("file"),
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = JSON.parse(req?.body?.data);
  //   return FlatController.updateFlat(req, res, next);
  // }
);

router.delete(
  "/soft/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  FlatController.softDeleteFlat
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), FlatController.deleteFlat);

export const FlatRoutes = router;
