import { Request } from "express";
import prisma from "../../../shared/prisma";
import { Booking, Flat, Prisma } from "@prisma/client";
import { flatSearchableFields } from "./flat.constant";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { IFlatFilterRequest } from "./flat.interface";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

interface FlatCreateInput {
  flatName: string | null;
  userId: string | null;
  squareFeet: number | null;
  totalBedrooms: number | null;
  totalRooms: number | null;
  utilitiesDescription: string | null;
  location: String | null;
  description: String | null;
  amenities: String | null;
  rent: number | null;
  advanceAmount: number | null;
  availability: Boolean;
  flatPhoto: string | null;
}

interface IUpdateFlat {
  flatName: string | null | undefined;
  userId: string | null | undefined;
  squareFeet: number | null | undefined;
  totalBedrooms: number | null | undefined;
  totalRooms: number | null | undefined;
  utilitiesDescription: string | null | undefined;
  location: String | null | undefined;
  description: String | null | undefined;
  amenities: String | null | undefined;
  rent: number | null | undefined;
  advanceAmount?: number | null | undefined;
  availability?: Boolean | undefined;
  flatPhoto?: string | null | undefined;
  booking?: Booking;
}

const createFlatIntoDB = async (req: Request) => {
  const user = req.user;
  const file = req.file as IUploadFile;

  const existingFlat = await prisma.flat.findUnique({
    where: {
      flatName: req.body.flatName,
    },
  });

  if (existingFlat) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This flat you alrady created!");
  }

  if (user?.role === "SELLER") {
    if (file) {
      const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
        file
      );
      req.body.flatPhoto = uploadedProfileImage?.secure_url;
    }

    const result = await prisma.$transaction(async (transactionClient) => {
      const createFlat: FlatCreateInput = await transactionClient.flat.create({
        data: {
          userId: user?.userId,
          flatName: req.body.flatName,
          squareFeet: req.body.squareFeet,
          totalBedrooms: req.body.totalBedrooms,
          totalRooms: req.body.totalRooms,
          utilitiesDescription: req.body.utilitiesDescription,
          location: req.body.location,
          description: req.body.description,
          amenities: req.body.amenities,
          rent: req.body.rent,
          advanceAmount: req.body.advanceAmount,
          flatPhoto: req.body.flatPhoto,
        },
      });
      return createFlat;
    });
    return result;
  } else {
    console.log("You are not parmited!");
  }
};

const getAllFlatsIntoDB = async (
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
      user: true,
      booking: true,
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
      userId: user?.userId,
    },
  });
  return result;
};

const getSingleFlatIntoDB = async (id: string): Promise<Flat | null> => {
  const result = await prisma.flat.findUniqueOrThrow({
    where: {
      id,
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
  data: Partial<Flat>
): Promise<Flat> => {
  await prisma.flat.findUniqueOrThrow({
    where: {
      id: flatId,
    },
  });

  console.log(data);
  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data,
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
  getAllFlatsIntoDB,
  getSellerFlatsIntoDB,
  getSingleFlatIntoDB,
  updateFlatIntoDB,
  deleteFlatIntoDB,
};
