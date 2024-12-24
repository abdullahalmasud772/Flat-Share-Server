"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const booking_controller_1 = require("./booking.controller");
const client_1 = require("@prisma/client");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.BUYER), booking_controller_1.BookingController.createBooking);
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.SELLER, client_1.UserRole.BUYER), booking_controller_1.BookingController.getBooking);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), booking_controller_1.BookingController.getSingleBooking);
router.patch("/booking-request/:bookingId", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), booking_controller_1.BookingController.updateBookingStatus);
exports.BookingRoutes = router;
