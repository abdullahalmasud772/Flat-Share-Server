"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const seller_controllers_1 = require("./seller.controllers");
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), seller_controllers_1.SellerControllers.getAllSeller);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), seller_controllers_1.SellerControllers.getSingleSeller);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), seller_controllers_1.SellerControllers.updateSingleSeller);
exports.SellerRoutes = router;
