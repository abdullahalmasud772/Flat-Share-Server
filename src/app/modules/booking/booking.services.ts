import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { Booking, UserRole } from "@prisma/client";
import generateTransactionId from "../payment/payment.utils";

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

const getAllBookingIntoDB = async (req: Request) => {
  const email = req?.user?.email;
  const role = req?.user?.role;
  // include: {
  //   flat: {
  //     select: { flatName:true,email:true }
  //   },
  // },
  const result = await prisma.$transaction(async (transactionClient) => {
    if (role === UserRole.ADMIN) {
      const result = await transactionClient.booking.findMany({
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          flat: {
            select: {
              flatName: true,
              flatPhoto: true,
              user: { select: { seller: { select: { name: true } } } },
            },
          },
          user: {
            select: {
              buyer: { select: { name: true } },
            },
          },
        },
      });
      return result;
    }
    if (role === UserRole.SELLER) {
      const result = await transactionClient.booking.findMany({
        where: {
          flat: {
            email: email,
          },
        },
        select: {
          id: true,
          flatId: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          flat: { select: { flatName: true, flatPhoto: true } },
          user: {
            select: {
              buyer: {
                select: { name: true, email: true, contactNumber: true },
              },
            },
          },
        },
        // include: {
        //   user: {
        //     include: {
        //       buyer: true,
        //     },
        //   },
        //   flat: true,
        // },
      });
      return result;
    }
    if (role === UserRole.BUYER) {
      const result = await transactionClient.booking.findMany({
        where: {
          email: email,
        },
        // include: {
        //   flat: true,
        // },
      });
      return result;
    }
  });

  return result;
};

const getSingleBookingIntoDB = async (req: Request) => {
  ///
};

const updateBookingStatusIntoDB = async (req: Request, bookingId: string) => {
  console.log(bookingId, 'booking id');
  console.log(req?.user, 'body')
  //// check exists booking id
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    select: { id: true, flatId: true },
  });

  //// create transaction Id
  const transactionId = (await generateTransactionId()) as string;

  const result = await prisma.$transaction(async (tx) => {
    ///// Flat booking list
    const flatOwner = req?.user?.email;
    const flatBookingList = await tx.booking?.findMany({
      where: {
        flat: {
          email: flatOwner,
        },
        flatId: booking?.flatId,
      },
    });

    ////// If there are multiple bookings, then all of them should be rejected except the one that is confirmed.
    if (flatBookingList?.length > 1) {
      await tx.booking?.updateMany({
        where: {
          id: { not: bookingId },
          flatId: booking.flatId,
        },
        data: { status: "REJECTED" },
      });
    }

    /////  update confirm booking
    await tx.booking?.update({
      where: {
        id: bookingId,
      },
      data: { status: "BOOKED" },
    });

    /////  update booking flat status availability false
    await tx.flat?.update({
      where: {
        id: booking?.flatId,
      },
      data: { availability: false },
    });

    //// calculate amount
    const flatAmountData = await tx?.flat?.findUniqueOrThrow({
      where: { id: booking?.flatId },
      select: { advanceAmount: true, rent: true },
    });
    const rentWithAdvanceAmount =
      flatAmountData?.advanceAmount + flatAmountData?.rent;

    // Delete old payment if exists (safer way)
    await tx.payment.deleteMany({
      where: { bookingId },
    });

    // Create new payment
    const createPayment = await tx.payment.create({
      data: { bookingId, amount: rentWithAdvanceAmount, transactionId },
    });

    return createPayment;
  });

  return result;
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingIntoDB,
  getSingleBookingIntoDB,
  updateBookingStatusIntoDB,
};
