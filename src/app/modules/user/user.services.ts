import { Request } from "express";
import prisma from "../../../shared/prisma";

const createUserIntoDB = async (data: any) => {
  const result = prisma.user.create({ data });
  return result;
};

export const userServices = {
  createUserIntoDB,
};
