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
                            flatPhoto: true,
                            rent: true,
                            advanceAmount: true,
                            user: { select: { seller: { select: { name: true } } } },
                        },
                    },
                    user: {
                        select: {
                            buyer: { select: { name: true } },
                        },
                    },
                    payment: { select: { amount: true } },
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
                select: {
                    id: true,
                    flatId: true,
                    status: true,
                    paymentStatus: true,
                    createdAt: true,
                    flat: {
                        select: {
                            flatName: true,
                            flatPhoto: true,
                            rent: true,
                            advanceAmount: true,
                        },
                    },
                    user: {
                        select: {
                            buyer: {
                                select: { name: true, email: true, contactNumber: true },
                            },
                        },
                    },
                    payment: { select: { amount: true } },
                },
            });
            return result;
        }
        if (role === client_1.UserRole.BUYER) {
            const result = yield transactionClient.booking.findMany({
                where: {
                    email: email,
                },
                select: {
                    id: true,
                    flatId: true,
                    status: true,
                    paymentStatus: true,
                    createdAt: true,
                    flat: {
                        select: {
                            flatName: true,
                            flatPhoto: true,
                            availability: true,
                            location: true,
                            rent: true,
                            advanceAmount: true,
                            user: {
                                select: { seller: { select: { name: true, email: true } } },
                            },
                        },
                    },
                    payment: { select: { amount: true } },
                },
            });
            return result;
        }
    }));
    return result;
});
const getSingleBookingIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const bookingId = (_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.id;
    const user = req === null || req === void 0 ? void 0 : req.user;
    if ((user === null || user === void 0 ? void 0 : user.role) === client_1.UserRole.ADMIN) {
        const result = yield prisma_1.default.booking.findUniqueOrThrow({
            where: { id: bookingId },
        });
        return result;
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === client_1.UserRole.SELLER) {
        return yield prisma_1.default.booking.findUniqueOrThrow({
            where: { id: bookingId, flat: { email: user === null || user === void 0 ? void 0 : user.email } },
        });
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === client_1.UserRole.BUYER) {
        return yield prisma_1.default.booking.findUniqueOrThrow({
            where: { id: bookingId, email: user === null || user === void 0 ? void 0 : user.email },
            select: {
                id: true,
                email: true,
                paymentStatus: true,
                createdAt: true,
                status: true,
                payment: { select: { amount: true } },
                flat: {
                    select: {
                        flatName: true,
                        flatPhoto: true,
                        flatNo: true,
                        email: true,
                        squareFeet: true,
                        totalRooms: true,
                        totalBedrooms: true,
                        location: true,
                        rent: true,
                        advanceAmount: true,
                        availability: true,
                        description: true,
                        amenities: true,
                        utilitiesDescription: true,
                        viewFlat: true,
                        user: {
                            select: { seller: { select: { name: true, email: true } } },
                        },
                    },
                },
            },
        });
    }
});
const updateBookingStatusIntoDB = (req, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    //// check exists booking id
    const booking = yield prisma_1.default.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
        },
        select: { id: true, flatId: true },
    });
    //// create transaction Id
    const transactionId = (yield (0, payment_utils_1.default)());
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f, _g, _h, _j, _k;
        ///// Flat booking list
        const flatOwner = (_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.email;
        const flatBookingList = yield ((_f = tx.booking) === null || _f === void 0 ? void 0 : _f.findMany({
            where: {
                flat: {
                    email: flatOwner,
                },
                flatId: booking === null || booking === void 0 ? void 0 : booking.flatId,
            },
        }));
        ////// If there are multiple bookings, then all of them should be rejected except the one that is confirmed.
        if ((flatBookingList === null || flatBookingList === void 0 ? void 0 : flatBookingList.length) > 1) {
            yield ((_g = tx.booking) === null || _g === void 0 ? void 0 : _g.updateMany({
                where: {
                    id: { not: bookingId },
                    flatId: booking.flatId,
                },
                data: { status: "REJECTED" },
            }));
        }
        /////  update confirm booking
        yield ((_h = tx.booking) === null || _h === void 0 ? void 0 : _h.update({
            where: {
                id: bookingId,
            },
            data: { status: "BOOKED" },
        }));
        /////  update booking flat status availability false
        yield ((_j = tx.flat) === null || _j === void 0 ? void 0 : _j.update({
            where: {
                id: booking === null || booking === void 0 ? void 0 : booking.flatId,
            },
            data: { availability: false },
        }));
        //// calculate amount
        const flatAmountData = yield ((_k = tx === null || tx === void 0 ? void 0 : tx.flat) === null || _k === void 0 ? void 0 : _k.findUniqueOrThrow({
            where: { id: booking === null || booking === void 0 ? void 0 : booking.flatId },
            select: { advanceAmount: true, rent: true },
        }));
        const rentWithAdvanceAmount = (flatAmountData === null || flatAmountData === void 0 ? void 0 : flatAmountData.advanceAmount) + (flatAmountData === null || flatAmountData === void 0 ? void 0 : flatAmountData.rent);
        // Delete old payment if exists (safer way)
        yield tx.payment.deleteMany({
            where: { flatId: booking.flatId },
        });
        // Create new payment
        const createPayment = yield tx.payment.create({
            data: {
                bookingId,
                flatId: booking.flatId,
                amount: rentWithAdvanceAmount,
                transactionId,
            },
        });
        return createPayment;
    }));
    return result;
});
exports.BookingServices = {
    createBookingIntoDB,
    getAllBookingIntoDB,
    getSingleBookingIntoDB,
    updateBookingStatusIntoDB,
};
