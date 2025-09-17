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
exports.FlatController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const flat_services_1 = require("./flat.services");
const sendUniqeResponse_1 = __importDefault(require("../../../shared/sendUniqeResponse"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const flat_constant_1 = require("./flat.constant");
const createFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flat_services_1.FlatServices.createFlatIntoDB(req);
    (0, sendUniqeResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Flat added successfully",
        data: result,
    });
}));
const getAllFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, flat_constant_1.flatFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield flat_services_1.FlatServices.getAllFlatIntoDB(filters, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Flats retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getSellerFlats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const result = yield flat_services_1.FlatServices.getSellerFlatsIntoDB(user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Get Seller flats retrieved successfully",
        data: result,
    });
}));
const getSingleFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield flat_services_1.FlatServices.getSingleFlatIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single flat retrieval successfully",
        data: result,
    });
}));
const updateFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(req.body);
    const result = yield flat_services_1.FlatServices.updateFlatIntoDB(id, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Flat information updated successfully",
        data: result,
    });
}));
const softDeleteFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield flat_services_1.FlatServices.deleteFlatIntoDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Flat soft deleted successfully",
        data: result,
    });
}));
const deleteFlat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield flat_services_1.FlatServices.deleteFlatIntoDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Flat deleted successfully",
        data: result,
    });
}));
exports.FlatController = {
    createFlat,
    getAllFlat,
    getSellerFlats,
    getSingleFlat,
    updateFlat,
    softDeleteFlat,
    deleteFlat,
};
