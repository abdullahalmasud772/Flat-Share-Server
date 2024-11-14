import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { PaymentServices } from "./payment.services";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.initPaymentIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "payment initiate successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.validatePaymentIntoDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "payment validate successfully",
    data: result,
  });
});

const getPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getPaymentIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Get payment request successfully",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validatePayment,
  getPayment,
};
