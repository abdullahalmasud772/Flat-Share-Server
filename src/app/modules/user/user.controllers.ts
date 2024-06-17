import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { UserServices } from "./user.services";

/// Create Admin
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAdminIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfullay!",
    data: result,
  });
});

//// Create Seller
const createSeller = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createSellerIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller created successfullay!",
    data: result,
  });
});

//// Create  Buyer
const createBuyer = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createBuyerIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buyer created successfullay!",
    data: result,
  });
});

/// get my profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserServices.getMyProfileIntoDB(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get my profile successfully!",
    data: result,
  });
});

/// update My prifile
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserServices.updateMyProfileIntoDB(user, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update my profile!",
    data: result,
  });
});

/// Update User Statuus
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.updateUserStatusIntoDB(id,req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update user status!",
    data: result,
  });
});

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
        email: result?.newUser.email,
        gender: result?.userProfile?.gender,
        bio: result?.userProfile.bio,
        profession: result?.userProfile.profession,
        address: result?.userProfile.address,
        profilePhoto: result?.userProfile.profilePhoto,
      },
    });
  }
);

/// get my userProfile data
const getMyUserProfileData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.getMyUserProfileDataIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get my user profile data fetched!",
    data: result,
  });
});

//// update user profile data
const updateEveryUserProfileData = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const { ...userData } = payload;
    const result = await userServices.updateEveryUserProfileDataIntoDB(
      id,
      userData
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Update userProfile data fetched!",
      data: result,
    });
  }
);

export const UserControllers = {
  createAdmin,
  createSeller,
  createBuyer,
  updateUserStatus,

  createUser,
  getMyProfile,
  getMyUserProfileData,
  updateMyProfile,
  updateEveryUserProfileData,
};
