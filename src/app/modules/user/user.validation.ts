import { z } from "zod";

const createAdmin = z.object({
  password: z.string(),
  admin: z.object({
    email: z.string().email(),
    name: z.string(),
    contactNumber: z.string(),
  }),
});

const createSeller = z.object({
  password: z.string(),
  seller: z.object({
    name: z.string(),
    email: z.string().email(),
    bio: z.string().optional(),
    profession: z.string(),
    contactNumber: z.string(),
    address: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
  }),
});

const createBuyer = z.object({
  password: z.string(),
  buyer: z.object({
    name: z.string(),
    email: z.string().email(),
    bio: z.string().optional(),
    profession: z.string(),
    contactNumber: z.string(),
    address: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
  }),
});

export const UserValidation = {
  createAdmin,
  createSeller,
  createBuyer,
};
