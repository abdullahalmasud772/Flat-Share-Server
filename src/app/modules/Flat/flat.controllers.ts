import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { FlatServices } from "./flat.services";
import sendUniqueResponse from "../../../shared/sendUniqeResponse";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";

const createFlat = catchAsync(async (req: Request, res: Response) => {
  const result = await FlatServices.createFlatIntoDB(req);
  sendUniqueResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat added successfully",
    data: result,
  });
});

const getAllFlats = catchAsync(async (req: Request, res: Response) => {
  const result = await FlatServices.getAllFlatsIntoDB(req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flats retrieved successfully",
    data: result,
  });
});

const updateFlat = catchAsync(async (req: Request, res: Response) => {
  const { flatId } = req.params;
  const result = await FlatServices.updateFlatIntoDB(flatId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat information updated successfully",
    data: result,
  });
});

export const FlatController = {
  createFlat,
  getAllFlats,
  updateFlat,
};
