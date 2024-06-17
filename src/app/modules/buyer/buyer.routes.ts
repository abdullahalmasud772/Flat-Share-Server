import { Router } from "express";
import { BuyerControllers } from "./buyer.controllers";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuyerControllers.getAllBuyer
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuyerControllers.getSingleBuyer
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.BUYER),
  BuyerControllers.updateSingleBuyer
);

export const BuyerRoutes = router;
