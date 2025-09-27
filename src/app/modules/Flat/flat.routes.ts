import express, { NextFunction, Request, Response } from "express";
import { FlatController } from "./flat.controllers";
import auth from "../../middlewares/auth";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { UserRole } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create-flat",
  auth(UserRole.SELLER),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    return FlatController.createFlat(req, res, next);
  }
);

router.get("/all-flat", FlatController.getAllFlat);

router.get(
  "/seller",
  auth(ENUM_USER_ROLE.SELLER),
  FlatController.getSellerFlats
);

router.get("/single-flat/:id", FlatController.getSingleFlat);

router.patch(
  "/update-flat/:id",
  auth( ENUM_USER_ROLE.SELLER),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    return FlatController.updateFlat(req, res, next);
  }
);

router.delete(
  "/soft-delete-flat/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  FlatController.softDeleteFlat
);

router.delete("/delete-flat/:id", auth(ENUM_USER_ROLE.ADMIN), FlatController.deleteFlat);

export const FlatRoutes = router;
