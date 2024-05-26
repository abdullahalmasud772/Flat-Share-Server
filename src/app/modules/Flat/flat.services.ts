import { Request } from "express";
import prisma from "../../../shared/prisma";
import { Flat, Prisma } from "@prisma/client";
import { flatSearchableFields } from "./flat.constant";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";
import { IFlatFilterRequest } from "./flat.interface";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelper } from "../../../helpers/paginationHelper";

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

const createFlatIntoDB = async (req: Request) => {
  const user = req.user;
  const file = req.file as IUploadFile;

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
      console.log(createFlat);
      return createFlat;
    });
    return result;
  } else {
    console.log("You are not parmited!");
  }
};

const getAllFlatsIntoDB = async (  filters: IFlatFilterRequest,
  options: IPaginationOptions):Promise<IGenericResponse<Flat[]>> => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];

  // const params = req.query as any;
  // const andCondition: Prisma.FlatWhereInput[] = [];
  // const whereConditions: Prisma.FlatWhereInput = { AND: andCondition };

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
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  // andConditions.push({
  //   isDeleted: false,
  // });

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
            createdAt: 'desc',
          },
  });
  const total = await prisma.flat.count({
    where: whereConditions,
  });

  // const result = await prisma.flat.findMany({
  //   where: whereConditions,
  // });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
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

  const result = await prisma.flat.update({
    where: {
      id: flatId,
    },
    data,
  });

  return result;
};

export const FlatServices = {
  createFlatIntoDB,
  getAllFlatsIntoDB,
  updateFlatIntoDB,
};
