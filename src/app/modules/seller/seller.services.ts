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
  });
  return result;
};

export const SellerServices = {
  getAllSellerIntoDB,
  getSingleSellerIntoDB,
};
