import { User, UserStatus } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";
import prisma from "../../../shared/prisma";

export type IAdminUpdateSeller = {
  role: ENUM_USER_ROLE;
  status: UserStatus;
};

const getAllSellerIntoDB = async () => {
  const result = await prisma.seller.findMany({
    where: {
      isDeleted: false,
    },
  });
  return result;
};

const getSingleSellerIntoDB = async (id: string) => {
  const result = await prisma.seller.findUniqueOrThrow({
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

const updateSingleSellerIntoDB = async (
  id: string,
  payload: Partial<IAdminUpdateSeller>
): Promise<User | null> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const SellerServices = {
  getAllSellerIntoDB,
  getSingleSellerIntoDB,
  updateSingleSellerIntoDB,
};
