import express, { NextFunction, Request, Response } from "express";
import { FlatController } from "./flat.controllers";
import auth from "../../middlewares/auth";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { UserRole } from "@prisma/client";

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

router.get("/:id", FlatController.getSingleFlat);

router.put("/flats/:flatId", auth(), FlatController.updateFlat);

export const FlatRoutes = router;
