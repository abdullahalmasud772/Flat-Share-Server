import { format } from "date-fns";

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
const generateTransactionId = async () => {
  // 4 অক্ষরের র‍্যান্ডম অ্যালফা-নিউমেরিক তৈরি
  const randomPart = generateRandomAlphaNumeric();

  // বর্তমান তারিখ এবং সময়কে ফরম্যাট করা (YYMMDDHHmm)
  const currentDateTime = new Date();
  const formattedDateTime = format(currentDateTime, "yyMMddHHmm"); // ফরম্যাট করা YYMMDDHHmm আকারে

  // Transaction ID তৈরি করা
  const transactionId = `TX${randomPart}${formattedDateTime}`;

  return transactionId;
};

export default generateTransactionId;
