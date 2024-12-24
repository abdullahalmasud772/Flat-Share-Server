"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controllers_1 = require("./user.controllers");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
//// Create Admin
router.post("/create-admin", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createAdmin.parse(JSON.parse(req.body.data));
    return user_controllers_1.UserControllers.createAdmin(req, res, next);
});
//// Create Seller
router.post("/create-seller", fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createSeller.parse(JSON.parse(req.body.data));
    return user_controllers_1.UserControllers.createSeller(req, res, next);
});
//// Create Buyer
router.post("/create-buyer", fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createBuyer.parse(JSON.parse(req.body.data));
    return user_controllers_1.UserControllers.createBuyer(req, res, next);
});
//// get my profile
router.get("/me", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controllers_1.UserControllers.getMyProfile);
//// update my profile
router.patch("/update-my-profile", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    return user_controllers_1.UserControllers.updateMyProfile(req, res, next);
});
/// Update user status
router.patch("/update-user-status/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controllers_1.UserControllers.updateUserStatus);
exports.UserRoutes = router;
