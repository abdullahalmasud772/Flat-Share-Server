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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_services_1 = require("./user.services");
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_services_1.userServices.createUserIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User created successfully!",
        data: {
            id: result === null || result === void 0 ? void 0 : result.newUser.id,
            name: result === null || result === void 0 ? void 0 : result.userProfile.name,
            username: result === null || result === void 0 ? void 0 : result.newUser.username,
            email: result === null || result === void 0 ? void 0 : result.newUser.email,
            gender: (_a = result === null || result === void 0 ? void 0 : result.userProfile) === null || _a === void 0 ? void 0 : _a.gender,
            bio: result === null || result === void 0 ? void 0 : result.userProfile.bio,
            profession: result === null || result === void 0 ? void 0 : result.userProfile.profession,
            address: result === null || result === void 0 ? void 0 : result.userProfile.address,
            profilePhoto: result === null || result === void 0 ? void 0 : result.userProfile.profilePhoto,
        },
    });
}));
/// seller
const getSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.getSellerIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get all seller successfullay!",
        data: result,
    });
}));
const getSingleSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_services_1.userServices.getSingleSellerIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get single seller successfullay!",
        data: result,
    });
}));
const updateSingleSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_services_1.userServices.updateSingleSellerIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Update single seller successfullay!",
        data: result,
    });
}));
//// buyer
const getBuyer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.getBuyerIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get all buyer successfullay!",
        data: result,
    });
}));
const getSingleBuyer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_services_1.userServices.getSingleBuyerIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get single buyer successfullay!",
        data: result,
    });
}));
const updateSingleBuyer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_services_1.userServices.updateSingleBuyerIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Update single buyer successfullay!",
        data: result,
    });
}));
/// get my profile
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_services_1.userServices.getMyProfileIntoDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get my profile successfully!",
        data: result,
    });
}));
/// get my userProfile data
const getMyUserProfileData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_services_1.userServices.getMyUserProfileDataIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get my user profile data fetched!",
        data: result,
    });
}));
/// update user info
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_services_1.userServices.updateMyProfileIntoDB(user, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Update Profile data fetched!",
        data: result,
    });
}));
//// update user profile data
const updateEveryUserProfileData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const doctorData = __rest(payload, []);
    const result = yield user_services_1.userServices.updateEveryUserProfileDataIntoDB(id, doctorData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Update userProfile data fetched!",
        data: result,
    });
}));
exports.UserControllers = {
    createUser,
    getSeller,
    getSingleSeller,
    updateSingleSeller,
    getBuyer,
    getSingleBuyer,
    updateSingleBuyer,
    getMyProfile,
    getMyUserProfileData,
    updateMyProfile,
    updateEveryUserProfileData,
};
