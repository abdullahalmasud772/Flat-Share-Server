import { Request } from "express";
import prisma from "../../../shared/prisma";
import { hashedPassword } from "../../../helpers/hashPasswordHelper";
import { UserRole } from "@prisma/client";

const createUserIntoDB = async (payload: any) => {
  const hashPassword = await hashedPassword(payload.password);

  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });
    return newUser;
  });

  return result;
};

export const userServices = {
  createUserIntoDB,
};
