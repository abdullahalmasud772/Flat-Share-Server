"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string(),
    admin: zod_1.z.object({
        email: zod_1.z.string().email(),
        name: zod_1.z.string(),
        contactNumber: zod_1.z.string(),
    }),
});
const createSeller = zod_1.z.object({
    password: zod_1.z.string(),
    prifileData: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        bio: zod_1.z.string().optional(),
        profession: zod_1.z.string(),
        contactNumber: zod_1.z.string(),
        address: zod_1.z.string(),
        gender: zod_1.z.enum(["MALE", "FEMALE"]),
    }),
});
const createBuyer = zod_1.z.object({
    password: zod_1.z.string(),
    prifileData: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email(),
        bio: zod_1.z.string().optional(),
        profession: zod_1.z.string(),
        contactNumber: zod_1.z.string(),
        address: zod_1.z.string(),
        gender: zod_1.z.enum(["MALE", "FEMALE"]),
    }),
});
exports.UserValidation = {
    createAdmin,
    createSeller,
    createBuyer,
};
