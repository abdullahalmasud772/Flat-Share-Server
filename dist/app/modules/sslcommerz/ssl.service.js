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
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: config_1.default.ssl.ssl_store_id,
            store_passwd: config_1.default.ssl.ssl_store_passwd,
            total_amount: paymentData === null || paymentData === void 0 ? void 0 : paymentData.total_amount,
            currency: "BDT",
            tran_id: paymentData === null || paymentData === void 0 ? void 0 : paymentData.transactionId,
            success_url: config_1.default.ssl.ssl_success_url,
            fail_url: config_1.default.ssl.ssl_fail_url,
            cancel_url: config_1.default.ssl.ssl_cancel_url,
            ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: paymentData === null || paymentData === void 0 ? void 0 : paymentData.product_name,
            product_category: "Electronic",
            product_profile: "N/A",
            cus_name: paymentData === null || paymentData === void 0 ? void 0 : paymentData.cus_name,
            cus_email: paymentData === null || paymentData === void 0 ? void 0 : paymentData.cus_email,
            cus_add1: paymentData === null || paymentData === void 0 ? void 0 : paymentData.cus_address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: paymentData === null || paymentData === void 0 ? void 0 : paymentData.cus_phone,
            cus_fax: "N/A",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: "N/A",
            ship_country: "Bangladesh",
        };
        const response = yield (0, axios_1.default)({
            method: "post",
            url: config_1.default.ssl.ssl_payment_url,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response === null || response === void 0 ? void 0 : response.data;
    }
    catch (error) {
        console.log(error);
    }
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            method: "GET",
            url: `${config_1.default.ssl.ssl_validation_api}?val_id=${payload === null || payload === void 0 ? void 0 : payload.val_id}&store_id=${config_1.default.ssl.ssl_store_id}&store_passwd=${config_1.default.ssl.ssl_store_passwd}&format=json`,
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
});
exports.SSLService = {
    initPayment,
    validatePayment,
};
