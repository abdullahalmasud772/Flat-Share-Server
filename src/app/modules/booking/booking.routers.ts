import express from "express";
import auth from "../../middlewares/auth";
import { BookingController } from "./booking.controller";
import { UserRole } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post("/create-booking", auth(UserRole.BUYER), BookingController.createBooking);

router.get(
  "/all-booking",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SELLER, UserRole.BUYER),
  BookingController.getAllBooking
);

router.get(
  "/single-booking/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  BookingController.getSingleBooking
);

router.patch(
  "/booking-request/:bookingId",
 auth(ENUM_USER_ROLE.SELLER),
  BookingController.updateBookingStatus
);



export const BookingRoutes = router;
