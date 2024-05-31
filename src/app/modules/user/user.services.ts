import { Request } from "express";
import prisma from "../../../shared/prisma";
import { hashedPassword } from "../../../helpers/hashPasswordHelper";
import { UserRole, UserStatus } from "@prisma/client";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

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
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        role: req.body.role,
      },
    });

    const userProfile = await transactionClient.userProfile.create({
      data: {
        userId: newUser.id,
        name: req.body.user.name,
        profession: req.body.user.profession,
        address: req.body.user.address,
        profilePhoto: req.body.user.profilePhoto,
      },
    });
    return { newUser, userProfile };
  });
  return result;
};

const getSellerIntoDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "SELLER",
    },
  });
  return result;
};
const getBuyerIntoDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "BUYER",
    },
  });
  return result;
};

const getMyProfileIntoDB = async (authUser: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: authUser.userId,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      username: true,
      status: true,
    },
  });

  let profileData;
  if (userData?.role === UserRole.ADMIN) {
    profileData = await prisma.userProfile.findUnique({
      where: {
        userId: userData?.id,
      },
    });
  } else if (userData?.role === UserRole.BUYER) {
    profileData = await prisma.userProfile.findUnique({
      where: {
        userId: userData.id,
      },
    });
  } else if (userData?.role === UserRole.SELLER) {
    profileData = await prisma.userProfile.findUnique({
      where: {
        userId: userData.id,
      },
    });
  }
  return { ...profileData, ...userData };
};

export const userServices = {
  createUserIntoDB,
  getSellerIntoDB,
  getBuyerIntoDB,
  getMyProfileIntoDB,
};
