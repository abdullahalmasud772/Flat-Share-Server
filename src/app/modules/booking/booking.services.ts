import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { Booking } from "@prisma/client";

const createBookingIntoDB = async (req: Request) => {
  //const token = req.headers.authorization;
  //const decoded = jwt.decode(token as string);
  // const { id } = decoded as JwtPayload;
  const userId = req?.user?.userId;

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

const getAllBookingIntoDB = async () => {
  const result = await prisma.booking.findMany();
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
  getAllBookingIntoDB,
  updateBookingStatusIntoDB,
};
