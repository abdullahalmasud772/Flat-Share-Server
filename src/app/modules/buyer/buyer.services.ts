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
  });
  return result;
};

export const BuyerServices = {
  getAllBuyerIntoDB,
  getSingleBuyerIntoDB,
};
