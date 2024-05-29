import express from "express";
import auth from "../../middlewares/auth";
import { BookingController } from "./booking.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.BUYER), BookingController.createBooking);

router.get("/booking-requests", auth(), BookingController.getAllBooking);

router.put(
  "/booking-requests/:bookingId",
  auth(),
  BookingController.updateBookingStatus
);

export const BookingRoutes = router;
