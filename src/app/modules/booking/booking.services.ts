import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { Booking, UserRole } from "@prisma/client";

const createBookingIntoDB = async (req: Request) => {
  // const userId = req?.user?.userId;
  const email = req?.user?.email;

  await prisma.flat.findUniqueOrThrow({
    where: {
      id: req.body.flatId,
      availability: true,
    },
  });

  const findbooking = await prisma.booking.count({
    where: {
      email: email,
      flatId: req.body.flatId,
    },
  });
  const bookingLenth = findbooking > 0;

  if (bookingLenth) {
    throw new Error("This flat you alrady booked!");
  }

  const flatData = {
    email: email,
    flatId: req.body.flatId,
  };

  const result = await prisma.booking.create({
    data: flatData,
  });

  return result;
};

const getBookingIntoDB = async (req: Request) => {
  // const userId = req?.user?.userId;
  const email = req?.user?.email;
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
            email: email,
          },
        },
        include: {
          user: {
            include:{
              buyer:true
            }
          },
          flat: true,
        },
      },


    
    );
      return result;
    }
    if (role === UserRole.BUYER) {
      const result = await transactionClient.booking.findMany({
        where: {
          email: email,
        },
        include: {
          flat: true,
        },
      });
      return result;
    }
  });

  return result;
};

const getSingleBookingIntoDB = async (req: Request) => {
  ///
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
  getSingleBookingIntoDB,
  updateBookingStatusIntoDB,
};
