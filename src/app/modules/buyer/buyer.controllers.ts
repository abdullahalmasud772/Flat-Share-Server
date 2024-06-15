import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BuyerServices } from "./buyer.services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllBuyer = catchAsync(async (req: Request, res: Response) => {
  const result = await BuyerServices.getAllBuyerIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all buyer successfullay!",
    data: result,
  });
});

const getSingleBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BuyerServices.getSingleBuyerIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single buyer successfullay!",
    data: result,
  });
});

export const BuyerControllers = {
  getAllBuyer,
  getSingleBuyer,
};
