import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controllers";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";

const router = Router();

router.post(
  "/",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserControllers.createUser(req, res, next);
  }
);

export const UserRoutes = router;
