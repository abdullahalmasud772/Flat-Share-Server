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
exports.generateFlatNumber = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Async function to fetch the last flat number from the database
const fetchLastFlatNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the last flat record from the database, sorted by createdAt in descending order
    const lastFlat = yield prisma.flat.findFirst({
        orderBy: {
            createdAt: 'desc', // Sort by createdAt to get the latest entry
        },
        select: {
            flatNo: true, // Select only the flatNo field
        },
    });
    // If a lastFlat exists, return the numeric part of the flatNo (remove 'FL-' prefix)
    return (lastFlat === null || lastFlat === void 0 ? void 0 : lastFlat.flatNo) ? lastFlat.flatNo.substring(3) : undefined;
});
// Async function to generate a new flat number with "FL-" prefix
const generateFlatNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the last flat number asynchronously
    const lastFlatNumber = yield fetchLastFlatNumber();
    // Extract the numeric part and convert to a number, or start from 0 if no previous number exists
    const currentFlatNumber = lastFlatNumber ? Number(lastFlatNumber) : 0;
    // Increment the flat number by 1
    const newFlatNumber = (currentFlatNumber + 1).toString().padStart(8, '0');
    // Return the new flat number with "FL-" prefix
    return `FL-${newFlatNumber}`;
});
exports.generateFlatNumber = generateFlatNumber;
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// // Find the last admin ID
// const findLastFlatNo = async () => {
//   const lastFlat = await prisma.flat.findFirst({
//     // where: {
//     //   role: 'ADMIN',
//     // },
//     orderBy: {
//       createdAt: 'desc',  // Sort by createdAt in descending order
//     },
//     select: {
//       flatNo: true,  // Only select the userId field
//     },
//   });
//   // If a lastAdmin exists, return the last part of the userId
//   return lastFlat?.flatNo ? lastFlat.flatNo.substring(2) : undefined;
// };
// // Generate a new admin ID
// export const generateFlatNo = async () => {
//   // Get the last admin's ID and extract the numeric part
//   const currentId = (await findLastFlatNo()) || (0).toString();
//   // Increment the numeric part by 1 and pad it to 4 digits
//   let incrementId = (Number(currentId) + 1).toString().padStart(8, '0');
//   // Prefix with "A-" to generate the new admin ID
//   incrementId = `FL-${incrementId}`;
//   console.log(incrementId)
//   return incrementId;
// };
