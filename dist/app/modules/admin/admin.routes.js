"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const admin_controllers_1 = require("./admin.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controllers_1.AdminControllers.getAllAdmin);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controllers_1.AdminControllers.updateSingleAdmin);
exports.AdminRoutes = router;
