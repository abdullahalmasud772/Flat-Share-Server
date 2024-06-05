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
exports.FlatServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const flat_constant_1 = require("./flat.constant");
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createFlatIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const file = req.file;
    if ((user === null || user === void 0 ? void 0 : user.role) === "SELLER") {
        if (file) {
            const uploadedProfileImage = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file);
            req.body.flatPhoto = uploadedProfileImage === null || uploadedProfileImage === void 0 ? void 0 : uploadedProfileImage.secure_url;
        }
        const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            const createFlat = yield transactionClient.flat.create({
                data: {
                    userId: user === null || user === void 0 ? void 0 : user.userId,
                    flatName: req.body.flatName,
                    squareFeet: req.body.squareFeet,
                    totalBedrooms: req.body.totalBedrooms,
                    totalRooms: req.body.totalRooms,
                    utilitiesDescription: req.body.utilitiesDescription,
                    location: req.body.location,
                    description: req.body.description,
                    amenities: req.body.amenities,
                    rent: req.body.rent,
                    advanceAmount: req.body.advanceAmount,
                    flatPhoto: req.body.flatPhoto,
                },
            });
            console.log(createFlat);
            return createFlat;
        }));
        return result;
    }
    else {
        console.log("You are not parmited!");
    }
});
const getAllFlatsIntoDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(filters);
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    //// search Term
    if (searchTerm) {
        andConditions.push({
            OR: flat_constant_1.flatSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.flat.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: "desc",
            },
        include: {
            user: true,
        },
    });
    const total = yield prisma_1.default.flat.count({
        where: whereConditions,
    });
    // const result = await prisma.flat.findMany({
    //   where: whereConditions,
    // });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSellerFlatsIntoDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user);
    const result = yield prisma_1.default.flat.findMany({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.userId,
        },
    });
    return result;
});
const getSingleFlatIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return result;
});
const updateFlatIntoDB = (flatId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flat.findUniqueOrThrow({
        where: {
            id: flatId,
        },
    });
    const result = yield prisma_1.default.flat.update({
        where: {
            id: flatId,
        },
        data,
    });
    return result;
});
exports.FlatServices = {
    createFlatIntoDB,
    getAllFlatsIntoDB,
    getSellerFlatsIntoDB,
    getSingleFlatIntoDB,
    updateFlatIntoDB,
};
