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
exports.UserServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const hashPasswordHelper_1 = require("../../../helpers/hashPasswordHelper");
const client_1 = require("@prisma/client");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
/// Create Admin
const createAdminIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const hashPassword = yield (0, hashPasswordHelper_1.hashedPassword)(req.body.password);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield transactionClient.user.create({
            data: {
                email: req.body.admin.email,
                password: hashPassword,
                role: client_1.UserRole.ADMIN,
            },
        });
        const newAdmin = yield transactionClient.admin.create({
            data: req.body.admin,
        });
        return newAdmin;
    }));
    return result;
});
/// Create Seller
const createSellerIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        req.body.seller.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const hashPassword = yield (0, hashPasswordHelper_1.hashedPassword)(req.body.password);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield transactionClient.user.create({
            data: {
                email: req.body.prifileData.email,
                password: hashPassword,
                role: client_1.UserRole.SELLER,
            },
        });
        const newSeller = yield transactionClient.seller.create({
            data: req.body.prifileData,
        });
        return newSeller;
    }));
    return result;
});
/// Create Buyer
const createBuyerIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        req.body.buyer.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    const hashPassword = yield (0, hashPasswordHelper_1.hashedPassword)(req.body.password);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield transactionClient.user.create({
            data: {
                email: req.body.prifileData.email,
                password: hashPassword,
                role: client_1.UserRole.BUYER,
            },
        });
        const newBuyer = yield transactionClient.buyer.create({
            data: req.body.prifileData,
        });
        return newBuyer;
    }));
    return result;
});
//// get My Profile
const getMyProfileIntoDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            id: authUser.userId,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            email: true,
            role: true,
            status: true,
        },
    });
    let profileData;
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.ADMIN) {
        profileData = yield prisma_1.default.admin.findUnique({
            where: {
                email: userData === null || userData === void 0 ? void 0 : userData.email,
            },
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.BUYER) {
        profileData = yield prisma_1.default.buyer.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.SELLER) {
        profileData = yield prisma_1.default.seller.findUnique({
            where: {
                email: userData.email,
            },
        });
    }
    return Object.assign(Object.assign({}, profileData), userData);
});
//// update my profile
const updateMyProfileIntoDB = (authUser, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            id: authUser.userId,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            email: true,
            role: true,
            status: true,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User does not exists!");
    }
    const file = req.file;
    // console.log(file, 'masud');
    req.body.profilePhoto = file === null || file === void 0 ? void 0 : file.path;
    // if (file) {
    //   const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
    //     file
    //   );
    //   req.body.profilePhoto = uploadedProfileImage?.secure_url;
    // }
    let profileData;
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.ADMIN) {
        profileData = yield prisma_1.default.admin.update({
            where: {
                email: userData === null || userData === void 0 ? void 0 : userData.email,
            },
            data: req.body,
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.SELLER) {
        profileData = yield prisma_1.default.seller.update({
            where: {
                email: userData === null || userData === void 0 ? void 0 : userData.email,
            },
            data: req.body,
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.BUYER) {
        profileData = yield prisma_1.default.buyer.update({
            where: {
                email: userData === null || userData === void 0 ? void 0 : userData.email,
            },
            data: req.body,
        });
    }
    return Object.assign(Object.assign({}, profileData), userData);
});
/// Update user status (Seller & Buyer)
const updateUserStatusIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        select: {
            email: true,
            role: true,
            status: true,
        },
        data: payload,
    });
    return result;
});
exports.UserServices = {
    createAdminIntoDB,
    createSellerIntoDB,
    createBuyerIntoDB,
    getMyProfileIntoDB,
    updateMyProfileIntoDB,
    updateUserStatusIntoDB,
};
