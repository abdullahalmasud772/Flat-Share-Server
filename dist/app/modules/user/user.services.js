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
exports.userServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const hashPasswordHelper_1 = require("../../../helpers/hashPasswordHelper");
const client_1 = require("@prisma/client");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const user = req === null || req === void 0 ? void 0 : req.user;
    if (file) {
        const uploadedProfileImage = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        req.body.user.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    if (req.body.role === "ADMIN" && !((user === null || user === void 0 ? void 0 : user.role) === "ADMIN")) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
    }
    const hashPassword = yield (0, hashPasswordHelper_1.hashedPassword)(req.body.password);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield transactionClient.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
                role: req.body.role,
            },
        });
        const userProfile = yield transactionClient.userProfile.create({
            data: {
                userId: newUser.id,
                name: req.body.user.name,
                email: req.body.email,
                contactNumber: Number(req.body.user.contactNumber),
                gender: req.body.user.gender,
                profession: req.body.user.profession,
                address: req.body.user.address,
                profilePhoto: req.body.user.profilePhoto,
            },
        });
        return { newUser, userProfile };
    }));
    return result;
});
/////// seller
const getSellerIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            role: "SELLER",
        },
        include: {
            userProfile: true,
        },
    });
    return result;
});
const getSingleSellerIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            userProfile: true,
        },
    });
    return result;
});
const updateSingleSellerIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
/////  buyer
const getBuyerIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            role: "BUYER",
        },
        include: {
            userProfile: true,
        },
    });
    return result;
});
const getSingleBuyerIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            userProfile: true,
        },
    });
    return result;
});
const updateSingleBuyerIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
//// get Me
const getMyProfileIntoDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            id: authUser.userId,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            username: true,
            status: true,
        },
    });
    let profileData;
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.ADMIN) {
        profileData = yield prisma_1.default.userProfile.findUnique({
            where: {
                userId: userData === null || userData === void 0 ? void 0 : userData.id,
            },
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.BUYER) {
        profileData = yield prisma_1.default.userProfile.findUnique({
            where: {
                userId: userData.id,
            },
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.SELLER) {
        profileData = yield prisma_1.default.userProfile.findUnique({
            where: {
                userId: userData.id,
            },
        });
    }
    return Object.assign(Object.assign({}, profileData), { userData });
});
/// get my userProfile data
const getMyUserProfileDataIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.userProfile.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });
    return result;
});
//// update user profile
const updateMyProfileIntoDB = (authUser, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            id: authUser.userId,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User does not exists!");
    }
    const file = req.file;
    if (file) {
        const uploadedProfileImage = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
        req.body.profilePhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
    }
    let profileData;
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.ADMIN) {
        profileData = yield prisma_1.default.userProfile.update({
            where: {
                userId: userData === null || userData === void 0 ? void 0 : userData.id,
            },
            data: req.body,
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.SELLER) {
        profileData = yield prisma_1.default.userProfile.update({
            where: {
                userId: userData === null || userData === void 0 ? void 0 : userData.id,
            },
            data: req.body,
        });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === client_1.UserRole.BUYER) {
        profileData = yield prisma_1.default.userProfile.update({
            where: {
                userId: userData === null || userData === void 0 ? void 0 : userData.id,
            },
            data: req.body,
        });
    }
    console.log(profileData, userData);
    return Object.assign(Object.assign({}, profileData), userData);
});
const updateEveryUserProfileDataIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfileData = __rest(payload, []);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield transactionClient.userProfile.update({
            where: {
                id,
            },
            data: userProfileData,
        });
        if (!res) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to update userProfile data!");
        }
        return res;
    }));
    return result;
});
exports.userServices = {
    createUserIntoDB,
    getSellerIntoDB,
    getSingleSellerIntoDB,
    updateSingleSellerIntoDB,
    getBuyerIntoDB,
    getSingleBuyerIntoDB,
    updateSingleBuyerIntoDB,
    getMyProfileIntoDB,
    getMyUserProfileDataIntoDB,
    updateMyProfileIntoDB,
    updateEveryUserProfileDataIntoDB,
};
