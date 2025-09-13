import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendUniqueResponse from "../../../shared/sendUniqeResponse";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { BookingServices } from "./booking.services";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.createBookingIntoDB(req);
  sendUniqueResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking requests submitted successfully",
    data: result,
  });
});

const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getAllBookingIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking requests retrieved successfully",
    data: result,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingServices.getSingleBookingIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Get single booking retrieved successfully",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const result = await BookingServices.updateBookingStatusIntoDB(
    req,
    bookingId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking requests retrieved successfully",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  updateBookingStatus,
};
