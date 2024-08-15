"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerRoutes = void 0;
const express_1 = require("express");
const buyer_controllers_1 = require("./buyer.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), buyer_controllers_1.BuyerControllers.getAllBuyer);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), buyer_controllers_1.BuyerControllers.getSingleBuyer);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.BUYER), buyer_controllers_1.BuyerControllers.updateSingleBuyer);
exports.BuyerRoutes = router;
