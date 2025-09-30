import { Request } from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import prisma from "../../../shared/prisma";
import { SSLService } from "../sslcommerz/ssl.service";
import { PaymentStatus } from "@prisma/client";

const initPaymentIntoDB = async (req: Request) => {
  const { bookingId } = req.params;

  const paymentDta = await prisma.payment.findFirstOrThrow({
    where: {
      bookingId: bookingId,
    },
    select: {
      transactionId: true,
      amount: true,
      booking: {
        select: {
          user: {
            select: {
              buyer: {
                select: {
                  name: true,
                  email: true,
                  contactNumber: true,
                  address: true,
                },
              },
            },
          },
          flat: {
            select: {
              flatName: true,
              flatNo: true,
            },
          },
        },
      },
    },
  });


  const initPaymentData = {
    amount: paymentDta?.amount,
    transactionId: paymentDta?.transactionId,
    flat_name: paymentDta?.booking?.flat?.flatName,
    cus_name: paymentDta?.booking?.user?.buyer?.name || '',
    cus_email: paymentDta?.booking?.user?.buyer?.email || '',
    cus_address: paymentDta?.booking?.user?.buyer?.address || '',
    cus_phone: paymentDta?.booking?.user?.buyer?.contactNumber || '',
  };

  const result = await SSLService.initPayment(initPaymentData);
  return { paymentUrl: result?.GatewayPageURL };
};

const validatePaymentIntoDB = async (payload: any) => {
  // HTTP POST Parameters will be throw to the IPN_HTTP_URL as amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=flats671891d979f52&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=34be780601ea7e6c6ebe64cfad9d55a3&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return { message: "Invalid Payment!" };
  // }

  // const response = await SSLService.validatePayment(payload);

  // if (response?.status !== "VALID") {
  //   return {
  //     message: "Payment Failed!",
  //   };
  // }

  const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatedPyamentData = await tx.payment.update({
      where: {
        transactionId: response?.tran_id,
      },
      data: {
        payStatus: PaymentStatus.PAID,
        paymentGetwayData: response,
      },
    });

    await tx.booking.update({
      where: {
        id: updatedPyamentData?.bookingId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });
  return response;
};

const getPaymentIntoDB = async (req: Request) => {
  const role = req?.user?.role;
  const email = req?.user?.email;

  const result = await prisma.$transaction(async (transactionClient) => {
    if (role === ENUM_USER_ROLE.ADMIN) {
      const result = await transactionClient.payment.findMany();
      return result;
    }

    if (role === ENUM_USER_ROLE.SELLER) {
      const result = await transactionClient.payment.findMany({
        where: {
          booking: {
            user: {
              email: email,
            },
          },
        },
      });
      return result;
    }

    if (role === ENUM_USER_ROLE.BUYER) {
      const result = await transactionClient.payment.findMany({
        where: {
          booking: {
            email: email,
          },
        },
        include: {
          booking: {
            select: {
              flat: {
                select: {
                  flatName: true,
                  flatPhoto:true,
                  flatNo: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      return result;
    }
  });

  return result;
};

export const PaymentServices = {
  initPaymentIntoDB,
  validatePaymentIntoDB,
  getPaymentIntoDB,
};
