import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { FlatServices } from "./flat.services";
import sendUniqueResponse from "../../../shared/sendUniqeResponse";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { flatFilterableFields, flatSearchableFields } from "./flat.constant";

const createFlat = catchAsync(async (req: Request, res: Response) => {
  const result = await FlatServices.createFlatIntoDB(req);
  sendUniqueResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Create new flat successfully",
    data: result,
  });
});

const getAllFlat = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, flatFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await FlatServices.getAllFlatIntoDB(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flats retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSellerFlats = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const result = await FlatServices.getSellerFlatsIntoDB(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Get Seller flats retrieved successfully",
    data: result,
  });
});

const getSingleFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FlatServices.getSingleFlatIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single flat retrieval successfully",
    data: result,
  });
});

const updateFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(req.body)
  const result = await FlatServices.updateFlatIntoDB(id, req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat information updated successfully",
    data: result,
  });
});

const softDeleteFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FlatServices.deleteFlatIntoDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat soft deleted successfully",
    data: result,
  });
});

const deleteFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FlatServices.deleteFlatIntoDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat deleted successfully",
    data: result,
  });
});

export const FlatController = {
  createFlat,
  getAllFlat,
  getSellerFlats,
  getSingleFlat,
  updateFlat,
  softDeleteFlat,
  deleteFlat,
};
