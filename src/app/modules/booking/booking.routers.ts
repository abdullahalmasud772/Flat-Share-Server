import express from "express";
import auth from "../../middlewares/auth";
import { BookingController } from "./booking.controller";
import { UserRole } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post("/", auth(UserRole.BUYER), BookingController.createBooking);

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SELLER, UserRole.BUYER),
  BookingController.getBooking
);

router.get(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  BookingController.getSingleBooking
);

router.patch(
  "/booking-request/:bookingId",
 auth(ENUM_USER_ROLE.SELLER),
  BookingController.updateBookingStatus
);



export const BookingRoutes = router;
