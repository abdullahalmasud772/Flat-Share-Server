import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { userServices } from "./user.services";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdminIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfullay!",
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

/// seller
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
  const result = await userServices.updateSingleSellerIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update single seller successfullay!",
    data: result,
  });
});

//// buyer
const getBuyer = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getBuyerIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all buyer successfullay!",
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

/// get my profile
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

/// update user info
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userServices.updateMyProfileIntoDB(user, req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Update Profile data fetched!",
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

  createUser,
  getSeller,
  getSingleSeller,
  updateSingleSeller,
  getBuyer,
  getSingleBuyer,
  updateSingleBuyer,
  getMyProfile,
  getMyUserProfileData,
  updateMyProfile,
  updateEveryUserProfileData,
};
