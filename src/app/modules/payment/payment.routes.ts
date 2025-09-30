import { Router } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = Router();

router.post("/init-payment/:bookingId", PaymentController.initPayment);

router.post("/success", PaymentController.validatePayment);
// router.get("/ipn", PaymentController.validatePayment);

router.get(
  "/all-payment",
  auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  PaymentController.getPayment
);

export const PaymentRoutes = router;
