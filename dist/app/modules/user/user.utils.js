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
exports.generateUserId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Find the last user ID (admin, seller, buyer)
const findLastUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastUser = yield prisma.user.findFirst({
        orderBy: {
            createdAt: 'desc', // Sort by createdAt in descending order
        },
        select: {
            userId: true, // Only select the userId field
        },
    });
    // If a lastUser exists, return the last part of the userId
    return (lastUser === null || lastUser === void 0 ? void 0 : lastUser.userId) ? lastUser.userId.substring(2) : undefined;
});
// Generate a new user ID
const generateUserId = (role) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the last user's ID and extract the numeric part
    const currentId = (yield findLastUserId()) || (0).toString();
    // Increment the numeric part by 1 and pad it to 6 digits
    let incrementId = (Number(currentId) + 1).toString().padStart(6, '0');
    // Prefix with the role letter to generate the new user ID
    let prefix = '';
    switch (role) {
        case 'admin':
            prefix = 'A-';
            break;
        case 'seller':
            prefix = 'S-';
            break;
        case 'buyer':
            prefix = 'B-';
            break;
    }
    incrementId = `${prefix}${incrementId}`;
    return incrementId;
});
exports.generateUserId = generateUserId;
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// // Find the last admin ID
// const findLastAdminId = async () => {
//   const lastAdmin = await prisma.user.findFirst({
//     where: {
//       role: 'ADMIN',
//     },
//     orderBy: {
//       createdAt: 'desc',  // Sort by createdAt in descending order
//     },
//     select: {
//       userId: true,  // Only select the userId field
//     },
//   });
//   // If a lastAdmin exists, return the last part of the userId
//   return lastAdmin?.userId ? lastAdmin.userId.substring(2) : undefined;
// };
// // Generate a new admin ID
// export const generateAdminId = async () => {
//   // Get the last admin's ID and extract the numeric part
//   const currentId = (await findLastAdminId()) || (0).toString();
//   // Increment the numeric part by 1 and pad it to 4 digits
//   let incrementId = (Number(currentId) + 1).toString().padStart(6, '0');
//   // Prefix with "A-" to generate the new admin ID
//   incrementId = `A-${incrementId}`;
//   return incrementId;
// };
// // Find the last Seller ID
// const findLastSellerId = async () => {
//   const lastAdmin = await prisma.user.findFirst({
//     where: {
//       role: 'SELLER',
//     },
//     orderBy: {
//       createdAt: 'desc',  // Sort by createdAt in descending order
//     },
//     select: {
//       userId: true,  // Only select the userId field
//     },
//   });
//   // If a lastAdmin exists, return the last part of the userId
//   return lastAdmin?.userId ? lastAdmin.userId.substring(2) : undefined;
// };
// // Generate a new admin ID
// export const generateSellerId = async () => {
//   // Get the last admin's ID and extract the numeric part
//   const currentId = (await findLastSellerId()) || (0).toString();
//   // Increment the numeric part by 1 and pad it to 4 digits
//   let incrementId = (Number(currentId) + 1).toString().padStart(6, '0');
//   // Prefix with "A-" to generate the new admin ID
//   incrementId = `S-${incrementId}`;
//   return incrementId;
// };
// // Find the last Seller ID
// const findLastBuyerId = async () => {
//   const lastAdmin = await prisma.user.findFirst({
//     where: {
//       role: 'BUYER',
//     },
//     orderBy: {
//       createdAt: 'desc',  // Sort by createdAt in descending order
//     },
//     select: {
//       userId: true,  // Only select the userId field
//     },
//   });
//   // If a lastAdmin exists, return the last part of the userId
//   return lastAdmin?.userId ? lastAdmin.userId.substring(2) : undefined;
// };
// // Generate a new admin ID
// export const generateBuyerId = async () => {
//   // Get the last admin's ID and extract the numeric part
//   const currentId = (await findLastBuyerId()) || (0).toString();
//   // Increment the numeric part by 1 and pad it to 4 digits
//   let incrementId = (Number(currentId) + 1).toString().padStart(6, '0');
//   // Prefix with "A-" to generate the new admin ID
//   incrementId = `B-${incrementId}`;
//   return incrementId;
// };
