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
      data: {
        name: result.userProfile.name,
        username: result.newUser.username,
        email: result.newUser.email,
        bio: result.userProfile.bio,
        profession: result.userProfile.profession,
        address: result.userProfile.address,
        profilePhoto: result.userProfile.profilePhoto
      },
    });
  }
);

export const UserControllers = {
  createUser,
};
