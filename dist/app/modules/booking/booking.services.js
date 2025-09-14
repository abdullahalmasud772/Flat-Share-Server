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
exports.BookingServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const payment_utils_1 = __importDefault(require("../payment/payment.utils"));
const createBookingIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const userId = req?.user?.userId;
    const email = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email;
    yield prisma_1.default.flat.findUniqueOrThrow({
        where: {
            id: req.body.flatId,
            availability: true,
        },
    });
    const findbooking = yield prisma_1.default.booking.count({
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
    const result = yield prisma_1.default.booking.create({
        data: flatData,
    });
    return result;
});
const getAllBookingIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const email = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.email;
    const role = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role;
    // include: {
    //   flat: {
    //     select: { flatName:true,email:true }
    //   },
    // },
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        if (role === client_1.UserRole.ADMIN) {
            const result = yield transactionClient.booking.findMany({
                select: {
                    id: true,
                    status: true,
                    paymentStatus: true,
                    createdAt: true,
                    flat: {
                        select: {
                            flatName: true,
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
        if (role === client_1.UserRole.SELLER) {
            const result = yield transactionClient.booking.findMany({
                where: {
                    flat: {
                        email: email,
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
        if (role === client_1.UserRole.BUYER) {
            const result = yield transactionClient.booking.findMany({
                where: {
                    email: email,
                },
                // include: {
                //   flat: true,
                // },
            });
            return result;
        }
    }));
    return result;
});
const getSingleBookingIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    ///
});
const updateBookingStatusIntoDB = (req, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
        },
    });
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const email = (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.email;
        const result = yield ((_e = transactionClient.booking) === null || _e === void 0 ? void 0 : _e.findMany({
            where: {
                flat: {
                    email: email,
                },
                flatId: (_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.flatId,
            },
        }));
        if ((result === null || result === void 0 ? void 0 : result.length) > 1) {
            const filteredResults = result.filter((item) => item.id !== bookingId);
            const [flatId] = filteredResults.map((item) => item.flatId);
            yield ((_g = transactionClient.booking) === null || _g === void 0 ? void 0 : _g.updateMany({
                where: {
                    id: { not: bookingId },
                    flatId: flatId,
                },
                data: { status: "REJECTED" },
            }));
        }
        const updateConfirmBooking = yield ((_h = transactionClient.booking) === null || _h === void 0 ? void 0 : _h.update({
            where: {
                id: bookingId,
            },
            data: (_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.values,
        }));
        const [flatId] = result === null || result === void 0 ? void 0 : result.map((item) => item === null || item === void 0 ? void 0 : item.flatId);
        const updateBookingFlatStatus = yield ((_k = transactionClient.flat) === null || _k === void 0 ? void 0 : _k.update({
            where: {
                id: flatId,
            },
            data: { availability: false },
        }));
        const flatAmountData = yield ((_l = transactionClient === null || transactionClient === void 0 ? void 0 : transactionClient.flat) === null || _l === void 0 ? void 0 : _l.findFirstOrThrow({
            where: {
                id: (_m = req === null || req === void 0 ? void 0 : req.body) === null || _m === void 0 ? void 0 : _m.flatId,
            },
            select: {
                advanceAmount: true,
                rent: true,
            },
        }));
        const rentWithAdvanceAmount = (flatAmountData === null || flatAmountData === void 0 ? void 0 : flatAmountData.advanceAmount) + (flatAmountData === null || flatAmountData === void 0 ? void 0 : flatAmountData.rent);
        const transactionId = yield (0, payment_utils_1.default)();
        const paymentData = {
            bookingId: bookingId,
            amount: rentWithAdvanceAmount,
            transactionId: transactionId,
        };
        const createPaymentData = yield transactionClient.payment.create({
            data: paymentData,
        });
        return { updateConfirmBooking, updateBookingFlatStatus, createPaymentData };
    }));
    return result;
});
exports.BookingServices = {
    createBookingIntoDB,
    getAllBookingIntoDB,
    getSingleBookingIntoDB,
    updateBookingStatusIntoDB,
};
