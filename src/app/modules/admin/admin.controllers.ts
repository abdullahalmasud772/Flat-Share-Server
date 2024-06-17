import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AdminServices } from "./admin.services";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAllAdminIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all admin retrived successfullay!",
    data: result,
  });
});

const updateSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.updateSingleAdminIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update single admin successfullay!",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmin,
  updateSingleAdmin,
};
