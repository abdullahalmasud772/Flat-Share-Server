import { Router } from "express";
import { AdminControllers } from "./admin.controllers";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

router.get("/", auth(ENUM_USER_ROLE.ADMIN), AdminControllers.getAllAdmin);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  AdminControllers.updateSingleAdmin
);

export const AdminRoutes = router;

