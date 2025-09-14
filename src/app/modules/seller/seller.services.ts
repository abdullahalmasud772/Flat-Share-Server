import { Seller } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAllSellerIntoDB = async () => {
  const result = await prisma.seller.findMany();
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
  payload: Partial<Seller>
): Promise<Seller | null> => {
  const { ...sellerData } = payload;
  const result = await prisma.seller.update({
    where: {
      id,
    },
    data: sellerData,
  });
  return result;
};

export const SellerServices = {
  getAllSellerIntoDB,
  getSingleSellerIntoDB,
  updateSingleSellerIntoDB,
};
