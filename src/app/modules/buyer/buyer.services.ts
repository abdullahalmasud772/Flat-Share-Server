import { Buyer, User } from "@prisma/client";
import prisma from "../../../shared/prisma";

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
  payload: Partial<Buyer>
): Promise<Buyer | null> => {
  const { ...buyerData } = payload;
  const result = await prisma.buyer.update({
    where: {
      id,
    },
    data: buyerData,
  });

  return result;
};

export const BuyerServices = {
  getAllBuyerIntoDB,
  getSingleBuyerIntoDB,
  updateSingleBuyerIntoDB,
};
