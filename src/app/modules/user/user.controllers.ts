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
        id: result?.newUser.id,
        name: result?.userProfile.name,
        username: result?.newUser.username,
        email: result?.newUser.email,
        bio: result?.userProfile.bio,
        profession: result?.userProfile.profession,
        address: result?.userProfile.address,
        profilePhoto: result?.userProfile.profilePhoto,
      },
    });
  }
);

const getSeller = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getSellerIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all seller successfullay!",
    data: result,
  });
});

const getSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.getSingleSellerIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single seller successfullay!",
    data: result,
  });
});

const updateSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.getSingleSellerIntoDB(id);
  console.log(result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single seller successfullay!",
    data: result,
  });
});

const getSingleBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.getSingleBuyerIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single buyer successfullay!",
    data: result,
  });
});

const getBuyer = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getBuyerIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all buyer successfullay!",
    data: result,
  });
});

const updateSingleBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.updateSingleBuyerIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update single buyer successfullay!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userServices.getMyProfileIntoDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get my profile successfully!",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getSeller,
  getSingleSeller,
  updateSingleSeller,
  getBuyer,
  getSingleBuyer,
  updateSingleBuyer,
  getMyProfile,
};
