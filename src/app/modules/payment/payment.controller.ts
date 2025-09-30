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
    message: "Payment initiate successfully",
    data: result,
  });
});

type PaymentResult = {
  tran_id: string;
  amount: number;
};
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.validatePaymentIntoDB(req.query);
  const { tran_id, amount } = result as PaymentResult;
  res.redirect(
    `https://flatshare.vercel.app/dashboard/buyer/my-payments/payment-success?tran_id=${tran_id}&amount=${amount}`
  );
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
