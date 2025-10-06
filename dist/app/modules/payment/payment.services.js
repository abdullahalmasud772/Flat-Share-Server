"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const user_1 = require("../../../enums/user");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ssl_service_1 = require("../sslcommerz/ssl.service");
const client_1 = require("@prisma/client");
const initPaymentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const { bookingId } = req.params;
    const paymentDta = yield prisma_1.default.payment.findFirstOrThrow({
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
        amount: paymentDta === null || paymentDta === void 0 ? void 0 : paymentDta.amount,
        transactionId: paymentDta === null || paymentDta === void 0 ? void 0 : paymentDta.transactionId,
        flat_name: (_b = (_a = paymentDta === null || paymentDta === void 0 ? void 0 : paymentDta.booking) === null || _a === void 0 ? void 0 : _a.flat) === null || _b === void 0 ? void 0 : _b.flatName,
        cus_name: ((_e = (_d = (_c = paymentDta === null || paymentDta === void 0 ? void 0 : paymentDta.booking) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.buyer) === null || _e === void 0 ? void 0 : _e.name) || '',
        cus_email: ((_h = (_g = (_f = paymentDta === null || paymentDta === void 0 ? void 0 : paymentDta.booking) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g.buyer) === null || _h === void 0 ? void 0 : _h.email) || '',
        cus_address: ((_l = (_k = (_j = paymentDta === null || paymentDta === void 0 ? void 0 : paymentDta.booking) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.buyer) === null || _l === void 0 ? void 0 : _l.address) || '',
        cus_phone: ((_p = (_o = (_m = paymentDta === null || paymentDta === void 0 ? void 0 : paymentDta.booking) === null || _m === void 0 ? void 0 : _m.user) === null || _o === void 0 ? void 0 : _o.buyer) === null || _p === void 0 ? void 0 : _p.contactNumber) || '',
    };
    const result = yield ssl_service_1.SSLService.initPayment(initPaymentData);
    return { paymentUrl: result === null || result === void 0 ? void 0 : result.GatewayPageURL };
});
const validatePaymentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPyamentData = yield tx.payment.update({
            where: {
                transactionId: response === null || response === void 0 ? void 0 : response.tran_id,
            },
            data: {
                payStatus: client_1.PaymentStatus.PAID,
                paymentGetwayData: response,
            },
        });
        yield tx.booking.update({
            where: {
                id: updatedPyamentData === null || updatedPyamentData === void 0 ? void 0 : updatedPyamentData.bookingId,
            },
            data: {
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        });
    }));
    return response;
});
const getPaymentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _q, _r;
    const role = (_q = req === null || req === void 0 ? void 0 : req.user) === null || _q === void 0 ? void 0 : _q.role;
    const email = (_r = req === null || req === void 0 ? void 0 : req.user) === null || _r === void 0 ? void 0 : _r.email;
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        if (role === user_1.ENUM_USER_ROLE.ADMIN) {
            const result = yield transactionClient.payment.findMany();
            return result;
        }
        if (role === user_1.ENUM_USER_ROLE.SELLER) {
            const result = yield transactionClient.payment.findMany({
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
        if (role === user_1.ENUM_USER_ROLE.BUYER) {
            const result = yield transactionClient.payment.findMany({
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
                                    flatPhoto: true,
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
    }));
    return result;
});
exports.PaymentServices = {
    initPaymentIntoDB,
    validatePaymentIntoDB,
    getPaymentIntoDB,
};
