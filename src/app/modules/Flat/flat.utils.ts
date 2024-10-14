
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Async function to fetch the last flat number from the database
const fetchLastFlatNumber = async () => {
  // Fetch the last flat record from the database, sorted by createdAt in descending order
  const lastFlat = await prisma.flat.findFirst({
    orderBy: {
      createdAt: 'desc',  // Sort by createdAt to get the latest entry
    },
    select: {
      flatNo: true,  // Select only the flatNo field
    },
  });

  // If a lastFlat exists, return the numeric part of the flatNo (remove 'FL-' prefix)
  return lastFlat?.flatNo ? lastFlat.flatNo.substring(3) : undefined;
};

// Async function to generate a new flat number with "FL-" prefix
export const generateFlatNumber = async () => {
  // Fetch the last flat number asynchronously
  const lastFlatNumber = await fetchLastFlatNumber();

  // Extract the numeric part and convert to a number, or start from 0 if no previous number exists
  const currentFlatNumber = lastFlatNumber ? Number(lastFlatNumber) : 0;

  // Increment the flat number by 1
  const newFlatNumber = (currentFlatNumber + 1).toString().padStart(8, '0');

  // Return the new flat number with "FL-" prefix
  return `FL-${newFlatNumber}`;
};













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