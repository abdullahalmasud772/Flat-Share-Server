import { Request } from "express";
import prisma from "../../../shared/prisma";
import { Booking, Flat, Prisma, UserStatus } from "@prisma/client";
import { FlatCreateInput, flatSearchableFields } from "./flat.constant";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { IFlatFilterRequest } from "./flat.interface";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { generateFlatNumber } from "./flat.utils";

const createFlatIntoDB = async (req: Request) => {
  const user = req.user;
  const userData = await prisma.user.findUnique({where:{id:user?.userId, status:UserStatus.ACTIVE}, select:{email:true}});

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exists!");
  }
  const existingFlat = await prisma.flat.findUnique({
    where: { flatName: req?.body?.flatName },
  });
  if (existingFlat) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This flat you alrady created!");
  }

  const flatdata = req.body;
  const file = req.file as IUploadFile;
  if (file) {
    flatdata.flatPhoto = file?.path;
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const flatNo = await generateFlatNumber();
    const createFlat: FlatCreateInput = await transactionClient.flat.create({
      data: {
        flatNo: flatNo,
        email: userData?.email,
        flatName: flatdata.flatName,
        squareFeet: flatdata.squareFeet,
        totalBedrooms: flatdata.totalBedrooms,
        totalRooms: flatdata.totalRooms,
        utilitiesDescription: flatdata.utilitiesDescription,
        location: flatdata.location,
        description: flatdata.description,
        amenities: flatdata.amenities,
        rent: flatdata.rent,
        advanceAmount: flatdata.advanceAmount,
        flatPhoto: flatdata.flatPhoto,
      },
    });
    return createFlat;
  });
  return result;
};

const getAllFlatIntoDB = async (
  filters: IFlatFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Flat[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  //// search Term
  if (searchTerm) {
    andConditions.push({
      OR: flatSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.FlatWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.flat.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      user: { select: { seller: { select: { name: true } } } },
      // booking:true,
      _count: { select: { booking: true } },
    },
  });
  const total = await prisma.flat.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSellerFlatsIntoDB = async (user: JwtPayload | null) => {
  const result = await prisma.flat.findMany({
    where: {
      email: user?.email,
      isDeleted: false,
    },
    include: {
      booking: true,
    },
  });
  return result;
};

const getSingleFlatIntoDB = async (id: string): Promise<Flat | null> => {
  const result = await prisma.flat.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      /* booking: true, */
    },
  });

  return result;
};

const updateFlatIntoDB = async (
  flatId: string,
  req: Request
) /* : Promise<Flat>  */ => {
  console.log(req.body);
  await prisma.flat.findUniqueOrThrow({
    where: {
      id: flatId,
      isDeleted: false,
    },
  });

  const file = req.file as IUploadFile;
  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.flatPhoto = uploadedProfileImage?.secure_url;
  }

  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data: req.body,
  });

  return result;
};

const softDeleteFlatIntoDB = async (id: string) => {
  const result = await prisma.flat.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

const deleteFlatIntoDB = async (id: string) => {
  const result = await prisma.flat.delete({
    where: {
      id,
    },
  });
  return result;
};

export const FlatServices = {
  createFlatIntoDB,
  getAllFlatIntoDB,
  getSellerFlatsIntoDB,
  getSingleFlatIntoDB,
  updateFlatIntoDB,
  softDeleteFlatIntoDB,
  deleteFlatIntoDB,
};
