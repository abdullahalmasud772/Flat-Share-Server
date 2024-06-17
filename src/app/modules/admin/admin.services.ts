import exp from "constants";
import prisma from "../../../shared/prisma";
import { Admin } from "@prisma/client";

const getAllAdminIntoDB = async () => {
  const result = await prisma.admin.findMany();
  return result;
};

const updateSingleAdminIntoDB = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  const { ...adminData } = payload;
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: adminData,
  });
  return result;
};

export const AdminServices = {
  getAllAdminIntoDB,
  updateSingleAdminIntoDB,
};
