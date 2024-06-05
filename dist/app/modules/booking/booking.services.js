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
const createBookingIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //const token = req.headers.authorization;
    //const decoded = jwt.decode(token as string);
    // const { id } = decoded as JwtPayload;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    console.log(req.body.userId);
    yield prisma_1.default.flat.findUniqueOrThrow({
        where: {
            id: req.body.flatId,
            availability: true,
        },
    });
    const findbooking = yield prisma_1.default.booking.count({
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
    const result = yield prisma_1.default.booking.create({
        data: flatData,
    });
    return result;
});
const getBookingIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userId = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const role = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role;
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        if (role === client_1.UserRole.ADMIN) {
            const result = yield transactionClient.booking.findMany();
            return result;
        }
        if (role === client_1.UserRole.SELLER) {
            const result = yield transactionClient.booking.findMany({
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
        if (role === client_1.UserRole.BUYER) {
            const result = yield transactionClient.booking.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    flat: true,
                },
            });
            return result;
        }
    }));
    return result;
});
const updateBookingStatusIntoDB = (bookingId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
        },
    });
    const result = yield prisma_1.default.booking.update({
        where: {
            id: bookingId,
        },
        data,
    });
    return result;
});
exports.BookingServices = {
    createBookingIntoDB,
    getBookingIntoDB,
    updateBookingStatusIntoDB,
};
