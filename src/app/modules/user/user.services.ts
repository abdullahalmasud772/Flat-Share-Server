import { Request } from "express";
import prisma from "../../../shared/prisma";
import { hashedPassword } from "../../../helpers/hashPasswordHelper";
import { Admin, Buyer, Seller, UserRole, UserStatus } from "@prisma/client";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { generateUserId } from "./user.utils";

export type IAdminUpdateBuyer = {
  role: ENUM_USER_ROLE;
  status: UserStatus;
};

/// Create Admin
const createAdminIntoDB = async (req: Request) /* : Promise<Admin>  */ => {
  const adminData = req.body.admin;
  const existsAdmin = await prisma.user.findUnique({
    where: { email: adminData.email },
  });

  if (existsAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This email alrady exist!");
  }

  if (req?.file) {
    const file = req.file as IUploadFile;
    adminData.profilePhoto = file?.path;
    // const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
    //   file
    // );
    // req.body.admin.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const adminId = await generateUserId("admin");
  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        userId: adminId,
        email: adminData.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });

    const newAdmin = await transactionClient.admin.create({
      data: adminData,
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

  const sellerId = await generateUserId("seller");
  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        userId: sellerId,
        email: req.body.prifileData.email,
        password: hashPassword,
        role: UserRole.SELLER,
      },
    });
    const newSeller = await transactionClient.seller.create({
      data: req.body.prifileData,
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

  const buyerId = await generateUserId("buyer");
  const hashPassword = await hashedPassword(req.body.password);

  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        userId: buyerId,
        email: req.body.prifileData.email,
        password: hashPassword,
        role: UserRole.BUYER,
      },
    });
    const newBuyer = await transactionClient.buyer.create({
      data: req.body.prifileData,
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
  // console.log(file, 'masud');

  req.body.profilePhoto = file?.path;
  // if (file) {
  //   const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
  //     file
  //   );
  //   req.body.profilePhoto = uploadedProfileImage?.secure_url;
  // }

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

/// Update user status (Seller & Buyer)
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

export const UserServices = {
  createAdminIntoDB,
  createSellerIntoDB,
  createBuyerIntoDB,
  getMyProfileIntoDB,
  updateMyProfileIntoDB,
  updateUserStatusIntoDB,
};
