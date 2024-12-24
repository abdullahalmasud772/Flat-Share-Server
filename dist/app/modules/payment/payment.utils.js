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
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
// র‍্যান্ডম 4 অক্ষরের অ্যালফা-নিউমেরিক জেনারেটর ফাংশন
const generateRandomAlphaNumeric = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
// Transaction ID তৈরির জন্য async ফাংশন
const generateTransactionId = () => __awaiter(void 0, void 0, void 0, function* () {
    // 4 অক্ষরের র‍্যান্ডম অ্যালফা-নিউমেরিক তৈরি
    const randomPart = generateRandomAlphaNumeric();
    // বর্তমান তারিখ এবং সময়কে ফরম্যাট করা (YYMMDDHHmm)
    const currentDateTime = new Date();
    const formattedDateTime = (0, date_fns_1.format)(currentDateTime, "yyMMddHHmm"); // ফরম্যাট করা YYMMDDHHmm আকারে
    // Transaction ID তৈরি করা
    const transactionId = `TX${randomPart}${formattedDateTime}`;
    return transactionId;
});
exports.default = generateTransactionId;
