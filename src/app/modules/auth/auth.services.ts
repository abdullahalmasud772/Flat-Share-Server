import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { ILoginUser } from "./auth.interface";

const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
}

};

export const AuthServices = {
  loginUserIntoDB,
};
