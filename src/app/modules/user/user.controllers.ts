import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { userServices } from "./user.services";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.createUserIntoDB(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User created successfully!",
      data: result,
    });
  }
);

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userServices.getMyProfileIntoDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile data fetched!",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getMyProfile,
};
