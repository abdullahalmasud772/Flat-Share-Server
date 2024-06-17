import { User, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { IAuthUser } from "../../../interfaces/common";
import { JwtPayload } from "jsonwebtoken";

export type IAdminUpdateBuyer = {
  role: ENUM_USER_ROLE;
  status: UserStatus;
};

const getAllBuyerIntoDB = async () => {
  const result = await prisma.buyer.findMany();
  return result;
};

const getSingleBuyerIntoDB = async (id: string) => {
  const result = await prisma.buyer.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          status: true,
        },
      },
    },
  });
  return result;
};

const updateSingleBuyerIntoDB = async (
  id: string,
  payload: Partial<IAdminUpdateBuyer>,
): Promise<User | null> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

export const BuyerServices = {
  getAllBuyerIntoDB,
  getSingleBuyerIntoDB,
  updateSingleBuyerIntoDB,
};
