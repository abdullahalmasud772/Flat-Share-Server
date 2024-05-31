import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { Booking, UserRole } from "@prisma/client";

const createBookingIntoDB = async (req: Request) => {
  //const token = req.headers.authorization;
  //const decoded = jwt.decode(token as string);
  // const { id } = decoded as JwtPayload;
  const userId = req?.user?.userId;
  console.log(req.body.userId);

  await prisma.flat.findUniqueOrThrow({
    where: {
      id: req.body.flatId,
      availability: true,
    },
  });

  const findbooking = await prisma.booking.count({
    where: {
      userId: userId,
      flatId: req.body.flatId,
    },
  });
  const bookingLenth = findbooking > 0;

  if (bookingLenth) {
    throw new Error("This flat you alrady booked!");
  }

  const flatData = {
    userId: userId,
    flatId: req.body.flatId,
  };

  const result = await prisma.booking.create({
    data: flatData,
  });

  return result;
};

const getBookingIntoDB = async (req: Request) => {
  const userId = req?.user?.userId;
  const role = req?.user?.role;

  const result = await prisma.$transaction(async (transactionClient) => {
    if (role === UserRole.ADMIN) {
      const result = await transactionClient.booking.findMany();
      return result;
    }
    if (role === UserRole.SELLER) {
      const result = await transactionClient.booking.findMany({
        where: {
          flat: {
            userId: userId,
          },
        },
        include: {
          user: true,
          flat: true,
        },
      });
      return result;
    }
    if (role === UserRole.BUYER) {
      const result = await transactionClient.booking.findMany({
        where: {
          userId: userId,
        },
      });
      return result;
    }
  });

  return result;
};

const updateBookingStatusIntoDB = async (
  bookingId: string,
  data: Partial<Booking>
): Promise<Booking> => {
  await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data,
  });
  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getBookingIntoDB,
  updateBookingStatusIntoDB,
};
