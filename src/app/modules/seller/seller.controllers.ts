import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SellerServices } from "./seller.services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

///
const getAllSeller = catchAsync(async (req: Request, res: Response) => {
  const result = await SellerServices.getAllSellerIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all seller successfullay!",
    data: result,
  });
});

const getSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SellerServices.getSingleSellerIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single seller successfullay!",
    data: result,
  });
});

const updateSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SellerServices.updateSingleSellerIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update single seller successfullay!",
    data: result,
  });
});

export const SellerControllers = {
  getAllSeller,
  getSingleSeller,
  updateSingleSeller
};
