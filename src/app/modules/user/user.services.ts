import { Request } from "express";
import prisma from "../../../shared/prisma";
import { hashedPassword } from "../../../helpers/hashPasswordHelper";
import {
  Admin,
  Buyer,
  Seller,
  User,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { IUserProfileDataUpdate } from "./user.constants";

export type IAdminUpdateBuyer = {
  role: ENUM_USER_ROLE;
  status: UserStatus;
};

/// Create Admin
const createAdminIntoDB = async (req: Request): Promise<Admin> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.admin.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });
    const newAdmin = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return newAdmin;
  });

  return result;
};
/// Create Seller
const createSellerIntoDB = async (req: Request): Promise<Seller> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.seller.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.seller.email,
        password: hashPassword,
        role: UserRole.SELLER,
      },
    });
    const newSeller = await transactionClient.seller.create({
      data: req.body.seller,
    });

    return newSeller;
  });

  return result;
};

/// Create Buyer
const createBuyerIntoDB = async (req: Request): Promise<Buyer> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.buyer.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.buyer.email,
        password: hashPassword,
        role: UserRole.BUYER,
      },
    });
    const newBuyer = await transactionClient.buyer.create({
      data: req.body.buyer,
    });

    return newBuyer;
  });

  return result;
};

//// get My Profile
const getMyProfileIntoDB = async (authUser: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: authUser.userId,
      status: UserStatus.ACTIVE,
    },
    select: {
      email: true,
      role: true,
      status: true,
    },
  });

  let profileData;
  if (userData?.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userData?.email,
      },
    });
  } else if (userData?.role === UserRole.BUYER) {
    profileData = await prisma.buyer.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData?.role === UserRole.SELLER) {
    profileData = await prisma.seller.findUnique({
      where: {
        email: userData.email,
      },
    });
  }
  return { ...profileData, ...userData };
};

//// update my profile
const updateMyProfileIntoDB = async (authUser: any, req: Request) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: authUser.userId,
      status: UserStatus.ACTIVE,
    },
    select: {
      email: true,
      role: true,
      status: true,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exists!");
  }

  const file = req.file as IUploadFile;
  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  let profileData;
  if (userData?.role === UserRole.ADMIN) {
    profileData = await prisma.admin.update({
      where: {
        email: userData?.email,
      },
      data: req.body,
    });
  } else if (userData?.role === UserRole.SELLER) {
    profileData = await prisma.seller.update({
      where: {
        email: userData?.email,
      },
      data: req.body,
    });
  } else if (userData?.role === UserRole.BUYER) {
    profileData = await prisma.buyer.update({
      where: {
        email: userData?.email,
      },
      data: req.body,
    });
  }

  return { ...profileData, ...userData };
};

/// Update user (Seller & Buyer)
const updateUserStatusIntoDB = async (
  id: string,
  payload: Partial<IAdminUpdateBuyer>
) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    select: {
      email: true,
      role: true,
      status: true,
    },
    data: payload,
  });

  return result;
};

/// get my userProfile data
const getMyUserProfileDataIntoDB = async (
  id: string
): Promise<UserProfile | null> => {
  const result = await prisma.userProfile.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const createUserIntoDB = async (req: Request) => {
  const file = req.file as IUploadFile;
  const user = req?.user;

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.user.profilePhoto = uploadedProfileImage?.secure_url;
  }
  if (req.body.role === "ADMIN" && !(user?.role === "ADMIN")) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }
  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.email,
        password: hashPassword,
        role: req.body.role,
      },
    });

    const userProfile = await transactionClient.userProfile.create({
      data: {
        userId: newUser.id,
        name: req.body.user.name,
        email: req.body.email,
        contactNumber: Number(req.body.user.contactNumber),
        gender: req.body.user.gender,
        profession: req.body.user.profession,
        address: req.body.user.address,
        profilePhoto: req.body.user.profilePhoto,
      },
    });
    return { newUser, userProfile };
  });
  return result;
};

const updateEveryUserProfileDataIntoDB = async (
  id: string,
  payload: Partial<IUserProfileDataUpdate>
): Promise<UserProfile | null> => {
  const { ...userProfileData } = payload;
  const result = await prisma.$transaction(async (transactionClient) => {
    const res = await transactionClient.userProfile.update({
      where: {
        id,
      },
      data: userProfileData,
    });
    if (!res) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Unable to update userProfile data!"
      );
    }
    return res;
  });
  return result;
};

export const UserServices = {
  createAdminIntoDB,
  createSellerIntoDB,
  createBuyerIntoDB,
  updateUserStatusIntoDB,

  createUserIntoDB,
  getMyProfileIntoDB,
  getMyUserProfileDataIntoDB,
  updateMyProfileIntoDB,
  updateEveryUserProfileDataIntoDB,
};
