import { Router } from "express";
import auth from "../../middlewares/auth";
import { SellerControllers } from "./seller.controllers";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SellerControllers.getAllSeller
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SellerControllers.getSingleSeller
);

router.patch(
    "/:id",
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    SellerControllers.updateSingleSeller
  );

export const SellerRoutes = router;
