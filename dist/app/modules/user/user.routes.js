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
const router = (0, express_1.Router)();
router.post("/", fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controllers_1.UserControllers.createUser(req, res, next);
});
router.get("/seller", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controllers_1.UserControllers.getSeller);
router.get("/seller/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controllers_1.UserControllers.getSingleSeller);
router.patch("/seller/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controllers_1.UserControllers.updateSingleSeller);
router.get("/buyer", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controllers_1.UserControllers.getBuyer);
router.get("/buyer/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controllers_1.UserControllers.getSingleBuyer);
router.patch("/buyer/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), user_controllers_1.UserControllers.updateSingleBuyer);
router.get("/me", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controllers_1.UserControllers.getMyProfile);
//// get my profileData
router.get("/me/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER, user_1.ENUM_USER_ROLE.SUPER_ADMIN), user_controllers_1.UserControllers.getMyUserProfileData);
//// update my profile
router.patch("/update-my-profile", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controllers_1.UserControllers.updateMyProfile(req, res, next);
});
/// update every userProfile data
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), user_controllers_1.UserControllers.updateEveryUserProfileData);
exports.UserRoutes = router;
